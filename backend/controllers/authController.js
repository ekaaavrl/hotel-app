const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require("jsonwebtoken");
const UserLog = require("../models/userLogModel");

const login = async (req, res) => {
    const { username, password } = req.body;
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    const isDev = process.env.NODE_ENV !== "production";
    const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    await UserLog.addLog(user.user_id, "login", "Login berhasil", ip);

    res.json({
        token,
        user: {
            user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        },
    });
};

// ✅ Tambahkan fungsi logout
const logout = async (req, res) => {
    const userId = req.user?.user_id;

    // Samakan cara ambil IP seperti di login
    const isDev = process.env.NODE_ENV !== "production";
    const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    if (userId) {
        await UserLog.addLog(userId, "logout", "Logout dari sistem", ip);
    }

    res.json({ message: "Logout berhasil" });
};

module.exports = { login, logout };
