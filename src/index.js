// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import './styles.css';

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
