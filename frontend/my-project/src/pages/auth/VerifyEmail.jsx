import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useFonts } from "../../components/Common";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

export default function VerifyEmail() {
  useFonts();

  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState("");

  console.log('token',token)

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setVerified(false);
      setStatus("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axiosInstance.post(
          "/auth/verify",
          {},
          {
             headers: {
      Authorization: `Bearer ${token}`,
    },
          }
        );
        console.log('res',res)

        if (res.data.success) {
          setVerified(true);
          setStatus(res.data.message);

          toast.success(res.data.message);

          setTimeout(() => {
            navigate("/login");
          }, 2500);
        }
      } catch (error) {
        setVerified(false);

        const message =
          error.response?.data?.message ||
          "Verification link is invalid or expired.";

        setStatus(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-xl shadow-2xl">

        {loading ? (
          <>
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-indigo-400" />

            <h2 className="mt-6 text-2xl font-bold text-white">
              Verifying Email...
            </h2>

            <p className="mt-2 text-white/70">
              Please wait while we verify your email.
            </p>
          </>
        ) : verified ? (
          <>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle2 className="h-14 w-14 text-green-400" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Email Verified 🎉
            </h2>

            <p className="mt-3 text-white/70">
              {status}
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 font-semibold text-white"
            >
              Continue to Login
              <ArrowRight size={18} />
            </motion.button>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20">
              <XCircle className="h-14 w-14 text-red-400" />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Verification Failed
            </h2>

            <p className="mt-3 text-white/70">
              {status}
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/signup")}
              className="mt-8 w-full rounded-xl border border-white/20 py-3 font-semibold text-white hover:bg-white/10"
            >
              Back to Signup
            </motion.button>
          </>
        )}

      </div>
    </div>
  );
}