import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import logo from "../assets/logo.png"; 
import { FaUserCircle } from "react-icons/fa";
import UserProfile from './UserProfile'; 

function Navbar() {
  const navigateTo = useNavigate();
  const [showProfile, setShowProfile] = useState(false); 

  const handleClick = () => {
    navigateTo('/login');
  };

  const handleAbout = () => {
    navigateTo('/aboutUs');
  }

  const handleContactUs = () => {
    navigateTo('/ContactUs');
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
      ".account-icon", 
      { opacity: 0, scale: 0.8 }, 
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        ease: "power2.out", 
        delay: 0.8 
      }
    );
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-12">
          <a href="#" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto logo" />
          </a>
          <div className="hidden md:flex space-x-6 nav-links">
            <a href="#" className="hover:text-orange-500">Home</a>
            <a href="#" className="hover:text-orange-500">Browse Skills</a>
            <a href="#" className="hover:text-orange-500">Post Skills</a>
            <a href="#" className="hover:text-orange-500">My Booking</a>
            <a href="#" className="hover:text-orange-500">Notifications</a>
            <a href="#" className="hover:text-orange-500" onClick={handleAbout}>My Account</a>
            <a href="#" className="hover:text-orange-500" onClick={handleContactUs}>Contact Us</a>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:block text-md hover:text-orange-500 mr-5" onClick={handleClick}>Login</button>

          <div className="relative">
            <FaUserCircle
              className="mt-[-15px] absolute text-3xl cursor-pointer hover:text-orange-500 left-25 account-icon"
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














// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
// import gsap from "gsap";
// import logo from "../assets/logo.png"; 
// import { FaUserCircle } from "react-icons/fa";
// import UserProfile from './UserProfile'; // Import UserProfile

// function Navbar() {
//   const navigateTo = useNavigate();
//   const [showProfile, setShowProfile] = useState(false); // Manage state to show/hide profile

//   const handleClick = () => {
//     navigateTo('/login');
//   };

//   const handleContactUs = () => {
//     navigateTo('/ContactUs');
//   };

//   const handleAccount = () => {
//     setShowProfile(!showProfile); // Toggle the profile modal visibility
//   };

//   const handleCloseProfile = () => {
//     setShowProfile(false); // Close the profile modal when the cross button is clicked
//   };

//   useEffect(() => {
//     const tl = gsap.timeline();

//     tl.fromTo(
//       ".logo", 
//       { opacity: 0, y: 30 }, 
//       { 
//         opacity: 1, 
//         y: 0, 
//         duration: 0.6, 
//         ease: "power3.out",
//         delay: 0.1 
//       }
//     );

//     tl.fromTo(
//       ".nav-links a", 
//       { opacity: 0, x: -100 },
//       {
//         opacity: 1, 
//         x: 0, 
//         duration: 0.8, 
//         stagger: 0.1, 
//         ease: "power3.out",
//         delay: 0.2
//       }
//     );

//     tl.fromTo(
//       ".account-icon", 
//       { opacity: 0, scale: 0.8 }, 
//       { 
//         opacity: 1, 
//         scale: 1, 
//         duration: 0.6, 
//         ease: "power2.out", 
//         delay: 0.8 
//       }
//     );
//   }, []);

//   return (
//     <nav className="bg-gray-800 text-white shadow-md">
//       <div className="container mx-auto flex items-center justify-between py-4 px-6">
//         <div className="flex items-center space-x-12">
//           <a href="#" className="flex items-center">
//             <img src={logo} alt="Logo" className="h-10 w-auto logo" />
//           </a>
//           <div className="hidden md:flex space-x-6 nav-links">
//             <a href="#" className="hover:text-orange-500">Home</a>
//             <a href="#" className="hover:text-orange-500">Browse Skills</a>
//             <a href="#" className="hover:text-orange-500">Post Skills</a>
//             <a href="#" className="hover:text-orange-500">My Booking</a>
//             <a href="#" className="hover:text-orange-500">Notifications</a>
//             <a href="#" className="hover:text-orange-500">About Us</a>
//             <a href="#" className="hover:text-orange-500" onClick={handleContactUs}>Contact Us</a>
//           </div>
//         </div>

//         <div className="flex items-center space-x-4">
//           <button className="hidden md:block text-md hover:text-orange-500 mr-5" onClick={handleClick}>Login</button>

//           <div className="relative">
//             <FaUserCircle
//               className="mt-[-15px] absolute text-3xl cursor-pointer hover:text-orange-500 left-25 account-icon"
//               onClick={handleAccount} // Toggle the profile modal
//             />
//           </div>
//         </div>
//       </div>

//       Conditionally render the UserProfile component
//       {showProfile && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm z-50">
//           <UserProfile onClose={handleCloseProfile} /> {/* Pass handleCloseProfile to close the modal */}
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;


