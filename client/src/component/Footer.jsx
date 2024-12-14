import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa"; // Importing icons from react-icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Support Section */}
        <div className="flex flex-col ml-20">
          <h2 className="text-3xl font-semibold mb-4">Support</h2>
          <ul className="space-y-2">
            <li><a href="/contact-us" className="hover:text-gray-400">Contact Us</a></li>
            <li><a href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</a></li>
            <li><a href="/terms-conditions" className="hover:text-gray-400">Terms & Conditions</a></li>
            <li><a href="/faq" className="hover:text-gray-400">FAQ</a></li>
            <li><a href="/cookie-policy" className="hover:text-gray-400">Cookie Policy</a></li>
          </ul>
        </div>

        

          {/* Shop Section */}
          <div className="flex flex-col ml-20">
          <h2 className="text-3xl font-semibold mb-4">Shop</h2>
          <ul className="space-y-2">
            <li><a href="/categories" className="hover:text-gray-400">Categories</a></li>
            <li><a href="/latest-posts" className="hover:text-gray-400">Latest Posts</a></li>
            <li><a href="/popular-posts" className="hover:text-gray-400">Popular Posts</a></li>
            <li><a href="/user-list" className="hover:text-gray-400">User List</a></li>
          </ul>
        </div>

        {/* Company Section */}
        <div className="flex flex-col ml-20">
          <h2 className="text-3xl font-semibold mb-4">Company</h2>
          <ul className="space-y-2">
            <li><a href="/about-us" className="hover:text-gray-400">About Us</a></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="flex flex-col ml-12">
          <h2 className="text-3xl font-semibold mb-4">Follow Us</h2>
          <div className="flex space-x-4">
            <a href="https://facebook.com" className="text-gray-400 hover:text-blue-600">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400">
              <FaTwitter className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-700">
              <FaLinkedin className="h-6 w-6" />
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-pink-500">
              <FaInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>

      
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        <p>&copy; 2024 SKILLHUB.com All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
