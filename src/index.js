// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);