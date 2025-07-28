const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { auth } = require('../middleware/authMiddleware');

// ✅ GET tidak perlu auth, boleh public
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationById);

// ✅ Tambahkan auth di sini
router.post('/', auth, reservationController.createReservation);
router.put('/:id', auth, reservationController.updateReservation);
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;
