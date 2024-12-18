import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Footer from './Footer';
import Categories from './Categories';
import WorkFlow from './workflow';
import SubcategoryPage from './SubcategoryPage';
import Login from './login';
import AboutUs from './About';
import ContactUs from './ContactUs';
import BrowseSkill from './BrowseSkill';
import PostSkill from './PostSkill';
import BookingHistory from './BookingHistory';
import NotificationPage from './NotificationPage';

export const SkillContext = createContext();

function AppContent() {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const [navigationEntry] = performance.getEntriesByType("navigation");
    if (navigationEntry?.type === "reload") {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  

  return (
    <SkillContext.Provider value={{ providers, setProviders }}>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Categories />
                <WorkFlow />
              </>
            }
          />
          <Route path="/bookingTable" element={<BookingHistory/>} />
          <Route path="/notification" element={<NotificationPage/>} />
          <Route path="/subcategory" element={<SubcategoryPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/browseSkill" element={<BrowseSkill />} />
          <Route path="/postSkill" element={<PostSkill />} />
        </Routes>
        <Footer />
      </div>
    </SkillContext.Provider>
  );
}

export default AppContent;


