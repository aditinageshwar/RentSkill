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
  }, []);

  return (
    <section
      className="relative bg-cover bg-center h-screen text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center px-4">
        {/* Heading with GSAP animation */}
        <h1 className="hero-heading text-4xl md:text-6xl font-bold">
          Hire Skilled Professionals
        </h1>

        {/* Paragraph with GSAP animation */}
        <p className="hero-text mt-4 text-lg md:text-xl">
          Easily find the perfect service you need, all in one place.
        </p>

        <div className="mt-6">
          <button className="hero-button bg-orange-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-orange-600 transition-all duration-300 ease-in-out">
            Get Started
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="mt-10 flex flex-col md:flex-row items-center bg-white rounded-md p-4 shadow-lg w-full max-w-4xl space-y-4 md:space-y-0 md:space-x-6">
          <input
            type="text"
            placeholder="Enter Keyword"
            className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black opacity-50"
          >
            <option value="" selected disabled hidden> Choose Categories </option>
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
          </select>

          <select
            className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black opacity-50"
          >
            <option value="" selected disabled hidden> Choose Location </option>
            <option>Location 1</option>
            <option>Location 2</option>
            <option>Location 3</option>
          </select>

          <button className="bg-orange-500 text-white py-2 px-4 rounded-md shadow-lg hover:bg-orange-600 transition-all duration-300 ease-in-out">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
