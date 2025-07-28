const db = require("../config/db");

// Ambil semua pembayaran dengan nama tamu
const getAllPayments = async () => {
    const [rows] = await db.query(`
        SELECT p.*, g.full_name AS guest_name
        FROM payments p
        JOIN reservations r ON p.reservation_id = r.reservation_id
        JOIN guests g ON r.guest_id = g.guest_id
        ORDER BY p.payment_date DESC
    `);
    return rows;
};

const getAllPaymentsWithServiceFee = async () => {
    const [rows] = await db.query(`
        SELECT 
            p.*, 
            g.full_name AS guest_name,
            r.total_price,
            (
                SELECT IFNULL(SUM(rs.fee), 0)
                FROM room_service_requests rs
                WHERE rs.reservation_id = p.reservation_id AND rs.status = 'completed'
            ) AS service_fee
        FROM payments p
        JOIN reservations r ON p.reservation_id = r.reservation_id
        JOIN guests g ON r.guest_id = g.guest_id
        ORDER BY p.payment_date DESC
    `);
    return rows;
};

// Tambah data pembayaran
const createPayment = async ({ reservation_id, amount_paid, payment_method, notes, additional_fee }) => {
    await db.query(`
        INSERT INTO payments (reservation_id, amount_paid, payment_method, notes, additional_fee)
        VALUES (?, ?, ?, ?, ?)
    `, [reservation_id, amount_paid, payment_method, notes || "", additional_fee || 0]);
};

// Update data pembayaran
const updatePayment = async (id, { reservation_id, amount_paid, payment_method, notes, additional_fee }) => {
    await db.query(`
        UPDATE payments
        SET reservation_id = ?, amount_paid = ?, payment_method = ?, notes = ?, additional_fee = ?
        WHERE payment_id = ?
    `, [reservation_id, amount_paid, payment_method, notes || "", additional_fee || 0, id]);
};

// Hapus pembayaran
const deletePayment = async (id) => {
    const [result] = await db.query(`DELETE FROM payments WHERE payment_id = ?`, [id]);
    if (result.affectedRows === 0) {
        throw new Error("Pembayaran tidak ditemukan atau sudah dihapus.");
    }
};


module.exports = {
    getAllPayments,
    getAllPaymentsWithServiceFee,
    createPayment,
    updatePayment,
    deletePayment,
};