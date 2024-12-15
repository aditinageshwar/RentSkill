import React,{useEffect,useRef} from 'react';
import gsap from 'gsap';
import aboutUs from '../assets/aboutUs.jpg';
import { HiUsers } from "react-icons/hi";
import { FaHeadset, FaRegLightbulb, FaComments } from 'react-icons/fa';
import { FaFacebook, FaSquareInstagram, FaLinkedin } from "react-icons/fa6";

const teamMembers = [
  {
    name: 'Aditi Nageshwar',
    email: 'aditinagesh@gmail.com',
    image: 'https://img.freepik.com/free-photo/brunette-business-woman-with-wavy-long-hair-blue-eyes-stands-holding-notebook-hands_197531-343.jpg?ga=GA1.1.209205123.1699593011&semt=ais_hybrid',
  },
  {
    name: 'Priyanka Kumari',
    email: 'priyankakumari@gmail.com',
    image: 'https://img.freepik.com/free-photo/businesswoman-posing_23-2148142829.jpg?ga=GA1.1.209205123.1699593011&semt=ais_hybrid',
  }
];

const AboutUs = () => {
   const cardsRef = useRef([]);
   useEffect(() => {
    gsap.set([...cardsRef.current], {
      opacity: 0,
      scale: 0.5,
    });

    gsap.to(cardsRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power3.out',
      });
    }, []); 

  return (
    <div>
       <div className='border-gray-600 border-[1.4px]'></div> 
       <div className="relative mb-[-20px]">
        <img
          src={aboutUs}
          alt="About Us"
          className="h-[350px] w-full object-cover"
        />

        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white">
          <div className="text-center px-6 py-12">
            <p className="text-2xl font-semibold mb-4">Welcome to Rent Skill</p>
            <h1 className='text-3xl font-semibold mb-4'>Our Mission</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Rent Skill is a platform where individuals can share their expertise and connect with people looking for their services. 
              We simplify skill-sharing and collaboration for everyone, whether you're seeking guidance or offering advice, 
              Rent Skill helps to share support for each other's growth.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16 px-6 bg-gray-50 text-center mb-[-40px]">
      <h2 className="text-2xl font-semibold mb-2">Why Choose Rent Skill?</h2>
      <p className="text-lg text-gray-600 mb-12">
        Rent Skill is here to make your experience as simple and convenient as possible. Here is why, we are the right choice for you.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* 24X7 Support */}
        <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-md p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <FaHeadset className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">24X7 User Support</h3>
          <p className="text-gray-600">
            Whether it's day or night, our platform help with any questions or support you need.
          </p>
        </div>

        {/* Expert Guidance */}
        <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-md p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <FaRegLightbulb className="text-4xl text-yellow-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Helpful Experts</h3>
          <p className="text-gray-600">
            Get valuable advice and guidance from people who know their stuff.
          </p>
        </div>

        {/* Easy to use */}
        <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-md p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <HiUsers className="text-4xl text-red-800 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy to Use & Safe</h3>
          <p className="text-gray-600">
            Our platform is designed to be simple and intuitive, making it easy for anyone to use safely with minimal effort.
          </p>
        </div>

        {/* Easy Communication */}
        <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-md p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <FaComments className="text-4xl text-teal-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Seamless Communication</h3>
          <p className="text-gray-600">
            Keep in touch with your expert anytime, anywhere, through easy-to-use messaging.
          </p>
        </div>
      </div>
    </section>

      <div className="py-12 bg-gray-50">
        <h2 className="text-2xl font-semibold text-center mb-6">Meet Our Development Team</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              ref={(el) => cardsRef.current[index] = el}
              className="group flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-64 relative"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-36 h-36 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.email}</p>

              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 group-hover:opacity-100 ease-in-out z-10">
                <div className="flex space-x-4">
                  <a href='#' target="_blank" rel="noopener noreferrer">
                   <FaFacebook className="text-4xl text-blue-700 hover:text-blue-800" />
                  </a>
                  <a href='#' target="_blank" rel="noopener noreferrer">
                   <FaSquareInstagram className="text-4xl text-rose-700 hover:text-pink-800"/>
                  </a>
                  <a href='#' target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-4xl text-sky-900 hover:text-blue-800"/>
                  </a>
                </div>
              </div>
              <div className="absolute inset-0 bg-gray-400 bg-opacity-30 group-hover:backdrop-blur-md rounded-lg z-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
