const Service = require("../models/serviceModel");
const UserLogs = require("../models/userLogModel");

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

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "add_service", `Menambahkan layanan untuk reservasi ID: ${req.body.reservation_id}`, ip);

        res.json({ message: "Layanan berhasil ditambahkan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal tambah layanan", error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        await Service.updateService(req.params.id, req.body);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "edit_service", `Mengubah layanan ID: ${req.params.id}`, ip);

        res.json({ message: "Layanan berhasil diupdate" });
    } catch (err) {
        res.status(500).json({ message: "Gagal update layanan", error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await Service.deleteService(req.params.id);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "delete_service", `Menghapus layanan ID: ${req.params.id}`, ip);

        res.json({ message: "Layanan berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus layanan", error: err.message });
    }
};

exports.getNotesByReservationId = async (req, res) => {
    const { reservation_id } = req.query;
    if (!reservation_id) {
        return res.status(400).json({ message: "reservation_id diperlukan" });
    }

    try {
        const notes = await Service.getServiceDescriptions(reservation_id);
        res.json({ notes });
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil catatan layanan", error: err.message });
    }
};
