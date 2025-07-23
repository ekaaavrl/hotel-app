const db = require("../config/db");

//History Transaksi Pembayaran
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

//Laporan Reservasi Harian
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

//Laporan Pendapatan
const getIncomeReport = async (start, end) => {
    const [rows] = await db.query(`
        SELECT 
            DATE(payment_date) AS date,
            SUM(amount_paid) AS total
        FROM payments
        WHERE DATE(payment_date) BETWEEN ? AND ?
        GROUP BY DATE(payment_date)
        ORDER BY date DESC
    `, [start, end]);

    return rows;
};

//Laporan Kamar (dengan filter status opsional)
const getRoomReport = async (status = null) => {
    try {
        let baseQuery = `
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

        if (status && status !== 'all') {
            baseQuery = `
                SELECT * FROM (
                    ${baseQuery}
                ) AS room_status
                WHERE status = ?
                ORDER BY room_number ASC
            `;
            const [rows] = await db.query(baseQuery, [status]);
            return rows;
        } else {
            baseQuery += ` ORDER BY r.room_number ASC`;
            const [rows] = await db.query(baseQuery);
            return rows;
        }
    } catch (error) {
        console.error("Error in getRoomReport:", error);
        throw error;
    }
};

module.exports = {
    getHistoryPayments,
    getDailyReservations,
    getIncomeReport,
    getRoomReport,
};
