import React from "react";
import { FaFacebook, FaEnvelope, FaPhoneAlt, FaClock } from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="bg-gray-50 text-gray-500 min-h-screen flex flex-col items-center">
      
      {/* Help Section */}
      <section className="mt-10 text-center">
        <h2 className="text-4xl font-bold mb-6">Let us <span className="text-cyan-400">help</span> you</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {/* Social Media */}
          <div className="p-4 bg-zinc-500 text-white rounded flex flex-col items-center transform transition-transform hover:scale-110">
            <FaFacebook className="text-cyan-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">SOCIAL MEDIA</h3>
            <p className="text-sm mt-2">Follow us on Facebook<br />@SkillHub</p>
          </div>
          {/* Email */}
          <div className="p-4 bg-neutral-400 text-white rounded flex flex-col items-center transform transition-transform  hover:scale-110">
            <FaEnvelope className="text-sky-500 text-2xl mb-2" />
            <h3 className="text-lg font-semibold">EMAIL</h3>
            <p className="text-sm mt-2">Contact@SkillHub.com <br/> Support@SkillHub.com </p>
          </div>
          {/* Phone */}
          <div className="p-4 bg-slate-400 text-white rounded flex flex-col items-center transform transition-transform  hover:scale-110">
            <FaPhoneAlt className="text-sky-700 text-2xl mb-2 items-center"/>
            <h3 className="text-lg font-semibold">PHONE</h3>
            <p className="text-sm mt-2">+91 9076754312<br />+91 8764321876</p>
          </div>
          </div>
      </section>

      {/* Contact Form Section */}
      <section className="mt-10 w-1/2 max-w-4xl px-6 border-2 bg-stone-200 shadow-2xl shadow-gray-500">
        <h2 className="text-3xl font-bold text-center mb-10 mt-8">Get in <span className="text-cyan-400">touch</span></h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="First name"
            className="col-span-1 p-3 rounded bg-white border border-gray-400 text-sm focus:outline-none focus:ring-1"
          />
          <input
            type="text"
            placeholder="Last name"
            className="col-span-1 p-3 rounded bg-white border border-gray-400 text-sm focus:outline-none focus:ring-1"
          />
          <input
            type="email"
            placeholder="Email address"
            className="col-span-1 md:col-span-2 p-3 rounded bg-white border border-gray-400 text-sm focus:outline-none focus:ring-1"
          />
           <input
            type="tel"
            placeholder="Phone number"
            className="col-span-1 md:col-span-2 p-3 rounded bg-white border border-gray-400 text-sm focus:outline-none focus:ring-1"
          />
          <textarea
            placeholder="Write your message"
            className="col-span-1 md:col-span-2 p-3 rounded bg-white border border-gray-400 text-sm focus:outline-none focus:ring-1"
            rows="4"
          ></textarea>

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button type="submit" className="w-36 h-11 mb-6 bg-cyan-400 text-white text-xl font-bold py-3 rounded hover:bg-cyan-500 transition">
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ContactPage;