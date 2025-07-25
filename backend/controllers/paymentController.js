const Payment = require("../models/paymentModel");

exports.getAll = async (req, res) => {
    try {
        const data = await Payment.getAllPayments();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data pembayaran" });
    }
};

exports.create = async (req, res) => {
    try {
        const { reservation_id, amount_paid, payment_method, notes, additional_fee } = req.body;

        if (!reservation_id || !amount_paid || !payment_method) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        await Payment.createPayment({ reservation_id, amount_paid, payment_method, notes, additional_fee });
        res.status(201).json({ message: "Pembayaran berhasil disimpan" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menyimpan pembayaran" });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { reservation_id, amount_paid, payment_method, notes, additional_fee } = req.body;

        if (!reservation_id || !amount_paid || !payment_method) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        await Payment.updatePayment(id, { reservation_id, amount_paid, payment_method, notes, additional_fee });
        res.json({ message: "Pembayaran berhasil diupdate" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengupdate pembayaran" });
    }
};

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        await Payment.deletePayment(id);
        res.json({ message: "Pembayaran berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus pembayaran" });
    }
};

exports.getAllWithServices = async (req, res) => {
    try {
        const data = await Payment.getAllPaymentsWithServiceFee(); // model yang ditambah
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data pembayaran" });
    }
};

