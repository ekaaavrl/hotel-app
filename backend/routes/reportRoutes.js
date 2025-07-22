const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { auth } = require("../middleware/authMiddleware");

router.get("/income", auth, reportController.getIncomeReport);
router.get("/history", auth, reportController.getHistoryPayments);
router.get("/reservations", auth, reportController.getDailyReservations);
router.get("/rooms", auth, reportController.getRoomReport);

module.exports = router;
