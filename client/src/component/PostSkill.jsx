import React, { useEffect, useRef, useState, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { gsap } from "gsap";
import { SkillContext } from "../App";

const PostSkill = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { providers, setProviders } = useContext(SkillContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [skill, setSkill] = useState("");
  const [price, setPrice] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [photoFile, setPhotoFile] = useState(null); 
  const [photo, setPhoto] = useState("https://img.freepik.com/free-photo/businesswoman-posing_23-2148142829.jpg?ga=GA1.1.209205123.1699593011&semt=ais_hybrid");         //photo from signup page

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); 
      setPhotoFile(file); 
    }
  };

  const handlePost = (e) => {
    e.preventDefault();
    const newProvider = {
      id: Date.now(),                     //for unique identification
      photo,
      name,
      email,
      phone,
      skill,
      price,
      isOnline,
    };
    setProviders([...providers, newProvider]);
    setName("");
    setEmail("");
    setPhone("");
    setSkill("");
    setPrice("");
    setIsOnline(true);
    setPhoto("https://img.freepik.com/free-photo/businesswoman-posing_23-2148142829.jpg?ga=GA1.1.209205123.1699593011&semt=ais_hybrid");                //photo from signup page
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

  return (
  <div className="bg-gray-50">
    <div ref={formRef} className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-md">
      <h2 className="text-2xl text-center font-semibold mb-4">Post Your Skills...</h2>
      <form>
        <div className="flex flex-col gap-4 border-2 border-gray-400 bg-indigo-50 p-6 rounded-md shadow-gray-600 shadow-lg">
          <div>
            <div className="flex items-center justify-center relative">
              <img
                src={photo}
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
            placeholder="Your Name"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            pattern="[0-9]{10}"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Skill (e.g. Art, Cooking, Gardening)"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Enter Price/Hour"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
              onClick={handlePost}
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
      <div className="border border-gray-300 rounded-md shadow-xl overflow-hidden">
        <img
          src={provider.photo}
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
