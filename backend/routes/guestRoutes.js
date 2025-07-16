const express = require("express");
const router = express.Router();
const {
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
} = require("../controllers/guestController");
const { auth } = require("../middleware/authMiddleware");

router.get("/", auth, getGuests);
router.post("/", auth, createGuest);
router.put("/:id", auth, updateGuest);
router.delete("/:id", auth, deleteGuest);

module.exports = router;
