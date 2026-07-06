import React, { useState } from "react";
import { motion } from "framer-motion";
import { Key, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Field, Blob, SignatureDraw, useFonts } from "../../components/Common";
import { c, inputBase } from "../../components/constants";

import axiosInstance from "../api/axios"; // adjust path if needed
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  useFonts();

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
const navigate = useNavigate();
const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
    e.preventDefault();
 



  try {
    setLoading(true);
       const token = localStorage.getItem("token");
  

    const res = await axiosInstance.post("/auth/verify-otp", {
      otp,
      email
    },

       {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

);

    if (res.data.success) {
      toast.success(res.data.message);
      navigate("/reset-password");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "OTP verification failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-8 py-10">
      {/* Blobs – same as before */}
      <Blob style={{ width: 420, height: 420, top: -120, left: -100, background: c.iris, opacity: 0.55 }} animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }} duration={16} />
      <Blob style={{ width: 380, height: 380, bottom: -140, right: -100, background: c.pink, opacity: 0.4 }} animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }} duration={18} />
      <Blob style={{ width: 300, height: 300, bottom: 40, left: "40%", background: c.gold2, opacity: 0.25 }} animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }} duration={22} />

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
          Verify code
        </h1>
        <p className="mb-3 text-sm text-white/50">We sent a 6‑digit code to your email.</p>
        <SignatureDraw />

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            <Field label="Email" icon={Mail}>
  <input
    type="email"
    className={inputBase}
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</Field>
          <Field label="Verification code" icon={Key} error={errors.otp}>
            <input
              type="text"
              maxLength="6"
              className={`${inputBase} ${errors.otp ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40" : ""}`}
              style={{ background: "rgba(255,255,255,0.05)", borderColor: errors.otp ? c.pink : c.glassBorder }}
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtp(val);
              
              }}
            />
          </Field>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-amber-300" />
                Verifying...
              </>
            ) : (
              <>
                Verify
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}

            
          </motion.button>

          <p className="text-center text-xs text-white/40">
            Didn't receive the code?{" "}
            <button type="button" className="text-white/70 hover:underline">
              Resend
            </button>
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          <button  className="font-semibold text-white hover:underline">
            Back to sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}