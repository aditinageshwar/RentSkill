import React, { useEffect, useRef, useContext, useState } from "react";
import { SkillContext } from './AppContent';
import { HiChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { IoVideocam,IoSend  } from "react-icons/io5";
import { FaPaperclip } from 'react-icons/fa';
import { MdPeopleAlt, MdCallEnd } from "react-icons/md";
import Lottie from 'react-lottie';
import animationData from "../pointSearch.json";
import { gsap } from "gsap";
import { io } from 'socket.io-client';
import axiosInstance from "../Axios.js";
import UserPayment from "./UserPayment.jsx";

const BrowseSkill = () => {
  const { providers, setProviders } = useContext(SkillContext);

  const [searchSkill, setSearchSkill] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); 
  const [isVisible, setIsVisible] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImg: "",
  });

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

  const [call,setCall] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL, { withCredentials: true });

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

const [paymentInitiated, setPaymentInitiated] = useState(false);
const [paymentDetails, setPaymentDetails] = useState(null);
const handleChatClick = (providerId, providerEmail, Skill, Price) => {
  const confirmation = window.confirm('You need to make a payment to proceed. Do you want to continue?');
  if (confirmation) {
    const seekerId = socket.current.id; 
    const seekerEmail = user.email;
    setPaymentDetails({
      seekerEmail,
      seekerPhone : user.phone,
      seekerName : user.name,
      onPaymentSuccess: () => {
        socket.current.emit('startChat', {providerId, seekerId, seekerEmail, providerEmail, Skill, Price});
      },
    });
    setPaymentInitiated(true);
  }
};

if(socket.current)
{
  socket.current.on('chatRoomCreated', (roomId) => {
    setRoomId(roomId);
    setPaymentInitiated(false);
  });
}

const sendMessage = () => {
  const parts = roomId.split('*');
  const senderId = parts[parts.length - 1];
  if(newMessage.trim()) {
    socket.current.emit('sendMessage', { roomId: roomId, message: newMessage, senderId: senderId });           
    setMessages(prevMessages => [...prevMessages, { sender: senderId, message: newMessage }]);                     
    setNewMessage('');
  }
  else if(file) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.current.emit('sendFile', { roomId: roomId, fileName: file.name, fileData: reader.result, senderId: senderId });
      setMessages((prevMessages) => [...prevMessages, { sender: senderId, fileName: file.name, fileData: reader.result}]);  
    };
    reader.readAsDataURL(file); 
    setFile(null);
  }
};

useEffect(() => {
  if (socket.current) {
    socket.current.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { sender: msg.senderId , message: msg.message }]);
    });

    socket.current.on('receiveFile', ({ fileName, fileData, senderId }) => {
      setMessages((prevMessages) => [...prevMessages, { sender: senderId, fileName: fileName, fileData: fileData }]);
    });

    socket.current.on("providerResponse", (data) => {
      alert(data); 
      setRoomId(null);
    });

    socket.current.on("UserResponse", (message) => {
      alert(message);
      setRoomId(null);
    });
  }

  return () => {
    if (socket.current) {
      socket.current.off('receiveMessage');
      socket.current.off('receiveFile');
      socket.current.off("providerResponse");
      socket.current.off("UserResponse");
    }
  };
}, [socket]);

const handleLeave = () => {
  socket.current.emit("UserLeft", { roomId, message : "Skill Seeker has left the chat!" });
  setRoomId(null);
};

