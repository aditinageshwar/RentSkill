import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import axiosInstance from "../Axios.js";

export default function BookingHistory() 
{
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    profileImg: "",
  });

  const [browseData, setBrowseData] = useState([]); 
  const [postData, setPostData] = useState([]); 

  const sidebarRef = useRef(null); 
  const headingRef = useRef(null); 
  const browseRef = useRef(null); 
  const postRef = useRef(null); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/userProfile");
        if (response.data.message) 
          alert(response.data.message);
        else if (response.data.user)
        { 
          const userData = response.data.user;
          setUser(userData);
          const bookingResponse = await axiosInstance.get(`/api/bookingHistory?email=${userData.email}`);
          if(bookingResponse.data)
          {
            setBrowseData(bookingResponse.data.browseData);
            setPostData(bookingResponse.data.postData);
          }
        }
      } 
      catch (error) {
        alert("Failed to load user data.");
      }
    };  
    fetchUserData();

    gsap.fromTo(
      sidebarRef.current,
      { y: 200, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" }
    );
    gsap.fromTo(
      headingRef.current,
      { x: -200, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.5, ease: "power2.out" }
    );

    gsap.set([browseRef.current, postRef.current], {
      opacity: 0,
      scale: 0.5,
    });
    gsap.to(browseRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
    });
    gsap.to(postRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
    });
  }, []); 

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div
        ref={sidebarRef} 
        className="w-1/4 bg-white shadow-lg"
      >
        <div className="p-6 text-center">
          <img
            src={user.profileImg ? `http://localhost:8080/${user.profileImg}` : "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover mx-auto mt-8 mb-4 border-2 border-gray-300"
          />
          <h2 className="text-2xl font-bold"> {user.name} </h2>
          <p className="text-md text-gray-500"> {user.email} </p>
          <p className="text-md text-gray-500"> {user.phone} </p>
        </div>
      </div>

      <div className="w-3/4 p-8">
        <h1 ref={headingRef} className="text-2xl font-semibold mb-7 mt-[-10px]">
          Booking History
        </h1>

        {/* Browse Skills Table */}
        <div ref={browseRef} className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex flex-col items-center">
            Browse Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white shadow-md rounded-lg border-2">
            {browseData.length > 0 && (
              <thead>
                <tr className="bg-red-200 border-b-2 border-gray-400">
                  <th className="px-4 py-2 text-left">Skill</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              )}
              <tbody>
                {browseData.map((browse,index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-teal-50": "bg-violet-50"} hover:bg-slate-200`}>
                    <td className="px-4 py-2">{browse.Skill}</td>
                    <td className="px-4 py-2">Rs. {browse.Price}</td>
                    <td className="px-4 py-2">{browse.date}</td>
                  </tr>
                ))}

                 {browseData.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-gray-500 py-4 font-medium"
                    >
                      No browsed skills available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post Skills Table */}
        <div ref={postRef}>
          <h2 className="text-xl font-semibold mb-4 flex flex-col items-center">
            Post Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white shadow-md rounded-lg border-2">
             {postData.length > 0 && (
              <thead>
                <tr className="bg-red-200 border-b-2 border-gray-400">
                  <th className="px-4 py-2 text-left">Skill</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              )}
              <tbody>
                {postData.map((post,index) => (
                  <tr key={index} className={`${index % 2 === 0 ? "bg-teal-50": "bg-violet-50"} hover:bg-slate-200`}>
                    <td className="px-4 py-2">{post.Skill}</td>
                    <td className="px-4 py-2">Rs. {post.Price}</td>
                    <td className="px-4 py-2">{post.date}</td>
                  </tr>
                ))}
                {postData.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-gray-500 py-4 font-medium"
                    >
                      No post skills available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}