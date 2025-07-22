const express = require("express");
const router = express.Router();
const { getLogs } = require("../controllers/userLogController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, getLogs);

module.exports = router;
