import React, {useEffect, useState, useRef } from "react";
import { IoIosUnlock } from "react-icons/io";
import ForgotPasswordImage from "../assets/ForgotPasswordImage.png";
import axiosInstance from "../Axios.js";
import { gsap } from "gsap";

function ForgotPassword()
{
    const [email, setEmail] = useState('');

    const animatedRef = useRef(null); 
    useEffect(() => {
      gsap.set([animatedRef.current], {
        opacity: 0,
        scale: 0.5,
      });
      gsap.to(animatedRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power3.out',
      });
    }, []); 

    const handleForgotPassword = async (e) => 
    {
        e.preventDefault();
        try {
          const response = await axiosInstance.post('/api/forgotPassword', { email });
          alert(response.data.message);
          e.target.reset(); 
        } catch (error) {
          alert(error.response.data.message);
        }
    };

    return (
    <div  ref={animatedRef} className="max-w-[1000px] mx-auto mt-10 mb-12 flex justify-center border-2 border-gray-200 shadow-gray-400 shadow-lg">
      <div>
        <img src={ForgotPasswordImage} alt="ForgotPasswordImage" className="max-h-80" />
      </div>
      <div className="mt-6">
        <IoIosUnlock className="text-4xl mx-auto text-sky-700 "/>
        <h2 className="text-2xl text-center text-sky-700 font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-500 text-center mb-4">To reset your password, Please enter your registered email address</p>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
          <div className="flex justify-center">
            <button
             type="submit"
             className="w-1/3 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
            >
             Send Link
            </button>
          </div>
        </form>
       </div>
    </div>
  );
}

export default ForgotPassword;