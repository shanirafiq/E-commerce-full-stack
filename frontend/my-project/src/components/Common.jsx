// common.js
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { c }  from  '../components/constants'

export function useFonts() {
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

export function Blob({
  style = {},
  animate = {},
  duration = 10,
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        filter: "blur(80px)",
        ...style,
      }}
      animate={animate}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    />
  );
}

export function SignatureDraw() {
  return (
    <svg
      viewBox="0 0 190 60"
      width="160"
      height="52"
      fill="none"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="190" y2="0">
          <stop offset="0%" stopColor={c.gold1} />
          <stop offset="100%" stopColor={c.pink} />
        </linearGradient>
      </defs>

      <motion.path
        d="M10 42 C30 8, 45 8, 55 32 C63 50, 75 18, 90 28 C105 38, 100 50, 120 36 C138 24, 150 45, 170 30"
        stroke="url(#goldGrad)"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{
          pathLength: 0,
          opacity: 0,
        }}
        animate={{
          pathLength: 1,
          opacity: 1,
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />
    </svg>
  );
}

export function Field({
  label,
  icon: Icon,
  error,
  children,
}) {
  return (
    <div>
      <label
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: c.textDim }}
      >
        {label}
      </label>

      <div className="relative flex items-center">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 h-4 w-4"
            style={{ color: c.textDim }}
          />
        )}

        {children}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="mt-1 text-xs"
            style={{ color: c.pink }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}