const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
    getHistoryPayments,
    getDailyReservations,
    getIncomeReport,
    getRoomReport
} = require("../controllers/reportController");

// 📜 History Pembayaran
router.get("/history", auth, getHistoryPayments);

// 📅 Laporan Reservasi Harian
router.get("/reservations", auth, getDailyReservations);

// 💰 Laporan Pendapatan
router.get("/income", auth, getIncomeReport);

// 🛏️ Laporan Kamar (dengan filter ?status=)
router.get("/rooms", auth, getRoomReport);

module.exports = router;
