// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4 flex gap-4">
    <Link to="/">Dashboard</Link>
    <Link to="/students">Students</Link>
    <Link to="/drives">Drives</Link>
    <Link to="/reports">Reports</Link>
    <button onClick={logout}>Logout</button>
  </nav>
);

export default Navbar;
