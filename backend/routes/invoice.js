const express = require("express");
const router = express.Router();
const { getInvoiceByReservationId } = require("../controllers/invoiceController");
const { auth } = require("../middleware/authMiddleware");

router.get("/:reservation_id", auth, getInvoiceByReservationId);

module.exports = router;
