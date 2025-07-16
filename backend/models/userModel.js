const db = require("../config/db");

const getAllUsers = async () => {
    const [rows] = await db.query("SELECT user_id, username, full_name, email, role, status, created_at FROM users");
    return rows;
};

const createUser = async (data) => {
    const { username, password_hash, full_name, email, role, status } = data;
    await db.query(
        `INSERT INTO users (username, password_hash, full_name, email, role, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [username, password_hash, full_name, email, role, status]
    );
};

const updateUser = async (id, data) => {
    const { full_name, email, role, status } = data;
    await db.query(
        `UPDATE users SET full_name=?, email=?, role=?, status=? WHERE user_id = ?`,
        [full_name, email, role, status, id]
    );
};

const deleteUser = async (id) => {
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);
};

const getUserById = async (id) => {
    const [rows] = await db.query("SELECT user_id, username, full_name, email, role, status FROM users WHERE user_id = ?", [id]);
    return rows[0];
};


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
};
