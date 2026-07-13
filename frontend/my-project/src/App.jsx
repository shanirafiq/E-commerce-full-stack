import { Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Verify from "./pages/auth/Verify";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

/* Admin Pages */
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/Users";
import AdminCategories from "./pages/admin/Categories";
import AdminReviews from "./pages/admin/Reviews";
import AdminSettings from "./pages/admin/Settings";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
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
  );
}

export default App;
