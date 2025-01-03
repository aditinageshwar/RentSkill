const express = require('express');
const router = express.Router();

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb)                                  
    {
      return cb(null, './uploads');                           
    },
    filename: function (req, file, cb) 
    {
      return cb(null, `${Date.now()} - ${file. originalname}`);                             //add time Date.now() for name uniqueness
    }
});
const upload = multer({ storage: storage, limits: {fileSize: 10 * 1024 * 1024}});          //upto 10MB

const {handleSendOTP, handleVerifyOTP, handleResendOTP, handleSignUp, handleLogin, handleForgot, handleReset, handleProfile, handleUpdateProfile } = require('../controllers/User');

router.post('/send', handleSendOTP);
router.post('/verify', handleVerifyOTP);
router.post('/resend', handleResendOTP);
router.post('/signup', upload.single('profileImg'), handleSignUp);
router.post('/login', handleLogin);
router.post('/forgotPassword', handleForgot);
router.post('/resetPassword', handleReset);
router.get('/userProfile', handleProfile);
router.put("/updateProfile", upload.single('profileImg'), handleUpdateProfile);

module.exports = router;