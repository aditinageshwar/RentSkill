import './App.css';
import WorkFlow from './component/workflow';
import Login from './component/login'
import Navbar from './component/Navbar';
import HeroSection from './component/HeroSection';
import Footer from './component/Footer';
import Categories from './component/Categories';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubcategoryPage from './component/SubcategoryPage';

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

        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
