const Report = require("../models/reportModel"); // <- Panggil model
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
        const selectedDate = req.query.date || new Date().toISOString().split("T")[0];

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
            WHERE 
                DATE(r.check_in_date) = ? 
                OR DATE(r.check_out_date) = ? 
                OR (r.status = 'booked' AND DATE(r.check_in_date) = ?)
            ORDER BY r.check_in_date ASC
        `, [selectedDate, selectedDate, selectedDate]);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data reservasi harian", error: err.message });
    }
};

exports.getIncomeReport = async (req, res) => {
    try {
        const { start, end } = req.query;
        const data = await Report.getIncomeReport(start, end);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil laporan pendapatan", error: err.message });
    }
};

// Laporan Kamar: Tampilkan jumlah kamar berdasarkan status dan tipe kamar
exports.getRoomReport = async (req, res) => {
    const { status } = req.query;
    try {
        let query = `
            SELECT 
                r.room_id,
                r.room_number,
                rt.type_name,
                r.price_per_night,
                r.description,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM reservations res
                        WHERE res.room_id = r.room_id
                        AND res.status = 'checked_in'
                        AND CURDATE() BETWEEN res.check_in_date AND res.check_out_date
                    ) THEN 'occupied'
                    ELSE r.status
                END AS status
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.room_type_id
        `;

        // Filter status jika dikirim
        if (status && status !== "all") {
            query = `
                SELECT * FROM (
                    ${query}
                ) AS subquery
                WHERE status = ?
                ORDER BY room_number ASC
            `;
            const [rows] = await db.query(query, [status]);
            return res.json(rows);
        } else {
            // Default: tampilkan semua kamar (status dinamis)
            query += ` ORDER BY r.room_number ASC`;
            const [rows] = await db.query(query);
            return res.json(rows);
        }
    } catch (error) {
        console.error("Gagal ambil data kamar:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil data kamar" });
    }
};
exports.getReservationHistory = async (req, res) => {
    try {
        const data = await Report.getReservationHistory();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil history reservasi", error: err.message });
    }
};

