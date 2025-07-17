const db = require("../config/db");

// 🔧 Helper untuk hitung selisih hari
const countDays = (start, end) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((new Date(end) - new Date(start)) / msPerDay);
};

exports.createReservation = async (req, res) => {
    const { guest_id, room_id, check_in_date, check_out_date, number_of_guests, status } = req.body;

    try {
        // 1️⃣ Validasi: apakah kamar tersedia
        const [conflict] = await db.query(`
      SELECT * FROM reservations
      WHERE room_id = ? 
        AND status IN ('booked', 'checked_in')
        AND (
          (check_in_date <= ? AND check_out_date > ?) OR
          (check_in_date < ? AND check_out_date >= ?)
        )
    `, [room_id, check_in_date, check_in_date, check_out_date, check_out_date]);

        if (conflict.length > 0) {
            return res.status(400).json({ message: "Kamar tidak tersedia di tanggal tersebut." });
        }

        // 2️⃣ Hitung jumlah malam
        const days = countDays(check_in_date, check_out_date);
        if (days <= 0) {
            return res.status(400).json({ message: "Tanggal check-out harus setelah check-in." });
        }

        // 3️⃣ Ambil harga per malam
        const [roomData] = await db.query(`SELECT price_per_night FROM rooms WHERE room_id = ?`, [room_id]);
        if (!roomData.length) {
            return res.status(404).json({ message: "Data kamar tidak ditemukan." });
        }

        const pricePerNight = roomData[0].price_per_night;
        const total_price = pricePerNight * days;

        // 4️⃣ Simpan ke database
        await db.query(`
      INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, number_of_guests, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status || "booked"]);

        res.status(201).json({ message: "Reservasi berhasil disimpan.", total_price });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menyimpan reservasi.", error: err.message });
    }
};
exports.getReservations = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT r.*, g.full_name AS guest_name, rm.room_number
            FROM reservations r
            JOIN guests g ON r.guest_id = g.guest_id
            JOIN rooms rm ON r.room_id = rm.room_id
            ORDER BY r.created_at DESC
        `);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data reservasi." });
    }
};

