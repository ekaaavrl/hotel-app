const Payment = require("../models/paymentModel");
const UserLogs = require("../models/userLogModel");

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

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "create_payment", `Membuat pembayaran untuk reservasi ID: ${reservation_id}`, ip);

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

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "update_payment", `Mengubah pembayaran ID: ${id}`, ip);

        res.json({ message: "Pembayaran berhasil diupdate" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengupdate pembayaran" });
    }
};

exports.remove = async (req, res) => {
    try {
        const paymentId = req.params.id;

        await Payment.deletePayment(paymentId);

        const userId = req.user?.user_id;
        const isDev = process.env.NODE_ENV !== "production";
        const ip = isDev ? "192.168.88.45" : (req.headers['x-forwarded-for'] || req.connection.remoteAddress);
        await UserLogs.addLog(userId, "delete_payment", `Menghapus pembayaran ID: ${paymentId}`, ip);

        res.status(200).json({ message: "Pembayaran berhasil dihapus." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menghapus pembayaran." });
    }
};

exports.getAllWithServices = async (req, res) => {
    try {
        const data = await Payment.getAllPaymentsWithServiceFee();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal mengambil data pembayaran" });
    }
};
