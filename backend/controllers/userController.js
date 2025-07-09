const bcrypt = require("bcrypt");
const User = require("../models/userModel");

exports.getAll = async (req, res) => {
    try {
        const data = await User.getAllUsers();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data user" });
    }
};

exports.create = async (req, res) => {
    try {
        const { username, password, full_name, email, role, status } = req.body;
        const hash = await bcrypt.hash(password, 10);
        await User.createUser({ username, password_hash: hash, full_name, email, role, status });
        res.json({ message: "User berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah user", error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        await User.updateUser(req.params.id, req.body);
        res.json({ message: "User berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update user" });
    }
};

exports.remove = async (req, res) => {
    try {
        await User.deleteUser(req.params.id);
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus user" });
    }
};
