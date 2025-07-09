const db = require("../config/db");

const Guest = {
    getAll: async () => {
        const [rows] = await db.query("SELECT * FROM guests ORDER BY created_at DESC");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query("SELECT * FROM guests WHERE guest_id = ?", [id]);
        return rows[0];
    },

    create: async (data) => {
        const { full_name, email, phone_number, address, id_number, nationality } = data;
        const [result] = await db.query(
            "INSERT INTO guests (full_name, email, phone_number, address, id_number, nationality) VALUES (?, ?, ?, ?, ?, ?)",
            [full_name, email, phone_number, address, id_number, nationality]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { full_name, email, phone_number, address, id_number, nationality } = data;
        await db.query(
            "UPDATE guests SET full_name = ?, email = ?, phone_number = ?, address = ?, id_number = ?, nationality = ? WHERE guest_id = ?",
            [full_name, email, phone_number, address, id_number, nationality, id]
        );
    },

    delete: async (id) => {
        await db.query("DELETE FROM guests WHERE guest_id = ?", [id]);
    },
};

module.exports = Guest;
