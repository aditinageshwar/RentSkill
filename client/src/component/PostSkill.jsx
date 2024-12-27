import React, { useEffect, useRef, useState, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { IoSend  } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
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

  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:8080", { withCredentials: true });
    socket.current.on('newSkill', (newSkill) => {
      setProviders((prevProviders) => [...prevProviders, newSkill]);
    });

    providers.forEach((provider) => {
      socket.current.emit("registerProvider", provider.id); 
    });

    socket.current.on("joinChatRoom", ({ roomId, seekerId }) => {
      const confirmation = window.confirm("A seeker wants to connect you. Are you want to join the chat?");
      if(confirmation) {
        socket.current.emit("joinRoom", roomId);
        setRoomId(roomId);
      }
      else
      {
        socket.current.emit("declineChatRequest", { seekerId, message: "The Provider does not want to join the chat with you." });
      }
    });

    socket.current.on('receiveMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, { sender: msg.senderId , message: msg.message }]);
    });

    return () => {
      socket.current.off("newSkill");
      socket.current.off("joinChatRoom");
      socket.current.off("receiveMessage");
    };
}, [providers]);

const sendMessage = () => {
  if (newMessage.trim() && roomId) {
    socket.current.emit('sendMessage', { roomId: roomId , message: newMessage, senderId: 'Aditi' });               //change with provider username
    setMessages(prevMessages => [...prevMessages, { sender: 'Aditi', message: newMessage }]);                      //change with provider username
    setNewMessage('');
  }
};

return (
  <div className="bg-gray-50">
    {roomId && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div>}
  
    <div className={roomId ? "blur-md" : ""}>
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

     {/* Chat Page */}
    {roomId && (
      <div className="chat-modal fixed top-40 left-1/2 transform -translate-x-1/2 w-1/3 z-50 bg-gray-50 border-2 border-gray-400 h-[470px] max-h-[470px] flex flex-col">
        <div className="chat-header p-4 border-b text-2xl text-gray-600 font-semibold bg-red-100 flex items-center">
           <MdPeopleAlt size={30} />
          <h3 className="flex-grow text-center">Chat with Skill Seeker</h3>
        </div>
        <div className="chat-body p-4 flex-grow overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${ msg.sender === "Aditi" ? "justify-end" : "justify-start"}`}>
            <div className={`message p-2 mb-1 rounded-lg ${msg.sender === 'Aditi' ? 'bg-blue-400 text-white rounded-tr-none' : 'bg-orange-300 text-white rounded-tl-none'}`}>
              <p>{msg.message}</p>
            </div>
            </div>
          ))}
        </div>
        <div className="chat-footer p-4 flex items-center border-t bg-red-100">
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

export default PostSkill;