const Report = require("../models/reportModel");
const db = require("../config/db");

exports.getHistoryPayments = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, g.full_name AS guest_name
            FROM payments p
            JOIN reservations r ON p.reservation_id = r.reservation_id
            JOIN guests g ON r.guest_id = g.guest_id
            ORDER BY p.payment_date DESC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data pembayaran", error: err.message });
    }
};

exports.getDailyReservations = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                r.reservation_id,
                g.full_name AS guest_name,
                rm.room_number,
                rt.type_name AS room_type,
                r.check_in_date,
                r.check_out_date,
                r.number_of_guests,
                r.status
            FROM reservations r
            JOIN guests g ON r.guest_id = g.guest_id
            JOIN rooms rm ON r.room_id = rm.room_id
            JOIN room_types rt ON rm.room_type_id = rt.room_type_id
            WHERE DATE(r.check_in_date) = CURDATE()
            ORDER BY r.check_in_date ASC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data reservasi harian", error: err.message });
    }
};

exports.getIncomeReport = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                p.payment_id,
                r.reservation_id,
                g.full_name AS guest_name,
                p.payment_method,
                p.amount_paid,
                p.payment_date,
                p.notes
            FROM payments p
            JOIN reservations r ON p.reservation_id = r.reservation_id
            JOIN guests g ON r.guest_id = g.guest_id
            ORDER BY p.payment_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data pendapatan", error: err.message });
    }
};

exports.getRoomReport = async (req, res) => {
    try {
        const status = req.query.status || null;
        const data = await Report.getRoomReport(status);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data kamar" });
    }
};
