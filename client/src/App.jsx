import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import AppContent from './component/AppContent'; 
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


