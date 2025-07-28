const Guest = require("../models/guestModel");
const UserLog = require("../models/userLogModel");

const getGuests = async (req, res) => {
    try {
        const guests = await Guest.getAll();
        res.json(guests);
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data tamu", error: err.message });
    }
};

const createGuest = async (req, res) => {
    try {
        const id = await Guest.create(req.body);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        console.log(`[CREATE GUEST] user_id: ${userId}, ip: ${ip}`); // ✅ debug

        await UserLog.addLog(userId, "add_guest", `Menambahkan tamu: ${req.body.full_name}`, ip);

        res.status(201).json({ message: "Tamu berhasil ditambahkan", id });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah tamu", error: err.message });
    }
};

const updateGuest = async (req, res) => {
    try {
        await Guest.update(req.params.id, req.body);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        console.log(`[UPDATE GUEST] user_id: ${userId}, ip: ${ip}`); // ✅ debug

        await UserLog.addLog(userId, "edit_guest", `Mengedit tamu ID: ${req.params.id}`, ip);

        res.json({ message: "Tamu berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update tamu", error: err.message });
    }
};

const deleteGuest = async (req, res) => {
    try {
        await Guest.delete(req.params.id);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);

        console.log(`[DELETE GUEST] user_id: ${userId}, ip: ${ip}`); // ✅ debug

        await UserLog.addLog(userId, "delete_guest", `Menghapus tamu ID: ${req.params.id}`, ip);

        res.json({ message: "Tamu berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus tamu", error: err.message });
    }
};

module.exports = { getGuests, createGuest, updateGuest, deleteGuest };
