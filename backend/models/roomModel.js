const db = require("../config/db");

exports.getAll = () =>
    db.query(
        `SELECT r.*, rt.type_name 
     FROM rooms r 
     LEFT JOIN room_types rt ON r.room_type_id = rt.room_type_id 
     ORDER BY r.room_id DESC`
    );

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
