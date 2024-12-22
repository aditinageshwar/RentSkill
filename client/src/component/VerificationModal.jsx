import React, { useState, useEffect, useRef } from "react";
import { IoIosMailOpen } from "react-icons/io";
import axiosInstance from "../Axios.js";

const VerificationModal = ({handleVerify }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) 
      return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const emailRef = useRef(); 
  const handleSendCode = async (e) =>{
    e.preventDefault();
    const email = emailRef.current.value;
    try 
    {
      const response = await axiosInstance.post('/api/send', {email}, { withCredentials: true });               //OTP sent to email
      alert(response.data.message);
    } 
    catch (error) 
    {
      if (error.response && error.response.data && error.response.data.message) 
        alert(error.response.data.message); 
      else 
        alert("An unexpected error occurred"); 
    }
  };

  const OnVerify = async(e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      alert("Please enter the complete OTP.");
      return;
    }
    try {
      const response = await axiosInstance.post("/api/verify", { otp: otpCode }, { withCredentials: true });      //Verify OTP
      alert(response.data.message);
      handleVerify();
    }
    catch (error) 
    {
      if (error.response && error.response.data && error.response.data.message) 
        alert(error.response.data.message); 
      else 
        alert("An unexpected error occurred"); 
    }
  };

  const handleResend = async () => {
    try
    {
      const response = await axiosInstance.post('/api/resend', { withCredentials: true });                                                //Again Sent OTP
      alert(response.data.message);
    } 
    catch (error) 
    {
      if (error.response && error.response.data && error.response.data.message) 
        alert(error.response.data.message); 
      else 
        alert("An unexpected error occurred"); 
    }
  };
  
  return (
      <div className="flex items-center justify-center">
       <div className="relative">
        <div className="flex justify-center mb-4 mt-[-30px]">
            <IoIosMailOpen className="text-5xl text-sky-600" />
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2"> Verify it's you </h2>
        <p className="text-red-500 text-sm text-center mb-6">
           Please verify your email to proceed.
        </p>
        <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
        <input
            ref={emailRef}
            type="email"
            placeholder="Email"
            name="email"
            required
            className="w-full mr-2 px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
        />
        <button 
           className="w-96 bg-sky-600 text-white text-sm py-2 px-1 mb-3 rounded-md hover:bg-sky-700 transition "
           onClick={handleSendCode}
        >
           Send Code
        </button>

        {/* update with you email value */}
        <p className="text-center text-gray-600 mb-3">Enter the confirmation code you received in your email: aditinageshwar7@gmail.com</p>  

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((_, index) => (
            <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index]}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
           ))}
        </div>
        <button
            onClick={OnVerify}
            className="w-full py-2 bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700 transition duration-200 mb-2"
        >
            Verify Code
        </button>
  
        <div className="text-center text-gray-600 mb-4">
            Didn't receive an email?{" "}
            <button
              onClick={handleResend}
              className="text-sky-700 font-semibold hover:underline"
            >
              Resend
            </button>
        </div>   
       </div>    
    </div>
);
};

export default VerificationModal;