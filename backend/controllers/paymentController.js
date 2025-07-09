const Payment = require("../models/paymentModel");

exports.getAll = async (req, res) => {
    try {
        const data = await Payment.getAllPayments();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil data pembayaran" });
    }
};

exports.create = async (req, res) => {
    try {
        await Payment.createPayment(req.body);
        res.json({ message: "Pembayaran berhasil disimpan" });
    } catch (err) {
        res.status(500).json({ message: "Gagal simpan pembayaran" });
    }
};

exports.remove = async (req, res) => {
    try {
        await Payment.deletePayment(req.params.id);
        res.json({ message: "Pembayaran berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: "Gagal hapus pembayaran" });
    }
};
