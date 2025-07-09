const express = require("express");
const router = express.Router();
const { createReservation } = require("../controllers/reservationController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createReservation);

module.exports = router;
