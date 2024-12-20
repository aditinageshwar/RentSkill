import React, { useEffect, useRef, useContext, useState } from "react";
import { SkillContext } from './AppContent';
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoVideocam } from "react-icons/io5";
import Lottie from 'react-lottie';
import animationData from "../pointSearch.json";
import { gsap } from "gsap";

const BrowseSkill = () => {
  const { providers } = useContext(SkillContext);

  const [searchSkill, setSearchSkill] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); 
  const [isVisible, setIsVisible] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const filteredProviders = providers.filter((provider) =>
      provider.skill.toLowerCase().includes(searchSkill.toLowerCase()) && provider.isOnline
  );

  if (sortOrder === "lowToHigh")                           //for sorting
    filteredProviders.sort((a, b) => a.price - b.price);
  else if (sortOrder === "highToLow") 
    filteredProviders.sort((a, b) => b.price - a.price);
  
  const handleSearch = () => {
    if (searchSkill.trim() == "") 
      setIsSearching(false);
    else 
      setIsSearching(true); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval); 
  }, []);

  const cardsRef = useRef([]);                           //for gsap animation
  useEffect(() => {
    if(isSearching && filteredProviders.length > 0) {
      if(!animationDone) 
      {
        gsap.fromTo(
          cardsRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2, 
          }
        );
        setAnimationDone(true);
      }
    } 
    else 
    {
      setAnimationDone(false);
    }
  }, [isSearching, filteredProviders, animationDone]);

  const options = {                                        //for Lottie-Animation
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-semibold mb-6">Browse Skills</h2>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <select
            className="p-2 text-gray-800 border border-gray-300 rounded-md focus:outline focus:ring-orange-600 focus:ring-2 focus:bg-orange-400 focus:text-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
          <option value="" selected disabled hidden>Sort By</option>
          <option className="bg-gray-200 text-black" value="lowToHigh">Price: Low to High</option>
          <option className="bg-gray-100 text-black" value="highToLow">Price: High to Low</option>
         </select>
        </div>
 
        <div className="flex items-center justify-center flex-1">
          <input
            type="text"
            placeholder="Enter skill (e.g. Cooking, Drawing, Art...)"
            className="p-2 w-[500px] mr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            value={searchSkill}
            onChange={(e) => {setSearchSkill(e.target.value);
              if(e.target.value.trim() === "") 
              setIsSearching(false);  
            }}
          />
          <button 
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
            onClick={handleSearch} 
          >
            Search
          </button>
        </div>
      </div>

      {!isSearching && (<div>
        <p className="text-center text-md text-gray-600">Unlock skills, Unlock possibilities.</p>
        <div className="transform scale-75 origin-center mb-[-140px] mt-[-60px]">
          <Lottie options={options} height={400} width={400} />
        </div>
      </div>
      )}
      
      {/* Display Providers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 mt-12">
        {isSearching && filteredProviders.length > 0 ? ( filteredProviders.map((provider,index) => (
          <div  ref={(el) => (cardsRef.current[index] = el)}  key={provider.id}  className="border border-gray-300 rounded-md shadow-xl overflow-hidden">
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

             <div className="flex justify-start gap-6 mt-4">
              <p className="text-xl font-bold">Contact via: </p>
              <HiChatBubbleOvalLeftEllipsis className="text-4xl text-green-600 hover:scale-125 transition-transform -ml-2" />
              <BiSolidPhoneCall className="text-4xl text-blue-500 hover:scale-125 transition-transform -ml-2" />
              <IoVideocam className="text-4xl text-yellow-600 hover:scale-125 transition-transform -ml-2" />
            </div>
           </div>
          </div>
        ))) :  
         isSearching && filteredProviders.length === 0 && (
            <marquee direction="right" behavior="scroll" scrollamount="13" className="text-gray-500 text-lg col-span-4 mb-16">No providers available currently.Please try again later.!</marquee>
         )
       }
      </div>
    </div>
  );
};

export default BrowseSkill;