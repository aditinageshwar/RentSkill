let nodemailer = require('nodemailer');

const author = nodemailer.createTransport(
{
  service: 'gmail',
  port: 465,
  secure: true, 
  auth: 
  {
    user: 'aditinageshwar7@gmail.com',                        //sender email
    pass: 'sipl glsl byxh egid'                               //sender created app_password
  }
});
    
const sendLinkMail = async(email, link) => {
  author.sendMail({
    from: '"SkillHub" <aditinageshwar7@gmail.com>',           //from: website name and their valid customer_support_email
    to: email, 
    subject: "Password Reset Request", 
    html: `<p> You requested a password reset. Click the link below to reset your password:</p>
           <a href="${link}"> ${link} </a>
           <p>This link will expire in 1 min.</p>`
  }, function(err,info){
    if(err)
      console.log(err);
    else
      console.log(`Email for Reset Link sent successfully: ${info.messageId}`);
  })
};

const sendOTPEmail = async(email, otp) => {
  author.sendMail({
    from: '"SkillHub" <aditinageshwar7@gmail.com>',      //from: website name and their valid customer_support_email
    to: email, 
    subject: "Verify OTP", 
    html: `<h2>${otp}</h2>
           <p>This OTP is valid only for 1 minutes.</p>`,
  }, function(err,info){
    if(err)
      console.log(err);
    else
      console.log(`Email for OTP sent successfully: ${info.messageId}`);
  })
};

module.exports = {sendLinkMail, sendOTPEmail};