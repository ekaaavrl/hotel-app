const db = require("../config/db");

// 🔧 Helper untuk hitung selisih hari
const countDays = (start, end) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((new Date(end) - new Date(start)) / msPerDay);
};

// Buat reservasi
exports.createReservation = async (req, res) => {
    const {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        status,
        total_price,
    } = req.body;

    await db.query(
        `INSERT INTO reservations 
        (guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price]
    );

    res.status(201).json({ message: "Reservasi berhasil disimpan" });
};

// Update reservasi
exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    const {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        status,
        total_price,
    } = req.body;

    await db.query(
        `UPDATE reservations SET 
        guest_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, 
        number_of_guests = ?, status = ?, total_price = ? 
        WHERE reservation_id = ?`,
        [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price, id]
    );

    res.json({ message: "Reservasi berhasil diupdate" });
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
