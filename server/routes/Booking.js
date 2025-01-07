const express = require('express');
const router = express.Router();

const { saveBookingHistory, handleBooking } = require('../controllers/Booking');

router.post('/saveBooking', saveBookingHistory);
router.get('/bookingHistory', handleBooking);

module.exports = router;