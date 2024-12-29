const express = require('express');
const router = express.Router();

const { saveBookingHistory } = require('../controllers/Booking');

router.post('/saveBooking', saveBookingHistory);

module.exports = router;