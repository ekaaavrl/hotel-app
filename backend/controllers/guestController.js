const Guest = require("../models/guestModel");

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
        res.status(201).json({ message: "Tamu berhasil ditambahkan", id });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah tamu", error: err.message });
    }
};

const updateGuest = async (req, res) => {
    try {
        await Guest.update(req.params.id, req.body);
        res.json({ message: "Tamu berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update tamu", error: err.message });
    }
};

const deleteGuest = async (req, res) => {
    try {
        await Guest.delete(req.params.id);
        res.json({ message: "Tamu berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus tamu", error: err.message });
    }
};

module.exports = { getGuests, createGuest, updateGuest, deleteGuest };
