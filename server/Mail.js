let nodemailer = require('nodemailer');

const sendOTPEmail = async(email, otp) => {
const author = nodemailer.createTransport(
{
  service: 'gmail',
  port: 465,
  secure: true, 
  auth: 
  {
    user: 'aditinageshwar7@gmail.com',                        //sender email
    pass: 'ljgk hpkf zasr kxob'                               //sender created app_password
  }
});

author.sendMail({
    from: '"SkillHub" <aditinageshwar7@gmail.com>',      //from: website name and their valid customer_support_email
    to: email, 
    subject: "Verify OTP", 
    text: "Your OTP for Verification: ", 
    html: `<h2>${otp}</h2>
          <p>This OTP is valid only for 1 minutes.</p>`,
  }, function(err,info){
    if(err)
      console.log(err);
    else
      console.log(`Email sent successfully: ${info.messageId}`);
  }
)
};

module.exports = {sendOTPEmail};