const express = require("express");
const router = express.Router();
const {
    createReservation,
    getReservations, // tambahkan ini
} = require("../controllers/reservationController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, getReservations); // tambahkan ini
router.post("/", auth, createReservation);

module.exports = router;
