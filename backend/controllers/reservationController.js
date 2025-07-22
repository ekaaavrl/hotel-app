const db = require("../config/db");

// 🔧 Helper untuk hitung selisih hari
const countDays = (start, end) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((new Date(end) - new Date(start)) / msPerDay);
};

// 🔁 Buat reservasi
exports.createReservation = async (req, res) => {
    let { guest_id, room_id, check_in_date, check_out_date, number_of_guests, status } = req.body;

    try {
        // Format tanggal ke YYYY-MM-DD
        check_in_date = new Date(check_in_date).toISOString().split("T")[0];
        check_out_date = new Date(check_out_date).toISOString().split("T")[0];

        // 1️⃣ Validasi ketersediaan kamar
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

        // 3️⃣ Ambil harga kamar
        const [roomData] = await db.query(`SELECT price_per_night FROM rooms WHERE room_id = ?`, [room_id]);
        if (!roomData.length) {
            return res.status(404).json({ message: "Data kamar tidak ditemukan." });
        }

        const pricePerNight = roomData[0].price_per_night;
        const total_price = pricePerNight * days;

        // 4️⃣ Simpan reservasi
        await db.query(`
            INSERT INTO reservations 
                (guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status || "booked", total_price]);

        res.status(201).json({ message: "Reservasi berhasil disimpan.", total_price });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menyimpan reservasi.", error: err.message });
    }
};

// 📥 Ambil semua reservasi
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

// ✏️ Update reservasi
exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    let {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        status,
    } = req.body;

    // Format tanggal
    if (check_in_date.includes("T")) {
        check_in_date = check_in_date.split("T")[0];
    }
    if (check_out_date.includes("T")) {
        check_out_date = check_out_date.split("T")[0];
    }

    try {
        const [result] = await db.query(`
            UPDATE reservations
            SET guest_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, number_of_guests = ?, status = ?
            WHERE reservation_id = ?
        `, [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json({ message: "Reservation updated successfully" });
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({ error: "Failed to update reservation" });
    }
};
// 🗑️ Hapus reservasi
exports.deleteReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            `DELETE FROM reservations WHERE reservation_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Reservasi tidak ditemukan." });
        }

        res.json({ message: "Reservasi berhasil dihapus." });
    } catch (error) {
        console.error("Gagal menghapus reservasi:", error);
        res.status(500).json({ message: "Gagal menghapus reservasi." });
    }
};
// 📄 Ambil satu reservasi berdasarkan ID
exports.getReservationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(`
            SELECT r.*, g.full_name AS guest_name, rm.room_number
            FROM reservations r
            JOIN guests g ON r.guest_id = g.guest_id
            JOIN rooms rm ON r.room_id = rm.room_id
            WHERE r.reservation_id = ?
        `, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: "Reservasi tidak ditemukan." });
        }

        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil detail reservasi." });
    }
};
