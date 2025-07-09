const UserLog = require("../models/userLogModel");

exports.getLogs = async (req, res) => {
    try {
        const data = await UserLog.getAllLogs();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Gagal ambil log aktivitas" });
    }
};
