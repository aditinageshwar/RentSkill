import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import heroImage from '../assets/heroImage.jpg';


export default function HeroSection() {
  useEffect(() => {
    gsap.fromTo(
      '.hero-heading',
      { opacity: 0, y: -50 },  
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.5 } 
    );

    gsap.fromTo(
      '.hero-text',
      { opacity: 0, y: -50 },  
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 2 }
    );

    gsap.fromTo(
      '.hero-button',
      { opacity: 0, y: -50 },  
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 2 } 
    );

    gsap.fromTo(
      '.hero-box',
      { opacity: 0, y: -50 },  
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 2.5 } 
    );
  }, []);

  return (
    <section
      className="relative bg-cover bg-center h-screen text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center px-4">
        <h1 className="hero-heading text-4xl md:text-6xl font-bold">
          Hire Skilled Professionals
        </h1>
        <p className="hero-text mt-4 text-lg md:text-xl">
          Easily find the perfect service you need, all in one place.
        </p>
        <div className="mt-6">
          <button className="hero-button bg-orange-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-orange-600">
            Get Started
          </button>
        </div>

        <div className="hero-box mt-10 flex flex-col md:flex-row items-center bg-white rounded-md p-4 shadow-lg w-full max-w-4xl space-y-4 md:space-y-0 md:space-x-6">
          <input
            type="text"
            placeholder="Enter Keyword"
            className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select defaultValue="Choose Categories" className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black opacity-50">
            <option value="Choose Categories" hidden> Choose Categories </option>
            <option>DIY Repairs</option>
            <option>Gardening</option>
            <option>Pet Care</option>
            <option>Home Improvement</option>
            <option>Study Assistance</option>
            <option>Creative Arts & Crafts</option>
            <option>Health & Wellness</option>
            <option>Cooking & Baking</option>
          </select>

          <select defaultValue="Choose Location" className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black opacity-50">
            <option value="Choose Location" hidden> Choose Location </option>
            <option>Ahmedabad</option>
            <option>Bangalore</option>
            <option>Bhopal</option>
            <option>Chennai</option>
            <option>Hyderabad</option>
            <option>Indore</option>
            <option>Jaipur</option>
            <option>Kolkata</option>
            <option>Lucknow</option>
            <option>Mumbai</option>
            <option>New Delhi</option>
            <option>Pune</option>
            <option>Surat</option>
            <option>Others</option>
          </select>

          <button className="bg-orange-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-orange-600 transition-all duration-300 ease-in-out">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
