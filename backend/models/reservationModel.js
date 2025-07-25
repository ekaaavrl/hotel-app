// Ganti semua `id` → `reservation_id`

const getAllReservations = () => {
    return db.query(`
    SELECT r.reservation_id, g.full_name AS guest_name, rm.room_number, 
           r.check_in_date, r.check_out_date, r.status, r.total_price
    FROM reservations r
    JOIN guests g ON r.guest_id = g.guest_id
    JOIN rooms rm ON r.room_id = rm.room_id
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

const updateReservation = (reservation_id, { guest_id, room_id, check_in_date, check_out_date, status, total_price }) => {
    return db.query(
        `UPDATE reservations 
     SET guest_id=?, room_id=?, check_in_date=?, check_out_date=?, status=?, total_price=?
     WHERE reservation_id=?`,
        [guest_id, room_id, check_in_date, check_out_date, status, total_price, reservation_id]
    );
};

const deleteReservation = (reservation_id) => {
    return db.query(`DELETE FROM reservations WHERE reservation_id=?`, [reservation_id]);
};

module.exports = {
    getAllReservations,
    createReservation,
    updateReservation,
    deleteReservation,
};
