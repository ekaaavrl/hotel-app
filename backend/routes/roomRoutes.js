const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);

module.exports = router;
