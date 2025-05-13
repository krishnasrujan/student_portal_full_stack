 // src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // or './App.jsx' if you named it that
import './index.css'; // optional styling

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
