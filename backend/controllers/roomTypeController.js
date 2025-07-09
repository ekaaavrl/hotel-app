const Model = require("../models/roomTypeModel");

exports.getAll = async (req, res) => {
    try {
        const [rows] = await Model.getAll();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        await Model.create(req.body);
        res.status(201).json({ message: "Room type berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        await Model.update(req.params.id, req.body);
        res.json({ message: "Room type berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await Model.remove(req.params.id);
        res.json({ message: "Room type berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
