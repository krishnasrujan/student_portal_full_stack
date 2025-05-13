// components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (login(username, password)) {
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 border shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input className="w-full border mb-2 p-2" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" className="w-full border mb-2 p-2" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </div>
  );
};

export default Login;
