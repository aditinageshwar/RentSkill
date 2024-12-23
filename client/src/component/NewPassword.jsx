import React, { useState , useRef } from 'react';
import { BiSolidLock } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../Axios.js";

const ResetPassword = () => 
{
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  const togglePasswordVisibility1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  }; 
  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  }; 

  const dataRef = useRef(null);
  const handleResetPassword = async (e) => 
  {
    e.preventDefault();
    const formData = new FormData(dataRef.current);

    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
      alert("Password and Confirm Password fields do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post('/api/resetPassword', { password });
      alert(response.data.message);
      e.target.reset(); 
      window.location.href = '/login'; 
    } 
    catch (error) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-[500px] mx-auto mt-10 mb-12 px-8 py-8 border-2 border-gray-200 shadow-gray-400 shadow-lg">
      <BiSolidLock className="text-4xl mx-auto text-sky-700 "/>  
      <h2 className="text-2xl text-center text-sky-700 font-bold mb-2">Reset Password</h2>
      <p className="text-gray-500 text-center mb-6">Create a new password to update your account credentials and enhance your account security.</p>
      <form ref={dataRef} onSubmit={handleResetPassword}>
        <div className="relative">
          <input
            type={isPasswordVisible1 ? "text" : "password"}
            placeholder="Enter new password"
            name="password"
            className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-1"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility1}
            className="absolute top-7 right-3 transform -translate-y-1/2 text-gray-500"
          >
            {isPasswordVisible1 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
          </button>
        </div>

        <div className="relative">
          <input
            type={isPasswordVisible2 ? "text" : "password"}
            placeholder="Confirm password"
            name="confirmPassword"
            className="w-full px-4 py-2 border rounded-md mb-8 focus:outline-none focus:ring-1"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility2}
            className="absolute top-7 right-3 transform -translate-y-1/2 text-gray-500"
          >
            {isPasswordVisible2 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
          </button>
        </div>

        <div className="flex justify-center">
            <button
             type="submit"
             className="w-1/3 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition"
            >
             Reset Password
            </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
