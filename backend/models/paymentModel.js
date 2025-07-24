const db = require("../config/db");

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

const createPayment = async (data) => {
    const { reservation_id, amount_paid, payment_method, notes, additional_fee } = data;
    await db.query(
        `INSERT INTO payments (reservation_id, amount_paid, payment_method, notes, additional_fee) 
         VALUES (?, ?, ?, ?, ?)`,
        [reservation_id, amount_paid, payment_method, notes, additional_fee]
    );
};

const updatePayment = async (id, data) => {
    const { reservation_id, amount_paid, payment_method, notes, additional_fee } = data;
    await db.query(
        `UPDATE payments 
         SET reservation_id = ?, amount_paid = ?, payment_method = ?, notes = ?, additional_fee = ?
         WHERE payment_id = ?`,
        [reservation_id, amount_paid, payment_method, notes, additional_fee, id]
    );
};

const deletePayment = async (id) => {
    await db.query(`DELETE FROM payments WHERE payment_id = ?`, [id]);
};

module.exports = {
    getAllPayments,
    createPayment,
    deletePayment,
    updatePayment,
};
