// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentManager from './components/StudentManager';
import DriveManager from './components/DriveManager';
import Reports from './components/Reports';
import Navbar from './components/Navbar';

import { getUserRole } from './utils/auth';

function App() {
  const isLoggedIn = !!getUserRole(); // simulated login check

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentManager />} />
            <Route path="/drives" element={<DriveManager />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
