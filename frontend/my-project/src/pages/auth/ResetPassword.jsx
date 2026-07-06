import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Field, Blob, SignatureDraw, useFonts } from "../../components/Common"; // or ../../components/common
import { c, inputBase } from "../../components/constants";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ResetPassword() {
  useFonts();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
const [form, setForm] = useState({
  email: "",
  password: "",
  confirm: "",
});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axiosInstance.post(
        "/auth/change-password",
        {
           email: form.email,
          password: form.password,
          confirmPassword: form.confirm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      setForm({
        password: "",
        confirm: "",
      });

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-8 py-10">
      {/* Blobs – same */}
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
          Create new password
        </h1>
        <p className="mb-3 text-sm text-white/50">Your new password must be different from previous.</p>
        <SignatureDraw />

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>

          <Field label="Email" icon={Mail} error={errors.email}>
  <input
    type="email"
    className={`${inputBase} ${
      errors.email
        ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40"
        : ""
    }`}
    style={{
      background: "rgba(255,255,255,0.05)",
      borderColor: errors.email ? c.pink : c.glassBorder,
    }}
    placeholder="you@example.com"
    value={form.email}
    onChange={update("email")}
  />
</Field>
          <Field label="New password" icon={Lock} error={errors.password}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${inputBase} pr-11 ${errors.password ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40" : ""}`}
              style={{ background: "rgba(255,255,255,0.05)", borderColor: errors.password ? c.pink : c.glassBorder }}
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 flex items-center text-white/50 transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <Field label="Confirm password" icon={Lock} error={errors.confirm}>
            <input
              type={showConfirm ? "text" : "password"}
              className={`${inputBase} pr-11 ${errors.confirm ? "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40" : ""}`}
              style={{ background: "rgba(255,255,255,0.05)", borderColor: errors.confirm ? c.pink : c.glassBorder }}
              placeholder="••••••••"
              value={form.confirm}
              onChange={update("confirm")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3.5 flex items-center text-white/50 transition-colors hover:text-white"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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
                Resetting...
              </>
            ) : (
              <>
                Reset password
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          <button className="font-semibold text-white hover:underline">
            Back to sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}