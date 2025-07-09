const db = require("../config/db");

// 📜 History Transaksi Pembayaran
const getHistoryPayments = async () => {
    const [rows] = await db.query(`
        SELECT 
            p.payment_id,
            p.reservation_id,
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
    return rows;
};

// 📅 Laporan Reservasi Harian
const getDailyReservations = async () => {
    const [rows] = await db.query(`
        SELECT 
            r.reservation_id,
            g.full_name AS guest_name,
            rm.room_number,
            r.check_in_date,
            r.check_out_date,
            r.status
        FROM reservations r
        JOIN guests g ON r.guest_id = g.guest_id
        JOIN rooms rm ON r.room_id = rm.room_id
        WHERE DATE(r.check_in_date) = CURDATE()
        ORDER BY r.check_in_date ASC
    `);
    return rows;
};

// 💰 Laporan Pendapatan
const getIncomeReport = async () => {
    const [rows] = await db.query(`
        SELECT 
            DATE(payment_date) AS date,
            SUM(amount_paid) AS total_income
        FROM payments
        GROUP BY DATE(payment_date)
        ORDER BY date DESC
    `);
    return rows;
};

// 🛏️ Laporan Kamar (dengan filter status opsional)
const getRoomReport = async (status = null) => {
    let query = `
        SELECT 
            r.room_id,
            r.room_number,
            rt.type_name,
            r.price_per_night,
            r.status,
            r.description
        FROM rooms r
        JOIN room_types rt ON r.room_type_id = rt.room_type_id
    `;
    const params = [];

    if (status) {
        query += " WHERE r.status = ?";
        params.push(status);
    }

    query += " ORDER BY r.room_number ASC";

    const [rows] = await db.query(query, params);
    return rows;
};

module.exports = {
    getHistoryPayments,
    getDailyReservations,
    getIncomeReport,
    getRoomReport
};
