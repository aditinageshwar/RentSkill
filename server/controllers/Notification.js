const Notification = require('../models/Notification');

const handleFetch =  async (req, res) => {
  try {
    const { email } = req.query;
    const notifications = await Notification.find({ email }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleAdd =  async(req, res) => {
  try {
    const notifications = req.body.notifications;
    const notificationPromises = notifications.map(notification => {
      const { email, message } = notification;
      const newNotification = new Notification({ email, message });
      return newNotification.save();
    });
    await Promise.all(notificationPromises);
    return res.status(200).json(notificationPromises);
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleAllMark = async(req,res) => {
  try {
    const { email } = req.query; 
    const { isRead } = req.body;
    const updatedNotifications = await Notification.updateMany({ email, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json(updatedNotifications);
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleMark = async(req,res) => {
  try{
    const { email, notificationId} = req.query; 
    const { isRead } = req.body;
    const updatedNotification = await Notification.updateOne({  _id: notificationId, email, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json(updatedNotification);
  } 
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {handleAdd, handleFetch, handleAllMark, handleMark};