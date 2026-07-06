import { Routes, Route, Link } from "react-router-dom";
import './App.css'
import { Contact, LogIn } from "lucide-react";
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'

import ResetPassword from './pages/auth/ResetPassword'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Verify from "./pages/auth/Verify";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Home from './pages/Home';
import Products from './pages/Products';
import Profile from "./pages/Profile";



function App() {


  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Products />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  )
}

export default App
