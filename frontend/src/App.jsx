import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DisplayBar from './components/DisplayBar';
import CompareDriver from './components/CompareDriver';

export default function App() {
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar onSelectDriver={setSelectedDriver} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />
          {/* Fixed Link */}
          {/* Routes */}
          <div className="flex-1 overflow-y-auto p-4">
            <Routes>
              <Route path="/" element={<DisplayBar driver={selectedDriver} />} />
              <Route path="/comparedriver" element={<CompareDriver />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}