import React, { useEffect, useRef, useContext, useState } from "react";
import { SkillContext } from './AppContent';
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { BiSolidPhoneCall } from "react-icons/bi";
import { IoVideocam,IoSend  } from "react-icons/io5";
import Lottie from 'react-lottie';
import animationData from "../pointSearch.json";
import { gsap } from "gsap";
import { io } from 'socket.io-client';

const BrowseSkill = () => {
  const { providers, setProviders } = useContext(SkillContext);

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
  
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8080", { withCredentials: true });

    socket.current.on('newSkill', async(newSkill) => {
      if (newSkill.profileImg instanceof Blob || newSkill.profileImg instanceof File) 
      {
        const base64Image = await convertBlobToBase64(newSkill.profileImg);
        setProviders((prevProviders) => [...prevProviders,{ ...newSkill, profileImg: base64Image }]);
      } 
      else 
        setProviders((prevProviders) => [...prevProviders, newSkill]); 
    });
  
    return () => {
      socket.current.off('newSkill');
    };
}, []);

const handleChatClick = (providerId) => {
  const seekerId = socket.current.id; 
  socket.current.emit('startChat', {providerId, seekerId });
};

if(socket.current)
{
  socket.current.on('chatRoomCreated', (roomId) => {
    setRoomId(roomId);
  });
}

if(socket.current)
{
  socket.current.on("providerResponse", (data) => {
    alert(data); 
    setRoomId(null);
  });
}

const sendMessage = () => {
  if (newMessage.trim() && roomId) {
    socket.current.emit('sendMessage', { roomId: roomId, message: newMessage, senderId: 'Priyanka' });               //change with seeker username
    setMessages(prevMessages => [...prevMessages, { sender: 'Priyanka', message: newMessage }]);                     //change with seeker username
    setNewMessage('');
  }
};

useEffect(() => {
  if (socket.current) {
    socket.current.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { sender: msg.senderId , message: msg.message }]);
    });
  }

  return () => {
    if (socket.current) {
      socket.current.off('receiveMessage');
    }
  };
}, [socket]);

return (
  <div className="p-6">
    {roomId && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div>}
  
    <div className={roomId ? "blur-md" : ""}>
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

             <div className="flex justify-start gap-6 mt-4">
              <p className="text-xl font-bold">Contact via: </p>
              <HiChatBubbleOvalLeftEllipsis className="text-4xl text-green-600 hover:scale-125 transition-transform -ml-2" 
                onClick={() => handleChatClick(provider.id)} />
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

      {/* Chat Page */}
    {roomId && (
      <div className="chat-model fixed top-40 left-1/2 transform -translate-x-1/2 w-1/3 z-50 bg-gray-50 border-2 border-gray-400 h-[470px] max-h-[470px] flex flex-col">
          <div className="chat-header p-4 border-b text-2xl text-center font-semibold">
            <h3>Chat with Skill Provider</h3>
          </div>
          <div className="chat-body p-4 flex-grow overflow-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`message  p-2 mb-2 rounded-lg ${msg.sender === 'Sender' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                <span>{msg.sender} </span>
                <p>{msg.message}</p>
              </div>
            ))}
          </div>
          <div className="chat-footer p-4 flex items-center border-t">
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type a message..." 
              className="flex-grow p-2 border-2 rounded focus:outline-none focus:ring-1"
            />
            <button onClick={sendMessage} className="ml-2 p-2 bg-green-600 text-white rounded">
              <IoSend size={24} />
            </button>
          </div>
      </div>
    )}
  </div>
  );
};

export default BrowseSkill;