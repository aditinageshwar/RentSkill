import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import {ImCross } from "react-icons/im";
import { gsap } from "gsap";

const UserProfile = ({onClose}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState(null);
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    setPhoto(URL.createObjectURL(e.target.files[0]));
  };

  const handleCloseProfile = () => {
    onClose();
  };

  useEffect(() => {
    gsap.fromTo(
      ".page-container", 
      { x: "100%", opacity: 0 }, 
      { x: "0%", opacity: 1, duration: 1.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="mt-6 page-container min-h-screen flex items-center justify-center">
      <div className="bg-gray-300 p-6 text-center rounded-md shadow-2xl shadow-black w-96 h-[400px]">
        <div className="flex items-center justify-center relative">
          <img
            src="https://iso.500px.com/wp-content/uploads/2015/09/stock-photo-parks-and-squares-1012445728-3000x2000.jpg"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-black mt-[-60px]"
          />
          <button
            onClick={handleCloseProfile} 
            className="absolute top-[-35px] right-[-35px] text-2xl text-red-700"
          >
            <ImCross />
          </button>
        </div>

        <div className="flex justify-center mt-1 mb-12">
          <label
            htmlFor="photoInput"
            className="text-cyan-400 cursor-pointer flex items-center space-x-2"
          >
            <FaEdit />
            <span>Edit Photo</span>
          </label>
          <input
            id="photoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-sm bg-gray-200 border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <FaEdit className="absolute top-4 right-3 text-cyan-400" />
        </div>

        <div className="mb-4 relative">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-sm bg-gray-200 border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <FaEdit className="absolute top-4 right-3 text-cyan-400" />
        </div>
        <div className="mb-4 relative">
          <input
            type="tel"
            placeholder="Phone number"
            pattern="[0-9]{10}"
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 rounded-sm bg-gray-200 border text-sm focus:outline-none focus:ring-2 "
          />
          <FaEdit className="absolute top-4 right-3 text-cyan-400"/>
        </div>
        <button
          type="submit"
          className="w-24 h-8 mt-6 bg-orange-400 text-white font-bold rounded hover:bg-cyan-500 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default UserProfile;