const [providerId, setProviderId] = useState(null);
const handleVideoCall = async(providerId, providerEmail, Skill, Price) => {
  const confirmation = window.confirm('You need to make a payment to proceed. Do you want to continue?');
  if(confirmation) 
  {
    setPaymentDetails({
      seekerEmail: user.email,
      seekerPhone : user.phone,
      seekerName : user.name,
      onPaymentSuccess: async() => {
        setCall(true);
        setProviderId(providerId);
        const seekerId = socket.current.id; 
        const seekerEmail = user.email;
        const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });        

        peerConnection.onicecandidate = (event) => {
         if (event.candidate) {
          socket.current.emit('iceCandidate', {candidate: event.candidate, targetId: providerId});
         }
        };

        peerConnection.ontrack = (event) => {
          const remoteStream = new MediaStream();
          remoteStream.addTrack(event.track);
          document.querySelector("#remoteVideo").srcObject = remoteStream;
        };

        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
        document.querySelector("#localVideo").srcObject = localStream;

        const offer = await peerConnection.createOffer();                                                          
        await peerConnection.setLocalDescription(offer);                                                        
        socket.current.emit('videoCallOffer', {offer, providerId, seekerId, providerEmail, seekerEmail, Skill, Price});

        socket.current.on('videoCallAnswer', async(answer) => {
          if (peerConnection) {
           await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.current.on('iceCandidate', async (candidate) => {
          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        socket.current.on("endCall", () => {
          setCall(false);
          peerConnection.close();
          setPaymentInitiated(false); 
        });
      },
    });
    setPaymentInitiated(true);
  }
};

const handleEndCall = () =>{
  setCall(false);
  socket.current.emit("endCall", {targetId: providerId}); 
  setPaymentInitiated(false); 
};

return (
  <div className="p-6">
    {(roomId || call) && (<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div> )}
  
    <div className={roomId || call? "blur-md" : ""}>
      <h2 className="text-2xl text-center font-semibold mb-6">Browse Skills</h2>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <select
            className="p-2 text-gray-800 border border-gray-300 rounded-md focus:outline focus:ring-orange-600 focus:ring-2 focus:bg-orange-400 focus:text-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
          <option value="" hidden>Sort By</option>
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
              <p className="text-xl font-bold">Contact via Chat/Call: </p>
              {paymentInitiated && paymentDetails && (
                <UserPayment
                  amount={provider.price}
                  seekerEmail={paymentDetails.seekerEmail}
                  seekerPhone={paymentDetails.seekerPhone}
                  seekerName={paymentDetails.seekerName}
                  onPaymentSuccess={paymentDetails.onPaymentSuccess}
                />
              )}
              <HiChatBubbleOvalLeftEllipsis className="text-4xl text-green-600 hover:scale-125 transition-transform -ml-2" 
                onClick={() => handleChatClick(provider.id , provider.email, provider.skill, provider.price)} />
              <IoVideocam className="text-4xl text-yellow-600 hover:scale-125 transition-transform -ml-2" 
                onClick={() => handleVideoCall(provider.id, provider.email, provider.skill, provider.price)} />
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

    {/* Video call */}
    {call && (
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-1/2 z-50 bg-gray-50 border-2 border-gray-400">
        <div className="relative">
          <video id="remoteVideo" autoPlay className="w-full h-full object-cover"></video>
          <video id="localVideo" autoPlay muted className="absolute bottom-1 right-1 w-36 h-36 rounded-sm border-2 border-white object-cover"></video>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button onClick={handleEndCall} className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition duration-300">
              <MdCallEnd size={24} />
            </button>
          </div>
        </div>
     </div>
    )}

    {/* Chat Page */}
    {roomId && (
      <div className="chat-model fixed top-40 left-1/2 transform -translate-x-1/2 w-1/3 z-50 bg-gray-50 border-2 border-gray-400 h-[470px] max-h-[470px] flex flex-col">
          <div className="chat-header p-4 border-b text-2xl text-gray-600 font-semibold bg-red-100 flex items-center">
            <MdPeopleAlt size={30} />
            <h3 className="flex-grow text-center">Chat with Skill Provider</h3>
            <button onClick={handleLeave} className="text-sm px-1 border-2 border-red-600 bg-red-500 text-white relative -top-4 -right-3"> Leave </button>
          </div>
          <div className="chat-body p-4 flex-grow overflow-auto">
            {messages.map((msg, index) => (
             <div key={index} className={`flex ${ msg.sender === roomId.split('*').slice(-1)[0] ? "justify-end" : "justify-start"}`}>
              <div className={`message p-2 mb-1 rounded-lg ${msg.message ? (msg.sender === roomId.split('*').slice(-1)[0] ? 'bg-blue-400 text-white rounded-tr-none' : 'bg-orange-300 text-white rounded-tl-none') : ''}`}>
                {msg.message ? (
                  <p> {msg.message} </p> 
                ) : msg.fileData ? (
                  <img src={msg.fileData} alt={msg.fileName} className="max-w-[150px] max-h-[150px] w-auto h-auto" /> 
                ) : null}
              </div>
             </div>
            ))}
          </div>

          <div className="chat-footer p-4 flex items-center border-t bg-red-100">
           <div className="relative flex items-center flex-grow">
            {file && (
             <div className="absolute left-0 right-0 top-[-185px] mx-auto w-[450px] h-[170px]">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="w-full h-full object-cover rounded-md"
              />
             </div>
            )}
            <input 
              type="text" 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type a message..." 
              className="flex-grow p-2 border-2 rounded focus:outline-none focus:ring-1 pr-10"
            />
            <label className="absolute right-4 cursor-pointer top-1/2 transform -translate-y-1/2">
             <FaPaperclip size={18} className="text-blue-300" />
             <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
             />
            </label>
           </div>
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