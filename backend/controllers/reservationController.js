const db = require("../config/db");

// 🔧 Helper untuk hitung selisih hari (jika dibutuhkan)
const countDays = (start, end) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((new Date(end) - new Date(start)) / msPerDay);
};

// Buat reservasi (insert)
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

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // Insert ke reservations (trigger akan otomatis insert ke payments)
        const [reservationResult] = await conn.query(
            `INSERT INTO reservations 
             (guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price]
        );

        const reservation_id = reservationResult.insertId;

        await conn.commit();

        res.status(201).json({
            message: "Reservasi berhasil disimpan",
            reservation_id,
        });

    } catch (err) {
        await conn.rollback();
        console.error("Gagal simpan reservasi:", err);
        res.status(500).json({ message: "Gagal menyimpan reservasi" });
    } finally {
        conn.release();
    }
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

    try {
        await db.query(
            `UPDATE reservations SET 
             guest_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?, 
             number_of_guests = ?, status = ?, total_price = ? 
             WHERE reservation_id = ?`,
            [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price, id]
        );

        // Jika status diubah ke "checked_out", panggil prosedur untuk update biaya tambahan
        if (status === "checked_out") {
            await db.query("CALL update_additional_fee_and_notes(?)", [id]);
        }

        res.json({ message: "Reservasi berhasil diupdate" });

    } catch (err) {
        console.error("Gagal update reservasi:", err);
        res.status(500).json({ message: "Gagal mengupdate reservasi" });
    }
};

// Ambil semua reservasi
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

// Ambil reservasi berdasarkan ID
exports.getReservationById = async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await db.query(`
            SELECT r.*, g.full_name AS guest_name, rm.room_number
            FROM reservations r
            JOIN guests g ON r.guest_id = g.guest_id
            JOIN rooms rm ON r.room_id = rm.room_id
            WHERE r.reservation_id = ?`,
            [id]
        );

        if (results.length === 0) {
            return res.status(404).json({ message: "Reservasi tidak ditemukan." });
        }

        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil detail reservasi." });
    }
};

// Hapus reservasi
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
