import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
function App() {
  return (
    <Router>
      <div>
        <Navbar />
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
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
