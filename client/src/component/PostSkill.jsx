import React, { useEffect, useRef, useState, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { gsap } from "gsap";
import { SkillContext } from './AppContent';
import axiosInstance from "../Axios.js";
import { io } from 'socket.io-client';

const PostSkill = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {providers, setProviders, postSkill } = useContext(SkillContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImg: "",
  });
  const [photo, setPhoto] = useState(null);
  const [skill, setSkill] = useState("");
  const [price, setPrice] = useState("");
  const [isOnline, setIsOnline] = useState(true);
     
  const convertBlobToBase64 = (blob) => {               
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);  
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handlePhotoChange = async(e) => {
    const file = e.target.files[0];
    const base64Image = await convertBlobToBase64(file);             //blob image not seen to different clients so Base64 conversion required
    setPhoto(base64Image);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/userProfile");
        if (response.data.message) 
          alert(response.data.message);
        else if (response.data.user)
        setUser(response.data.user);
      } 
      catch (error) {
        alert("Failed to load user data.");
      }
    };
    fetchUserData();
  }, []);

  const handlePost = (e) => {
    e.preventDefault();
    const newProvider = {
      id: Date.now(),                                                                     //for unique identification
      profileImg : photo ? photo :  `http://localhost:8080/${user.profileImg}`,
      name: user.name,
      email: user.email,
      phone: user.phone,
      skill,
      price,
      isOnline,
    };
    postSkill(newProvider);
    setSkill("");
    setPrice("");
    setPhoto(null);
    setIsOnline(true);              
    alert("Skill posted successfully!");
  };
 
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval); 
  }, []);


  const formRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { rotateX: 90, scale: 0.8, opacity: 0 , transformOrigin: "center top" },       //start with
      { 
        rotateX: 0,              
        scale: 1,
        opacity: 1, 
        duration: 1.5,            
        delay: 0.2,
        ease: "back.out(1.7)",      
      }
    );
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:8080", { withCredentials: true });
    socket.on('newSkill', (newSkill) => {
      setProviders((prevProviders) => [...prevProviders, newSkill]);
    });
    return () => {
      socket.off('newSkill');
    };
}, []);

  return (
  <div className="bg-gray-50">
    <div ref={formRef} className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md">
      <h2 className="text-2xl text-center font-semibold mb-4">Post Your Skills...</h2>
      <form onSubmit={handlePost}>
        <div className="flex flex-col gap-4 border-2 border-gray-400 bg-indigo-50 p-6 rounded-md shadow-gray-600 shadow-lg">
          <div>
            <div className="flex items-center justify-center relative">
              <img
                src={photo ? photo : user.profileImg ? `http://localhost:8080/${user.profileImg}` : "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-black mt-[-10px]"
              />
            </div>
  
            <div className="flex justify-center mt-1 mb-4">
              <label
                htmlFor="photoInput"
                className="text-blue-500 cursor-pointer flex items-center space-x-2"
              >
                <FaEdit />
                <span>Change Photo</span>
              </label>
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
  
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={user.name}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={user.email}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            pattern="[0-9]{10}"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={user.phone}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Enter Skill (e.g. Art, Cooking, Gardening)"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Enter Price/Hour"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
  
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isOnline}
              onChange={() => setIsOnline(!isOnline)}
            />
            Online
          </label>
  
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-green-500 text-white text-lg w-32 h-9 rounded-md hover:bg-green-600"
            >
              Post Skill
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>  

  <div className="border-2 border-gray-50 rounded-sm mb-4 shadow-sm">
    <p className="text-center text-2xl font-semibold mb-4">Your Skills at a Glance</p>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      {providers.map((provider) => ( 
      <div key={provider.id} className="border border-gray-300 rounded-md shadow-xl overflow-hidden">
        <img
          src={provider.profileImg}
          alt="Profile"
          className="w-full h-48 object-cover object-[50%_10%] hover:scale-105"
        />
        <div className="p-4">
          <h3 className="text-lg text-gray-900 mb-1">{provider.name}</h3>
          <h3 className="text-lg text-gray-900 mb-1">{provider.email}</h3>
          <h3 className="text-lg text-gray-900 mb-2">{provider.phone}</h3>
          <p className="text-xl font-semibold">Skills:  {provider.skill}</p>
          <p className="text-orange-600 text-lg font-bold mb-2">Price/Hour: Rs.{provider.price}</p>
          <p className={`inline text-xl px-2 font-semibold bg-yellow-400 text-gray-800 rounded-full shadow transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
              }`}> {provider.isOnline ? "Online" : "Offline"} 
          </p>
        </div>
      </div>
    ))}

    {providers.length === 0 && (
        <marquee direction="right" behavior="scroll" scrollamount="13" className="text-gray-500 text-lg col-span-4">You haven't posted any skills yet.</marquee>
    )}
    </div>
  </div>

  </div>
 );
};

export default PostSkill;