const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, controller.getAll);
router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.remove);
router.get("/with-services", auth, controller.getAllWithServices);


module.exports = router;