const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
}, {timestamps: true});

module.exports = mongoose.model('Notification', NotificationSchema);