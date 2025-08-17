import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import logo from "../assets/logo.png"; 
import { FaUserCircle } from "react-icons/fa";
import UserProfile from './UserProfile'; 
import Cookies from 'js-cookie';

function Navbar() {
  const navigateTo = useNavigate();
  const [showProfile, setShowProfile] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // const token = Cookies.get('uid');
    // if (token) 
    //   setIsLoggedIn(true); 

    const checkLogin = async () => {
    try {
      const response = await axiosInstance.get('/api/userProfile', {
        withCredentials: true
      });
      if (response.data.user) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      setIsLoggedIn(false); 
    }
  };

  checkLogin();
  }, []);

  const handleClick = async () => { 
    if (isLoggedIn)
    {  
      const confirmLogout = window.confirm("You are about to log out. Are you sure?");
      if (confirmLogout) 
      {
        // Cookies.remove('uid');
        await axiosInstance.post('/api/logout', {}, { withCredentials: true });
        setIsLoggedIn(false);
      }
    } 
    else 
    {
      navigateTo('/login');
    }
  };

  const handleMyBooking=()=>{
    if(isLoggedIn)
    navigateTo('/bookingTable')
    else
    alert("First, kindly log in to access this feature."); 
  }

  const handleAbout = () => {
    navigateTo('/aboutUs');
  }
  
  const handleNotification = () =>{
    if(isLoggedIn)
    navigateTo('/notification')
    else
    alert("First, kindly log in to access this feature.");
  }

  const handleContactUs = () => {
    navigateTo('/ContactUs');
  };

  const handleBrowseSkill = () => {
    if(isLoggedIn)
    navigateTo('/browseSkill');
    else
    alert("First, kindly log in to access this feature."); 
  };
  
  const handlePostSkill = () => {
    if(isLoggedIn)
    navigateTo('/postSkill');
    else
    alert("First, kindly log in to access this feature."); 
  };
  
  const handleOpenProfile = () => {
    setShowProfile(true); 
  };

  const handleCloseProfile = () => {
    setShowProfile(false); 
  };

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".logo", 
      { opacity: 0, y: 30 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: "power3.out",
        delay: 0.1 
      }
    );

    tl.fromTo(
      ".nav-links a", 
      { opacity: 0, x: -100 },
      {
        opacity: 1, 
        x: 0, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        delay: 0.2
      }
    );

    tl.fromTo(
      ".login-heading", 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: "power2.out", 
      }
    );

    tl.fromTo(
      ".account-icon", 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: "power2.out", 
      }
    );
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-12">
          <Link to="#" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto logo" />
          </Link>
          <div className="hidden md:flex space-x-6 nav-links">
            <Link to="/" className="hover:text-orange-500">Home</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handleBrowseSkill}>Browse Skills</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handlePostSkill}>Post Skills</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handleMyBooking}>My Booking</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handleNotification}>Notifications</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handleAbout}>About Us</Link>
            <Link to="#" className="hover:text-orange-500" onClick={handleContactUs}>Contact Us</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-md hover:text-orange-500 mr-10 login-heading" onClick={handleClick}> 
            {isLoggedIn ? 'Logout' : 'Login'} 
          </button>
          <div className="relative">
            <FaUserCircle
              className="mt-[-15px] absolute text-3xl cursor-pointer hover:text-orange-500 right-1 account-icon"
              onClick={handleOpenProfile}
            />
          </div>
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm z-50">
          <UserProfile onClose={handleCloseProfile} /> 
        </div>
      )}
    </nav>
  );
}

export default Navbar;