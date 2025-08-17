const User = require('../models/User');
const {sendLinkMail, sendOTPEmail} = require('../Mail');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

handleSendOTP = async(req,res) => {
  const {email} = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();                            // Generate a 6-digit numeric OTP
  const otpExpiry =  Date.now() +  60*1000;                                                      //OTP is valid only for 1 min
  
  await sendOTPEmail(email, otp);                                                               // Send the OTP to the user's email
  req.session.tempUser = {email, otp, otpExpiry}; 
  await req.session.save();
  res.status(200).send({ message: 'OTP sent successfully!' });
}

handleVerifyOTP = async (req, res) => {
  const { otp } = req.body;
  const tempUser = req.session.tempUser;

  if(tempUser.otp != otp) 
    return res.status(400).json({ message: "Incorrect OTP" });
  if(Date.now() > tempUser.otpExpiry) 
    return res.status(400).json({ message : "OTP Expired" });
  
  req.session.userEmail = tempUser.email;
  req.session.tempUser = null;                                                                       //Clear the session
  return res.status(200).json({ message: "OTP verified successfully" });
}
  
handleResendOTP = async(req,res) => {
  const tempUser = req.session.tempUser;
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();      //generate new OTP and their expiry time
  const newOtpExpiry = Date.now() + 60 * 1000;
  
  await sendOTPEmail(tempUser.email, newOtp);
  req.session.tempUser.otp = newOtp;                                          //update the session
  req.session.tempUser.otpExpiry = newOtpExpiry;   
  
  return res.status(200).json({ message: "OTP resent successfully" });
}

handleSignUp = async(req,res) => {
  const { name, phone, password } =  req.body;
  const userEmail = req.session.userEmail;
  const userImage = req.file ? req.file.path : null;

  const existingUser = await User.findOne({ email: userEmail });
  if (existingUser) 
    return res.status(400).json({ message: "This account already exists.Please try log in to continue." });
  
  try 
  {
    const user = new User({
      name,
      email : userEmail,
      phone,
      password,
      profileImg: userImage,
    });
    await user.save();
    req.session.userEmail = null;

    const token = jwt.sign({ id: user._id }, 'rentskill', { expiresIn: "1d" });
    res.cookie('uid', token);

    return res.status(200).json({ message: 'User created successfully!' });
  } 
  catch (error) 
  {
    return res.status(400).json({ message: "Error signing up user. Please try again." });
  }
}

handleLogin = async(req,res) => {
  try 
  {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User not found. Please sign up first!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, 'rentskill', { expiresIn: "1d" });
    console.log("Sending cookie with token:", token);

    res.cookie('uid', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    res.status(200).json({ message: "Login successful" });
  } 
  catch (error) 
  {
    res.status(500).json({ message: "Error logging in", error });
  }  
}

handleForgot = async(req,res) =>{
  const {email} = req.body;
  const user = await User.findOne({ email : email });
  if (!user) {
    return res.status(400).json({ message: "User not found. Please sign up first!" });
  }
    
  const link = `http://localhost:5173/NewPassword/${user._id}`;
  sendLinkMail(email,link);
  req.session.userLink = link; 
  res.status(200).send({ message: 'Password Reset Link sent to your email successfully!' }); 
}

handleReset = async(req,res) =>{
  const { password } = req.body;
  const link = req.session.userLink;
  
  const userId = link.split('/').pop();
  const user = await User.findById(userId);

  try{
    user.password = password;
    await user.save();
    req.session.userLink = null;
    res.status(200).json({ message: 'Password has been reset successfully' });
  }
  catch(error){
    res.status(500).json({ message: 'Error resetting password'});
  }
}

const handleProfile = async(req, res) => {
  const token = req.cookies.uid; 
  if (!token)                                                                          //user not logged-in
    return res.status(401).json({ message: "Unauthorized User" });

  try {
    const userId = jwt.verify(token, 'rentskill');
    const user = await User.findById(userId.id).select("-password");                    // Exclude password

    if (!user) {
      return res.status(404).json({ message: "Oops, User not found!" });
    }
    res.status(200).json({ user });
  } 
  catch (error) {
    res.status(401).json({ message: "Invalid token. Please log in again." });
  }
};

handleUpdateProfile = async(req,res)=>{
  const token = req.cookies.uid; 
  const userId = jwt.verify(token, 'rentskill');
  const user = await User.findById(userId.id).select("-password");  
  if (!user) {
    return res.status(404).json({ success: false });
  }
  try 
  {
    const { name, email, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (req.file) user.profileImg = req.file.path;
    await user.save();
    res.status(200).json({ success: true, user});
  } 
  catch (error) {
    res.status(500).json({ success: false });
  }
};

module.exports = { handleSendOTP, handleVerifyOTP, handleResendOTP, handleSignUp, handleLogin, handleForgot, handleReset, handleProfile, handleUpdateProfile};