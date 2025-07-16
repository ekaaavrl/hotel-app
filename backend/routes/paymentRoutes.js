const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);
router.delete("/:id", auth, controller.remove);

module.exports = router;
