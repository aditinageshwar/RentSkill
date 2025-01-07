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
