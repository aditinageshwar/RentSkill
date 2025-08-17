import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../assets/login.png";
import { gsap } from "gsap";
import VerificationModal from "./VerificationModal.jsx"; 
import axiosInstance from "../Axios.js";

function Login() {
  const navigateTo = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  
  const togglePasswordVisibility1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  }; 
  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  }; 

  const handleVerify = () => {
    setIsEmailVerified(true);
  };

  const handleForgot = () =>{
    navigateTo('/ForgotPassword');
  }

  const handleToggle = () => {
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      rotateY: 90,
      duration: 1,
      ease: "power2.in",
      onComplete: () => setIsLogin(!isLogin),
    })
    .to(containerRef.current, {
      rotateY: 0,
      duration: 1,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { x: isLogin ? 0 : 300, opacity: 0 },
      { x: isLogin ? 0 : -500, opacity: 1, duration: 0, ease: "power2.out" }
    );
    gsap.fromTo(
      imageRef.current,
      { x: isLogin ? 0 : -300, opacity: 0 },
      { x: isLogin ? 0 : 450, opacity: 1, duration: 0, ease: "power2.out" }
    );
  }, [isLogin]);

  const loginDataRef = useRef(null);
  const handleLogin = async (e) =>{
    e.preventDefault();
    const formData = new FormData(loginDataRef.current);
    try 
    {
      const response = await axiosInstance.post('/api/login', formData, {
          withCredentials: true
        }
      );
      alert(response.data.message);
      e.target.reset(); 
      window.location.href = '/'; 
    } 
    catch (error) 
    {
      if (error.response && error.response.data && error.response.data.message) 
        alert(error.response.data.message); 
      else 
        alert("An unexpected error occurred"); 
    }
  };

  const signupDataRef = useRef(null);
  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(signupDataRef.current);
  
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (password !== confirmPassword) {
      alert("Password and Confirm Password fields do not match!");
      return;
    }

    try 
    {
      const response = await axiosInstance.post('/api/signup', formData , { headers: {'Content-Type': 'multipart/form-data' } });
      alert(response.data.message);
      e.target.reset(); 
      window.location.href = '/'; 
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative w-full bg-gray-100 max-w-5xl h-[600px] flex items-center justify-center shadow-2xl" ref={containerRef}>
        <div className="w-1/2 hidden md:block" ref={imageRef}>
          <img src={loginImg} alt="login" className="w-full h-auto" />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" ref={formRef}>
          <div className="text-center mb-6">
            <h2 className="text-4xl mb-2 font-bold text-gray-700">
            {isLogin ? "Login" : (isEmailVerified && "Sign Up")}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin
               ? "Welcome back! Please login to your account." :
               (isEmailVerified && "Create your account!")}
            </p>
        </div>

        {/* Login Form */}
        {isLogin && (
          <form className="space-y-1 h-[300px]" onSubmit={handleLogin} ref={loginDataRef}>
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4 mt-4"
              />
            </div>

            <div className="relative">
              <input
                type={isPasswordVisible1 ? "text" : "password"}
                placeholder="Password"
                required
                name="password"
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1"
              />
             <button
               type="button"
               onClick={togglePasswordVisibility1}
               className="absolute top-7 right-2 transform -translate-y-1/2 text-gray-500"
             >
              {isPasswordVisible1 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
             </button>
            </div>
            
            <button className="text-sm text-blue-500" onClick={handleForgot}>Forgot Password?</button>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-700 transition !mt-8"
            >
              Login
            </button>
            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleToggle}
              >
                Sign Up
              </span>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {!isLogin && (
          <form className="space-y-2" onSubmit={handleSignup} ref={signupDataRef} encType="multipart/form-data">
            {!isEmailVerified ? (
              <VerificationModal handleVerify={handleVerify} />
            ) : (
            <div>
             <div className="relative">
                <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
                <input
                  type="text"
                  placeholder="Name"
                  required
                  name="name"
                  className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
                />
              </div>

              <div className="relative">
                <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
                <input
                  type="tel"
                  placeholder="Phone number"
                  pattern="[0-9]{10}"
                  required
                  name="phone"
                  className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
                />
              </div>

              <div className="relative">
                <input
                 type={isPasswordVisible1 ? "text" : "password"}
                 placeholder="Password"
                 required
                 name="password"
                 className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
                />
                <button
                 type="button"
                 onClick={togglePasswordVisibility1}
                 className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                >
                 {isPasswordVisible1 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
                </button>
              </div>

              <div className="relative">
                <input
                  type={isPasswordVisible2 ? "text" : "password"}
                  placeholder="Confirm Password"
                  required
                  name="confirmPassword"
                  className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
                />
                <button
                 type="button"
                 onClick={togglePasswordVisibility2}
                 className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
                >
                 {isPasswordVisible2 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="photoInput"
                  className="text-gray-500 mb-2"
                >
                  <span>Upload Image</span>
                </label> 
               <input
                 id="photoInput"
                 type="file"
                 required
                 name="profileImg"
                 className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-1 focus: mb-4"
               />
              </div>  

              <button
                type="submit"
                disabled={!isEmailVerified}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
              >
                Sign Up
              </button>
            </div>
            )}

            <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={handleToggle}
              >
                Login
              </span>
            </p>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}

export default Login;
