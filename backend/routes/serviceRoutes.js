const express = require("express");
const router = express.Router();
const controller = require("../controllers/serviceController");
const { auth } = require("../middleware/authMiddleware");

// routes/service.js
router.get("/", auth, controller.getAll);                   // Ambil semua data layanan
router.get("/notes", auth, controller.getNotesByReservationId);  // ✅ Tambahan baru
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);


module.exports = router;