import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BookingHistory() 
{
  const [browseData, setBrowseData] = useState([]); 
  const [postData, setPostData] = useState([]); 

  const sidebarRef = useRef(null); 
  const headingRef = useRef(null); 
  const browseRef = useRef(null); 
  const postRef = useRef(null); 

  useEffect(() => {
    const browseSkills = [
      {
        id: 1,
        skill: "Cooking",
        price: 200,
        date: "2024-06-10",
      },
      {
        id: 2,
        skill: "Drawing",
        price: 300,
        date: "2024-06-12",
      },
      {
        id: 3,
        skill: "Art Design",
        price: 150,
        date: "2024-06-14",
      },
    ];

    const postSkills = [
      {
        id: 1,
        skill: "Photography",
        price: 500,
        date: "2024-06-11",
      },
      {
        id: 2,
        skill: "Teaching",
        price: 800,
        date: "2024-06-13",
      },
      {
        id: 3,
        skill: "Web Development",
        price: 1000,
        date: "2024-06-15",
      },
    ];
    setBrowseData(browseSkills);
    setPostData(postSkills);

    
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
  }, []);

  useEffect(() => {
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
            src="https://i.pinimg.com/736x/8a/55/99/8a5599792c0d7b0a02377b97fafe76a9.jpg"
            alt="Profile"
            className="rounded-full mx-auto mb-4 h-50"
          />
          <h2 className="text-lg font-bold">Priyanka</h2>
          <p className="text-sm text-gray-500">Priyanka@gmail.com</p>
          <p className="text-sm text-gray-500">+91 6789065234</p>
        </div>
      </div>

      <div className="w-3/4 p-8">
        <h1 ref={headingRef} className="text-2xl font-semibold mb-7">
          Booking History
        </h1>

        {/* Browse Skills Table */}
        <div ref={browseRef} className="mb-8">
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
                  <tr key={browse.id} className={`${index % 2 === 0 ? "bg-teal-50": "bg-violet-50"} hover:bg-slate-200`}>
                    <td className="px-4 py-2">{browse.skill}</td>
                    <td className="px-4 py-2">Rs. {browse.price}</td>
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
                  <tr key={post.id} className={`${index % 2 === 0 ? "bg-teal-50": "bg-violet-50"} hover:bg-slate-200`}>
                    <td className="px-4 py-2">{post.skill}</td>
                    <td className="px-4 py-2">Rs. {post.price}</td>
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





