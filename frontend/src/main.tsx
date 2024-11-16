import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../src/pages/landingPage'
import ForTherapists from '../src/pages/forTherapistsPage';
import Login from '../src/pages/loginPage';
import SignUp from '../src/pages/signUpPage';
import SignUpSurveyPage from './pages/signUpSurveyPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/for-therapists" element={<ForTherapists />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-up-survey" element={<SignUpSurveyPage />} />
    </Routes>
  </BrowserRouter>
);
