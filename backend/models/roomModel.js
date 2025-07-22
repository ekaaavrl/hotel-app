const db = require("../config/db");

exports.getAll = () =>
    db.query(`
        SELECT 
            r.room_id,
            r.room_number,
            r.room_type_id,
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
        LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id
        ORDER BY r.room_id DESC
    `);

exports.create = (data) =>
    db.query(
        "INSERT INTO rooms (room_number, room_type_id, price_per_night, status, description) VALUES (?, ?, ?, ?, ?)",
        [data.room_number, data.room_type_id, data.price_per_night, data.status, data.description]
    );

exports.update = (id, data) =>
    db.query(
        "UPDATE rooms SET room_number=?, room_type_id=?, price_per_night=?, status=?, description=? WHERE room_id=?",
        [data.room_number, data.room_type_id, data.price_per_night, data.status, data.description, id]
    );

exports.remove = (id) => db.query("DELETE FROM rooms WHERE room_id=?", [id]);
