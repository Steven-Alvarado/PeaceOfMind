import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../src/pages/landingPage'
import ForTherapists from '../src/pages/forTherapistsPage';
import Login from '../src/pages/loginPage';
import SignUp from '../src/pages/signUpPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/for-therapists" element={<ForTherapists />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  </BrowserRouter>
);