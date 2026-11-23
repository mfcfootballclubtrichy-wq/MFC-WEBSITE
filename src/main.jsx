/**
 * main.jsx — Application entry point.
 * Imports i18n BEFORE the app so translations are ready on first render.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './i18n.js';
import './index.css';
import App from './App.jsx';
import { initWebSecurity } from './utils/security.js';

// Initialize global image protection and client-side web application security
initWebSecurity();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);