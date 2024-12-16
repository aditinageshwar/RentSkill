import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState, createContext } from "react";
import './App.css';
import WorkFlow from './component/workflow';
import Login from './component/login'
import Navbar from './component/Navbar';
import HeroSection from './component/HeroSection';
import Footer from './component/Footer';
import Categories from './component/Categories';
import SubcategoryPage from './component/SubcategoryPage';
import AboutUs from './component/About';
import ContactUs from './component/ContactUs';
import BrowseSkill from "./component/BrowseSkill";
import PostSkill from "./component/PostSkill";

export const SkillContext = createContext();

function App() {
  const [providers, setProviders] = useState([]);

  return (
    <SkillContext.Provider value={{ providers, setProviders }}>
    <Router>
      <div>
        <Navbar />
        <div>
        <Routes>
          {/* Home Page with HeroSection and Categories */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <Categories />
                <WorkFlow/>
              </>
            } 
          />

          {/* Subcategory Page */}
          <Route path="/subcategory" element={<SubcategoryPage />} />
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          {/* About Us */}
          <Route path="/aboutUs" element={<AboutUs />} />
          {/* ContactUs */}
          <Route path="/ContactUs" element={<ContactUs/>} />
          {/* Browse Skill */}
          <Route path="/browseSkill" element={<BrowseSkill />} />
          {/* Post Skill */}
          <Route path="/postSkill" element={<PostSkill />} />
        </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </SkillContext.Provider>
  );
}

export default App;
