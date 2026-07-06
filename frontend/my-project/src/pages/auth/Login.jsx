import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Loads display + body fonts. (Font-family is the one thing Tailwind core
// utilities can't express without editing tailwind.config.js, so it's the
// only inline style left in this file.)
function useFonts() {
  useEffect(() => {
    const id = "auth-fonts-vivid";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function SignatureDraw() {
  return (
    <svg viewBox="0 0 190 60" width="160" height="52" fill="none">
      <defs>
        <linearGradient id="goldGradLogin" x1="0" y1="0" x2="190" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <motion.path
        d="M10 42 C 30 8, 45 8, 55 32 C 63 50, 75 18, 90 28 C 105 38, 100 50, 120 36 C 138 24, 150 45, 170 30"
        stroke="url(#goldGradLogin)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 h-4 w-4 text-white/50" />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 text-xs text-pink-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40";
const inputError = "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40";

// Pass a navigation handler as a prop (e.g. onSwitchToSignup) so this
// drops cleanly into react-router, Next.js, or a simple state-based router.
export default function Login({ onSwitchToSignup }) {
  useFonts();

  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

const [loading, setLoading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    setLoading(true);

    const res = await axiosInstance.post("/auth/login", {
      email: form.email,
      password: form.password,
    });

    if (res.data.success) {
      toast.success(res.data.message);
      console.log(res.data.data.token,'ressposne')

      // Save JWT token
      localStorage.setItem("token", res.data.data.token);

      // Save user if returned
      localStorage.setItem("user", JSON.stringify(res.data.data));

      navigate("/");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-8 py-10">
      {/* animated aurora blobs */}
      <motion.div
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo-500 opacity-50 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-36 -right-24 h-[380px] w-[380px] rounded-full bg-pink-500 opacity-40 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-[40%] h-[300px] w-[300px] rounded-full bg-amber-500 opacity-25 blur-3xl"
        animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* floating sparkles */}
      <motion.div
        className="absolute left-[12%] top-[18%] hidden sm:block"
        animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-6 w-6 text-amber-400/70" />
      </motion.div>
      <motion.div
        className="absolute bottom-[16%] right-[14%] hidden sm:block"
        animate={{ y: [0, 14, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="h-5 w-5 text-pink-400/60" />
      </motion.div>

      {/* glass card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.07]  p-16 shadow-2xl backdrop-blur-2xl sm:p-10"
      >
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-sm font-bold text-white shadow-lg">
            F
          </div>
          <span className="text-lg font-semibold tracking-wide text-white">Folio</span>
        </div>

        <h1
          className="mb-1 text-3xl font-semibold leading-tight text-white"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Welcome back
        </h1>
        <p className="mb-3 text-sm text-white/50">Sign in to pick up right where you left off.</p>
        <SignatureDraw />

        <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
          <Field label="Email" icon={Mail} error={errors.email}>
            <input
              type="email"
              className={`${inputBase} ${errors.email ? inputError : ""} p-4` }
              placeholder="you@studio.com"
              value={form.email}
              onChange={update("email")}
            />
          </Field>

          <Field label="Password" icon={Lock} error={errors.password}>
            <input
              type={showPassword ? "text" : "password"}
              className={`${inputBase} pr-11 ${errors.password ? inputError : ""}`}
              placeholder="••••••••"
              value={form.password}
              onChange={update("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3.5 flex items-center text-white/50 transition-colors duration-150 hover:text-white"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-white/50">
              <input type="checkbox" className="h-3.5 w-3.5 rounded" />
              Remember me
            </label>
             <Link to={'/forget'}>
             
       
            <button type="button" className="font-semibold text-white/80 hover:text-white hover:underline">
              Forgot password?
            </button>
                  </Link>
          </div>

          <motion.button
            type="submit"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
          >
            {submitted ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-amber-300" />
                Signed in
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link to={'/signup'}>
             <button  className="font-semibold cursor-pointer  text-white hover:underline">
            Sign up
          </button>
          
          </Link>
       
        </p>
      </motion.div>
    </div>
  );
}
