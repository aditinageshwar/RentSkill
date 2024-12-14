import React, { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../assets/login.png";
import { gsap } from "gsap";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  
  const togglePasswordVisibility1 = () => {
    setIsPasswordVisible1(!isPasswordVisible1);
  }; 
  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  };

  const handleToggle = () => {
    const tl = gsap.timeline();

    // Animate the "page turn" effect
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
    // Animate the form and image positions
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center mt-1">
      <div className="relative w-full bg-gray-100 max-w-5xl h-[600px] flex items-center justify-center shadow-2xl" ref={containerRef}>
        <div className="w-1/2 hidden md:block" ref={imageRef}>
          <img src={loginImg} alt="login" className="w-full h-auto" />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" ref={formRef}>
          <div className="text-center mb-6">
            <h2 className="text-4xl mb-2 font-bold text-gray-700">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin
               ? "Welcome back! Please login to your account."
               : "Create your account!"}
            </p>
        </div>

        {/* Login Form */}
        {isLogin && (
          <form className="space-y-1 h-[300px]">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 mt-4"
              />
            </div>

            <div className="relative">
              <input
                type={isPasswordVisible1 ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
             <button
               type="button"
               onClick={togglePasswordVisibility1}
               className="absolute top-7 right-2 transform -translate-y-1/2 text-gray-500"
             >
              {isPasswordVisible1 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
             </button>
            </div>
            
            <p className="text-sm text-blue-500">Forgot Password?</p>
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
          <form className="space-y-2">
            <div className="relative">
              <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              />
            </div>
            <div className="relative">
              <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              />
            </div>
            <div className="relative">
              <span className="absolute right-0 text-red-500 text-xl mr-2">*</span>    
              <input
                type="tel"
                placeholder="Phone number"
                pattern="[0-9]{10}"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              />
            </div>
            <div className="relative">
              <input
                type={isPasswordVisible1 ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
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
                className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              />
              <button
               type="button"
               onClick={togglePasswordVisibility2}
               className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500"
              >
               {isPasswordVisible2 ? (<FaEyeSlash className="w-4 h-4 mb-3"/>) : (<FaEye className="w-4 h-6 mb-3" />)}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              Sign Up
            </button>
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
