const db = require("../config/db");

exports.getAll = () => db.query("SELECT * FROM room_types ORDER BY room_type_id DESC");

exports.create = (data) =>
    db.query("INSERT INTO room_types (type_name, description, default_price) VALUES (?, ?, ?)", [
        data.type_name,
        data.description,
        data.default_price,
    ]);

exports.update = (id, data) =>
    db.query(
        "UPDATE room_types SET type_name = ?, description = ?, default_price = ? WHERE room_type_id = ?",
        [data.type_name, data.description, data.default_price, id]
    );

exports.remove = (id) =>
    db.query("DELETE FROM room_types WHERE room_type_id = ?", [id]);
