const db = require("../config/db");
const UserLogs = require("../models/userLogModel");

const countDays = (start, end) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil((new Date(end) - new Date(start)) / msPerDay);
};

exports.createReservation = async (req, res) => {
    const {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        status,
    } = req.body;

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [roomRows] = await conn.query(
            `SELECT price_per_night FROM rooms WHERE room_id = ?`,
            [room_id]
        );

        if (roomRows.length === 0) {
            throw new Error("Kamar tidak ditemukan");
        }

        const pricePerNight = roomRows[0].price_per_night;
        const totalDays = countDays(check_in_date, check_out_date);
        const total_price = pricePerNight * (totalDays > 0 ? totalDays : 1);

        const [reservationResult] = await conn.query(
            `INSERT INTO reservations 
             (guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [guest_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price]
        );

        await conn.commit();

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "create_reservation", `Membuat reservasi ID: ${reservationResult.insertId}`, ip);

        res.status(201).json({
            message: "Reservasi berhasil disimpan",
            reservation_id: reservationResult.insertId,
        });
    } catch (err) {
        await conn.rollback();
        console.error("Gagal simpan reservasi:", err);
        res.status(500).json({ message: "Gagal menyimpan reservasi" });
    } finally {
        conn.release();
    }
};

exports.updateReservation = async (req, res) => {
    const { id } = req.params;
    const {
        guest_id,
        room_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        status
    } = req.body;

    try {
        // Ambil harga kamar
        const [roomRows] = await db.query(
            `SELECT price_per_night FROM rooms WHERE room_id = ?`,
            [room_id]
        );

        if (roomRows.length === 0) {
            return res.status(400).json({ message: "Kamar tidak ditemukan." });
        }

        const pricePerNight = roomRows[0].price_per_night;
        const totalDays = countDays(check_in_date, check_out_date);
        const calculatedTotalPrice = pricePerNight * (totalDays > 0 ? totalDays : 1);

        // Update reservasi dengan total_price yang dihitung ulang
        await db.query(
            `UPDATE reservations SET 
             guest_id = ?, 
             room_id = ?, 
             check_in_date = ?, 
             check_out_date = ?, 
             number_of_guests = ?, 
             status = ?, 
             total_price = ? 
             WHERE reservation_id = ?`,
            [
                guest_id,
                room_id,
                check_in_date,
                check_out_date,
                number_of_guests,
                status,
                calculatedTotalPrice,
                id
            ]
        );

        if (status === "checked_out") {
            await db.query("CALL update_additional_fee_and_notes(?)", [id]);
        }

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        console.log(`[UPDATE RESERVATION] user_id: ${userId}, ip: ${ip}`); // ✅ debug

        await UserLogs.addLog(userId, "update_reservation", `Mengubah reservasi ID: ${id}`, ip);

        res.json({ message: "Reservasi berhasil diupdate" });

    } catch (err) {
        console.error("Gagal update reservasi:", err);
        res.status(500).json({ message: "Gagal mengupdate reservasi" });
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

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        console.log(`[DELETE RESERVATION] user_id: ${userId}, ip: ${ip}`); // ✅ debug

        await UserLogs.addLog(userId, "delete_reservation", `Menghapus reservasi ID: ${id}`, ip);

        res.json({ message: "Reservasi berhasil dihapus." });

    } catch (error) {
        console.error("Gagal menghapus reservasi:", error);
        res.status(500).json({ message: "Gagal menghapus reservasi." });
    }
};
