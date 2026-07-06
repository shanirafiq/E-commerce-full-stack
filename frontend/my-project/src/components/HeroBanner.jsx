import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
} from "lucide-react";

// Same font loader used on Login / ResetPassword — Fraunces for display,
// Inter for body. Safe to call again; it no-ops if the <link> already exists.
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

// The same gold → pink "signature" line used on the auth pages.
// Reusing it here ties the storefront back to the sign-in flow visually.
function SignatureDraw({ width = 160, height = 52 }) {
  return (
    <svg viewBox="0 0 190 60" width={width} height={height} fill="none">
      <defs>
        <linearGradient id="goldGradHero" x1="0" y1="0" x2="190" y2="0">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <motion.path
        d="M10 42 C 30 8, 45 8, 55 32 C 63 50, 75 18, 90 28 C 105 38, 100 50, 120 36 C 138 24, 150 45, 170 30"
        stroke="url(#goldGradHero)"
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

const features = [
  { icon: Truck, label: "Free shipping over $50" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: RotateCcw, label: "Easy 30-day returns" },
];

export default function HeroBanner({ onShopNow, onBrowseCategories }) {
  useFonts();

  return (
    <section className="relative flex min-h-[92vh] w-full items-center overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-16 sm:px-10 lg:px-16">
      {/* aurora blobs — identical treatment to the auth pages */}
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
        className="absolute bottom-10 left-[45%] h-[300px] w-[300px] rounded-full bg-amber-500 opacity-25 blur-3xl"
        animate={{ x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      {/* floating sparkles, same accent as auth pages */}
      <motion.div
        className="absolute left-[8%] top-[16%] hidden sm:block"
        animate={{ y: [0, -14, 0], rotate: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-6 w-6 text-amber-400/70" />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[6%] hidden sm:block"
        animate={{ y: [0, 14, 0], rotate: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="h-5 w-5 text-pink-400/60" />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        {/* left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-2xl">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            New arrivals, every week
          </span>

          <h1
            className="mt-5 text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Shop the pieces
            <br />
            worth keeping.
          </h1>

          <p className="mt-4 max-w-md text-sm text-white/50 sm:text-base">
            Folio curates goods that outlast trends — sourced from makers we
            trust, delivered to your door.
          </p>

          <SignatureDraw />

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={onShopNow}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop now
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </motion.button>

            <button
              type="button"
              onClick={onBrowseCategories}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-2xl transition-colors duration-150 hover:border-white/20 hover:text-white"
            >
              Browse categories
            </button>
          </div>

          {/* feature strip */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-white/50">
                <Icon className="h-4 w-4 text-white/40" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* right: glass product spotlight card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Editor's pick
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
            </div>

            <div className="mt-5 flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30">
              <ShoppingBag className="h-16 w-16 text-white/70" strokeWidth={1.25} />
            </div>

            <h3
              className="mt-5 text-xl font-semibold text-white"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Woven Tote — Ochre
            </h3>
            <p className="mt-1 text-sm text-white/50">Handloomed cotton, lined interior</p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-white">$68.00</span>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-pink-500/20"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Add to cart
              </button>
            </div>
          </div>

          {/* small floating accent card behind the main one */}
          <div className="absolute -bottom-6 -left-6 -z-10 hidden h-full w-full rounded-3xl border border-white/10 bg-white/[0.04] sm:block" />
        </motion.div>
      </div>
    </section>
  );
}
