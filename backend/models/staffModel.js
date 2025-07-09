const db = require("../config/db");

const getAllStaff = async () => {
    const [rows] = await db.query("SELECT * FROM staff");
    return rows;
};

const createStaff = async (data) => {
    const { full_name, position, email, phone_number, hire_date, status } = data;
    await db.query(
        `INSERT INTO staff (full_name, position, email, phone_number, hire_date, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [full_name, position, email, phone_number, hire_date, status]
    );
};

const updateStaff = async (id, data) => {
    const { full_name, position, email, phone_number, hire_date, status } = data;
    await db.query(
        `UPDATE staff SET full_name=?, position=?, email=?, phone_number=?, hire_date=?, status=? WHERE staff_id = ?`,
        [full_name, position, email, phone_number, hire_date, status, id]
    );
};

const deleteStaff = async (id) => {
    await db.query("DELETE FROM staff WHERE staff_id = ?", [id]);
};

module.exports = {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
};
