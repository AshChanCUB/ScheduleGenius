import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/reducers/userSlice'; // Adjust the import path as needed

import LoginPage from './components/loginPage';
import SignupPage from './components/signupPage';
import LandingPage from './components/landingPage';
import HomePage from './components/homePage';
import PreferencePage from './components/preferencePage';
import ForgotPass from './components/resetPassword/forgotPassword';
import VerifyOtp from './components/resetPassword/verifyOtp';
import ResetPass from './components/resetPassword/resetPassword';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(setUser({ user_id: userId }));
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/submit-preferences" element={<PreferencePage />} />
        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/verifyotp" element={<VerifyOtp />} />
        <Route path="/resetpass" element={<ResetPass />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;