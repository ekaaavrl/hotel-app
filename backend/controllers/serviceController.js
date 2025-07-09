const Service = require("../models/serviceModel");

exports.getAll = async (req, res) => {
    try {
        const data = await Service.getAllServices();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data layanan", error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        await Service.createService(req.body);
        res.json({ message: "Layanan berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah layanan", error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        await Service.updateService(req.params.id, req.body);
        res.json({ message: "Layanan berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update layanan", error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await Service.deleteService(req.params.id);
        res.json({ message: "Layanan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus layanan", error: err.message });
    }
};
