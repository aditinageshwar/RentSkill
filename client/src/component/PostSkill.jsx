import React, { useEffect, useRef, useState, useContext } from "react";
import { FaEdit, FaPaperclip } from "react-icons/fa";
import { IoSend  } from "react-icons/io5";
import { MdPeopleAlt, MdCallEnd} from "react-icons/md";
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
      profileImg : photo ? photo :  `${process.env.REACT_APP_API_URL}/${user.profileImg}`,
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

  const [call,setCall] = useState(false);
  const [seekerId, setSeekerId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const socket = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_URL, { withCredentials: true });
    socket.current.on('newSkill', (newSkill) => {
      setProviders((prevProviders) => [...prevProviders, newSkill]);
    });

    providers.forEach((provider) => {
      socket.current.emit("registerProvider", provider.id); 
    });

    socket.current.on("joinChatRoom", ({ roomId, seekerId, seekerEmail, providerEmail, Skill, Price}) => {
      const confirmation = window.confirm("A seeker is requesting to connect with you. Would you like to join the chat?");
      if(confirmation) {
        socket.current.emit("joinRoom", {roomId, seekerEmail, providerEmail, Skill, Price});
        setRoomId(roomId);
      }
      else
      {
        socket.current.emit("declineChatRequest", { seekerId, message: "The provider has declined to join the chat with you." });
      }
    });

    socket.current.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { sender: msg.senderId , message: msg.message }]);
    });

    socket.current.on('receiveFile', ({ fileName, fileData, senderId }) => {
      setMessages((prevMessages) => [...prevMessages, { sender: senderId, fileName: fileName, fileData: fileData }]);
    });

    socket.current.on("UserResponse", (message) => {
      alert(message);
      setRoomId(null);
    });

    socket.current.on('videoCallOffer', async({offer, seekerId, providerEmail, seekerEmail, Skill, Price }) => { 
      setCall(true);
      setSeekerId(seekerId);
      const peerConnection = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit('iceCandidate', { candidate: event.candidate, targetId: seekerId});
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

      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer(); 
      await peerConnection.setLocalDescription(answer);
      socket.current.emit('videoCallAnswer', {answer, seekerId, providerEmail, seekerEmail, Skill, Price });

      socket.current.on('iceCandidate', async(candidate) => {
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.current.on("endCall", () => {
        setCall(false);
        peerConnection.close();
      });
    });

    return () => {
      socket.current.off("newSkill");
      socket.current.off("joinChatRoom");
      socket.current.off("receiveMessage");
      socket.current.off('receiveFile');
      socket.current.off("UserResponse");
      socket.current.off('endCall');
      socket.current.off('videoCallOffer');
    };
}, [providers]);

const sendMessage = () => {
  const parts = roomId.split('*');
  const providerId = parts[parts.length - 2];
  if(newMessage.trim()) {
    socket.current.emit('sendMessage', { roomId: roomId , message: newMessage, senderId: providerId });          
    setMessages(prevMessages => [...prevMessages, { sender: providerId, message: newMessage }]);                     
    setNewMessage('');
  }
  else if(file)
  {
    const reader = new FileReader();
    reader.onload = () => {
      socket.current.emit('sendFile', { roomId: roomId, fileName: file.name, fileData: reader.result, senderId: providerId });
      setMessages((prevMessages) => [...prevMessages, { sender: providerId, fileName: file.name, fileData: reader.result}]);
    };
    reader.readAsDataURL(file);  
    setFile(null);
  }
};

const handleLeave = () => {
  socket.current.emit("UserLeft", { roomId, message : "Skill Provider has left the chat!" });
  setRoomId(null);
};

const handleEndCall = () => {
  setCall(false);
  socket.current.emit("endCall", {targetId: seekerId});
}

return (
  <div className="bg-gray-50">
    {(roomId || call) && (<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div> )}
  
    <div className={roomId || call ? "blur-md" : ""}>
     <div ref={formRef} className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <h2 className="text-2xl text-center font-semibold mb-4">Post Your Skills...</h2>
        <form onSubmit={handlePost}>
          <div className="flex flex-col gap-4 border-2 border-gray-400 bg-indigo-50 p-6 rounded-md shadow-gray-600 shadow-lg">
            <div>
             <div className="flex items-center justify-center relative">
                <img
                  src={photo ? photo : user.profileImg ? `${process.env.REACT_APP_API_URL}/${user.profileImg}` : "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"}
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
             onChange={(e) => { if(Number(e.target.value) > 0) setPrice(e.target.value); }}
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
      <div className="chat-modal fixed top-40 left-1/2 transform -translate-x-1/2 w-1/3 z-50 bg-gray-50 border-2 border-gray-400 h-[470px] max-h-[470px] flex flex-col">
        <div className="chat-header p-4 border-b text-2xl text-gray-600 font-semibold bg-red-100 flex items-center">
          <MdPeopleAlt size={30} />
          <h3 className="flex-grow text-center">Chat with Skill Seeker</h3>
          <button onClick={handleLeave} className="text-sm px-1 border-2 border-red-600 bg-red-500 text-white relative -top-4 -right-3"> Leave </button>
        </div>
        <div className="chat-body p-4 flex-grow overflow-auto">
          {messages.map((msg, index) => (
           <div key={index} className={`flex ${ msg.sender === roomId.split('*').slice(-2, -1)[0] ? "justify-end" : "justify-start"}`}>
            <div className={`message p-2 mb-1 rounded-lg ${msg.message ? (msg.sender === roomId.split('*').slice(-2, -1)[0] ? 'bg-blue-400 text-white rounded-tr-none' : 'bg-orange-300 text-white rounded-tl-none'): ''}`}>  
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

export default PostSkill;