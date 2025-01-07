<<<<<<< HEAD
const express = require("express");
const { signup, login ,updateProfile } = require("../controllers/user");
const upload = require("../middlewares/upload"); // Multer middleware
const router = express.Router();

// Register (Sign Up)
router.post("/signup", signup);

// Login
router.post("/login", login);

router.post("/signup", upload.single("profileImage"), signup);



module.exports = router;
=======
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
>>>>>>> 480e32edc6507e83264659b85cee384418d337bd
