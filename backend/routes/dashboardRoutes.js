const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getSummaryChart,
    getReservationChart,
    getServiceChart,
} = require("../controllers/dashboardController");

// Route Dashboard
router.get("/", auth, getDashboardStats);
router.get("/summary-chart", auth, getSummaryChart);
router.get("/reservation-chart", auth, getReservationChart);
router.get("/service-chart", auth, getServiceChart);

module.exports = router;