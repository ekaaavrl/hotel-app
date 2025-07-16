const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);
router.get("/me", auth, controller.getMe);

module.exports = router;
