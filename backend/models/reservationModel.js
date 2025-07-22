const db = require("../config/db");

const getAllReservations = () => {
    return db.query(`
    SELECT r.id, g.full_name AS guest_name, rm.room_number, 
           r.check_in_date, r.check_out_date, r.status, r.total_price
    FROM reservations r
    JOIN guests g ON r.guest_id = g.id
    JOIN rooms rm ON r.room_id = rm.id
    ORDER BY r.check_in_date DESC
  `);
};

const createReservation = ({ guest_id, room_id, check_in_date, check_out_date, status, total_price }) => {
    return db.query(
        `INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, status, total_price)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [guest_id, room_id, check_in_date, check_out_date, status, total_price]
    );
};

const updateReservation = (id, { guest_id, room_id, check_in_date, check_out_date, status, total_price }) => {
    return db.query(
        `UPDATE reservations 
     SET guest_id=?, room_id=?, check_in_date=?, check_out_date=?, status=?, total_price=?
     WHERE id=?`,
        [guest_id, room_id, check_in_date, check_out_date, status, total_price, id]
    );
};

const deleteReservation = (id) => {
    return db.query(`DELETE FROM reservations WHERE id=?`, [id]);
};

module.exports = {
    getAllReservations,
    createReservation,
    updateReservation,
    deleteReservation,
};