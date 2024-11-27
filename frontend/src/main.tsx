// src/main.ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './assets/styles/index.css'; // Global styles (optional)
import { AuthProvider } from './context/AuthContext';
import { MessagingProvider } from './context/MessagingContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MessagingProvider>
          <App />
        </MessagingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
