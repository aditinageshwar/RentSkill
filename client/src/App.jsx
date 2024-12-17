import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, createContext, useEffect } from 'react';
import './App.css';
import WorkFlow from './component/workflow';
import Login from './component/login';
import Navbar from './component/Navbar';
import HeroSection from './component/HeroSection';
import Footer from './component/Footer';
import Categories from './component/Categories';
import SubcategoryPage from './component/SubcategoryPage';
import AboutUs from './component/About';
import ContactUs from './component/ContactUs';
import BrowseSkill from './component/BrowseSkill';
import PostSkill from './component/PostSkill';

export const SkillContext = createContext();

function AppContent() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    if (window.performance.navigation.type === 1) {
      window.location.href = "/"; 
    }
  }, []);

  return (
    <SkillContext.Provider value={{ providers, setProviders }}>
      <div>
        <Navbar />
        <Routes>
          {/* Home Page Route */}
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
          {/* Other Routes */}
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
