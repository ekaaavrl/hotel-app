const db = require("../config/db");
const bcrypt = require("bcrypt");

const getAllStaff = async () => {
    const [rows] = await db.query("SELECT * FROM staff");
    return rows;
};

const createStaff = async (data) => {
    const { full_name, position, email, phone_number, hire_date, status, username } = data;

    // Simpan ke tabel staff
    await db.query(
        `INSERT INTO staff (full_name, position, email, phone_number, hire_date, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [full_name, position, email, phone_number, hire_date, status]
    );

    let userMessage = null;

    // Kalau status aktif, otomatis buat akun user
    if (status === "active") {
        const defaultPassword = "staff123";
        const hash = await bcrypt.hash(defaultPassword, 10);

        await db.query(
            `INSERT INTO users (username, password_hash, full_name, email, role, status)
             VALUES (?, ?, ?, ?, 'staff', ?)`,
            [username, hash, full_name, email, status]
        );

        userMessage = `Akun user berhasil dibuat. Username: ${username}, Password: staff123`;
    }

    return userMessage;
};
const updateStaff = async (id, data) => {
    const { full_name, position, email, phone_number, hire_date, status } = data;

    await db.query(
        `UPDATE staff SET full_name=?, position=?, email=?, phone_number=?, hire_date=?, status=? WHERE staff_id = ?`,
        [full_name, position, email, phone_number, hire_date, status, id]
    );

    // Update juga status user yang terkait
    if (status === "inactive") {
        await db.query(`UPDATE users SET status = 'inactive' WHERE email = ?`, [email]);
    } else if (status === "active") {
        await db.query(`UPDATE users SET status = 'active', full_name = ? WHERE email = ?`, [full_name, email]);
    }
};

const deleteStaff = async (id) => {
    // Ambil email staff terlebih dahulu
    const [rows] = await db.query(`SELECT email FROM staff WHERE staff_id = ?`, [id]);
    const email = rows[0]?.email;

    // Hapus data dari staff
    await db.query("DELETE FROM staff WHERE staff_id = ?", [id]);

    // Hapus juga user terkait
    if (email) {
        await db.query("DELETE FROM users WHERE email = ?", [email]);
    }
};

module.exports = {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
};
