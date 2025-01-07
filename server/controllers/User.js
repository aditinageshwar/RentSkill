const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const path = require("path");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, phone, password} = req.body;


    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

     // Handle profile image upload
     const profileImage = req.file ? req.file.path : null; // Path from multer


    const user = new User({ name,phone, password, profileImage});
    await user.save();

    res.status(201).json({ message: "User signup successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error signup user", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
