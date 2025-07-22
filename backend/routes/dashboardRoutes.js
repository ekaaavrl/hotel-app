const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware"); // ✅ auth middleware
const dashboardController = require("../controllers/dashboardController"); // ✅ ini harus ada!

router.get("/", auth, dashboardController.getDashboardStats);
router.get("/summary", auth, dashboardController.getDashboardSummary);
router.get("/income-today", auth, dashboardController.getIncomeToday);
router.get("/rooms-available", auth, dashboardController.getAvailableRoomsToday);

module.exports = router;
