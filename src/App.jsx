import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Tracking from './pages/Tracking';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Quote from './pages/Quote';
import FAQ from './pages/FAQ';
import Locations from './pages/Locations';
import Industries from './pages/Industries';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Router>
      <ChatBot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/industries" element={<Industries />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin-dashboard" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
