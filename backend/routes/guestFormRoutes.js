const express = require("express");
const router = express.Router();
const { createGuest } = require("../controllers/guestFormController");
const { auth } = require("../middleware/authMiddleware");

router.post("/guest-form", auth, createGuest);

module.exports = router;
