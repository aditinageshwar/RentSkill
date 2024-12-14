import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import logo from "../assets/logo.png";  // Your logo path
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const navigateTo = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // const handleIconClick = () => {
  //   setShowMenu(!showMenu); // Toggle the menu visibility
  // };
  
  const handleClick = () => {
    navigateTo('/login');
  };

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate the logo (fade in from the bottom) with a quicker start
    tl.fromTo(
      ".logo", 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, // Faster animation duration
        ease: "power3.out",
        delay: 0.1 // Logo animation starts immediately with a small delay
      }
    );

    // Animate the text links (from left to right) with fast animation
    tl.fromTo(
      ".nav-links a", 
      { opacity: 0, x: -100 }, // Starting position (opacity: 0, moving left)
      {
        opacity: 1, 
        x: 0, 
        duration: 0.8, // Faster animation duration
        stagger: 0.1, // Reduced stagger for faster animation
        ease: "power3.out",
        delay: 0.2 // Links start animating slightly after the logo
      }
    );

    // Animate the account icon (fade and scale in) - Quick animation
    tl.fromTo(
      ".account-icon", 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, // Faster animation duration
        ease: "power2.out", 
        delay: 0.8 // Account icon shows last, after logo and links
      }
    );
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left Section: Logo and Links */}
        <div className="flex items-center space-x-12">
          <a href="#" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 w-auto logo" // GSAP class for logo animation
            />
          </a>
          <div className="hidden md:flex space-x-6 nav-links">
            <a href="#" className="hover:text-orange-500">Home</a>
            <a href="#" className="hover:text-orange-500">Browse Skills</a>
            <a href="#" className="hover:text-orange-500">Post Skills</a>
            <a href="#" className="hover:text-orange-500">My Account</a>
            <a href="#" className="hover:text-orange-500">Notifications</a>
            <a href="#" className="hover:text-orange-500">My Booking</a>
          </div>
        </div>

        {/* Right Section: Account Icon */}
        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-md hover:text-orange-500 mr-5"  
          onClick={() => handleClick()}>Login</button>

          {/* Account Icon */}
          <div className="relative">
            <FaUserCircle
              className="absolute text-3xl cursor-pointer hover:text-orange-500 left-25 account-icon"
              style={{ top: '-12px' }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


