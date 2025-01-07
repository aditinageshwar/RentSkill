const express = require('express');
const router = express.Router();

const {handleAdd, handleFetch, handleAllMark, handleMark} = require('../controllers/Notification');

router.post('/notification', handleAdd);
router.get('/notification', handleFetch);
router.patch('/notification/markAllAsRead', handleAllMark);
router.patch('/notification/markOne', handleMark);

module.exports = router;