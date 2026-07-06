import React from "react";
import { motion } from "framer-motion";
import {

  Mail,
  ArrowRight,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

// Same gold → pink signature line used on Login / ResetPassword / HeroBanner,
// kept small here so it reads as a recurring mark rather than a repeat.
function SignatureDraw() {
  return (
    <svg viewBox="0 0 190 60" width={120} height={38} fill="none">
      <defs>
        <linearGradient id="goldGradFooter" x1="0" y1="0" x2="190" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <path
        d="M10 42 C 30 8, 45 8, 55 32 C 63 50, 75 18, 90 28 C 105 38, 100 50, 120 36 C 138 24, 150 45, 170 30"
        stroke="url(#goldGradFooter)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const shopLinks = [
  { label: "New arrivals", to: "/" },
  { label: "Best sellers", to: "/" },
  { label: "Categories", to: "/" },
  { label: "Gift cards", to: "/" },
];

const companyLinks = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Careers", to: "/" },
];

const supportLinks = [
  { label: "FAQs", to: "/" },
  { label: "Shipping", to: "/" },
  { label: "Returns", to: "/" },
  { label: "Track order", to: "/" },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 pt-16 pb-8 sm:px-10 lg:px-16">
      {/* faint aurora, quieter than the hero so it reads as a base, not a repeat */}
      <motion.div
        className="absolute -top-24 left-[10%] h-[300px] w-[300px] rounded-full bg-indigo-500 opacity-20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 right-[8%] h-[260px] w-[260px] rounded-full bg-pink-500 opacity-15 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 24, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 text-sm font-bold text-white shadow-lg">
                F
              </div>
              <span className="text-lg font-semibold tracking-wide text-white">Folio</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Goods worth keeping, sourced from makers we trust.
            </p>
            <SignatureDraw />
            <div className="mt-4 flex items-center gap-3">
              {[FaInstagram, FaTwitter, FaFacebookF ].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors duration-150 hover:border-white/20 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* shop */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/60 transition-colors duration-150 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* company + support */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/60 transition-colors duration-150 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="mb-4 mt-6 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/60 transition-colors duration-150 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Stay in the loop
            </h4>
            <p className="mb-4 text-sm text-white/50">
              One email a week. New drops, restocks, nothing else.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative flex items-center"
            >
              <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-white/50" />
              <input
                type="email"
                placeholder="you@studio.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-11 text-sm text-white placeholder-white/30 outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Folio. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors duration-150 hover:text-white/70">Privacy</a>
            <a href="#" className="transition-colors duration-150 hover:text-white/70">Terms</a>
            <div className="flex items-center gap-2 text-white/30">
              <CreditCard className="h-4 w-4" />
              <Wallet className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
