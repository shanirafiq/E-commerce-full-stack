import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Field, Blob, SignatureDraw, useFonts } from "../../components/Common";
import { c, inputBase } from "../../components/constants";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  useFonts();

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setErrors({ email: "Enter a valid email" });
    return;
  }

 

  try {
    setLoading(true);

 const response = await axiosInstance.post(
  "/auth/forget",
  {
    email,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }
);

    toast.success(
      response.data.message || "Password reset link sent to your email."
    );
    navigate('/verify-otp')

  
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-8 py-10">
      {/* Blobs and sparkles – same as login */}
      <Blob style={{ width: 420, height: 420, top: -120, left: -100, background: c.iris, opacity: 0.55 }} animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }} duration={16} />
      <Blob style={{ width: 380, height: 380, bottom: -140, right: -100, background: c.pink, opacity: 0.4 }} animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }} duration={18} />
      <Blob style={{ width: 300, height: 300, bottom: 40, left: "40%", background: c.gold2, opacity: 0.25 }} animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }} duration={22} />

      {/* Sparkles (optional) – omitted for brevity, copy from Login if needed */}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-sm font-bold text-white shadow-lg">F</div>
          <span className="text-lg font-semibold tracking-wide text-white">Folio</span>
        </div>

        <h1 className="mb-1 text-3xl font-semibold leading-tight text-white" style={{ fontFamily: "Fraunces, serif" }}>
          Forgot password?
        </h1>
        <p className="mb-3 text-sm text-white/50">Enter your email to receive a verification code.</p>
        <SignatureDraw />

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <Field label="Email" icon={Mail} error={errors.email}>
            <input
              type="email"
              className={`${inputBase} ${errors.email ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40" : ""}`}
              style={{ background: "rgba(255,255,255,0.05)", borderColor: errors.email ? c.pink : c.glassBorder }}
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
            />
          </Field>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
          >
          {loading ? (
  <>
    <CheckCircle2 className="h-4 w-4 text-amber-300" />
    Sending...
  </>
) : (
  <>
    Send code
    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
  </>
)}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Remember your password?{" "}
          <Link to='/login'>
          
          
       
          <button  className="font-semibold text-white hover:underline">
            Sign in
          </button>
             </Link>
        </p>
      </motion.div>
    </div>
  );
}