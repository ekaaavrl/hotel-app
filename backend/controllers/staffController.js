const Staff = require("../models/staffModel");

exports.getAll = async (req, res) => {
    try {
        const data = await Staff.getAllStaff();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data staff" });
    }
};

exports.create = async (req, res) => {
    try {
        await Staff.createStaff(req.body);
        res.json({ message: "Staff berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah staff" });
    }
};

exports.update = async (req, res) => {
    try {
        await Staff.updateStaff(req.params.id, req.body);
        res.json({ message: "Staff berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update staff" });
    }
};

exports.remove = async (req, res) => {
    try {
        await Staff.deleteStaff(req.params.id);
        res.json({ message: "Staff berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus staff" });
    }
};
