import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "./api/axios";
import { useContext } from "react";
import {AppContext} from '../context/Context'

// Same font loader used across Home / Products / auth pages.
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

// ---- Mock data for fallback ----
const DEFAULT_PRODUCT = {
  id: 1,
  name: "Woven Tote — Ochre",
  category: "Bags",
  price: 68,
  compareAt: 84,
  rating: 5,
  reviewCount: 128,
  sku: "FOL-TOTE-OCR",
  blurb: "Handloomed cotton, lined interior",
  description:
    "Handwoven by a small cooperative using undyed cotton and a single natural pigment bath, this tote is built to carry everything from groceries to gallery openings. The lined interior keeps loose items in check, and the reinforced straps are stitched to sit comfortably on the shoulder all day.",
  highlights: [
    "100% handloomed cotton, naturally dyed",
    "Cotton-canvas lined interior with inner pocket",
    "Reinforced double-stitched straps",
    '14"H x 16"W x 5"D — fits a 13" laptop',
  ],
  colors: [
    { name: "Ochre", swatch: "from-amber-400 to-amber-600" },
    { name: "Clay", swatch: "from-orange-400 to-rose-600" },
    { name: "Ink", swatch: "from-indigo-400 to-indigo-700" },
  ],
  sizes: ["Standard", "Oversized"],
};

const RELATED = [
  { id: 2, name: "Market Basket Bag", price: 54, rating: 4 },
  { id: 3, name: "Canvas Weekender", price: 96, rating: 5 },
  { id: 4, name: "Quilted Crossbody", price: 62, rating: 4 },
  { id: 5, name: "Leather Belt", price: 46, rating: 4 },
];

const features = [
  { icon: Truck, label: "Free shipping over $50" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: RotateCcw, label: "Easy 30-day returns" },
];



function GalleryPanel({ product, activeIndex, setActiveIndex }) {

  console.log('product',product?.productImg)


  const imageUrl = product?.productImg
    ? `http://localhost:5000/${product.productImg.replace(/\\/g, "/")}`
    : "";

  console.log(imageUrl + 'imageUrl');

  const panels = 4;
  return (
    <div>
      <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30 sm:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {product?.productImg ? (
              <img
                src={imageUrl}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
            ) : (
              <ShoppingBag className="h-28 w-28 text-white/70" strokeWidth={1} />
            )}
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setActiveIndex((i) => (i - 1 + panels) % panels)}
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-xl transition-colors duration-150 hover:bg-white/20 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setActiveIndex((i) => (i + 1) % panels)}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-xl transition-colors duration-150 hover:bg-white/20 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <span className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-xl">
          {product?.category || DEFAULT_PRODUCT.category}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {Array.from({ length: panels }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={
              "flex h-20 items-center justify-center rounded-2xl border bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-pink-500/25 transition-colors duration-150 " +
              (activeIndex === i ? "border-white/40" : "border-white/10 hover:border-white/25")
            }
          >
            {product?.productImg ? (
              <img
                src={imageUrl}
                alt={product.productName}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <ShoppingBag className="h-6 w-6 text-white/50" strokeWidth={1.25} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function RelatedCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-2xl transition-colors duration-200 hover:border-white/20"
    >
      <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30 transition-transform duration-300 group-hover:scale-[1.02]">
        <ShoppingBag className="h-10 w-10 text-white/70" strokeWidth={1.25} />
      </div>
      <h4 className="mt-4 text-sm font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
        {product.name}
      </h4>
      <div className="mt-1 flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={"h-2.5 w-2.5 " + (i < product.rating ? "fill-current" : "fill-transparent stroke-white/20")} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">${product.price.toFixed(2)}</span>
        <button
          type="button"
          className="rounded-lg bg-white/10 p-2 text-white/70 transition-colors duration-150 hover:bg-white/20 hover:text-white"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

export default function ProductDetail() {
  useFonts();

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [tab, setTab] = useState("description");
  const [added, setAdded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [color, setColor] = useState("Default");
  const [size, setSize] = useState("Standard");
  const { addToCart } = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/product/detail-product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  // Calculate discount if compareAt exists
  const discountPct = product?.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

function handleAddToCart() {
  if (!product) return;
  addToCart(product, qty, { color, size });
  setAdded(true);
  setTimeout(() => setAdded(false), 1800);
}

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex h-96 items-center justify-center">
              <div className="text-white/60">Loading...</div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  // If no product found
  if (!product) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex h-96 items-center justify-center">
              <div className="text-white/60">Product not found</div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span className="hover:text-white/60">Shop</span>
            <span>/</span>
            <span className="hover:text-white/60">{product.category || DEFAULT_PRODUCT.category}</span>
            <span>/</span>
            <span className="text-white/60">{product.productName}</span>
          </div>

          {/* main layout */}
          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.85fr]">
            {/* gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              <GalleryPanel
                product={product}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </motion.div>

            {/* info panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50 backdrop-blur-2xl">
                    {product.category || DEFAULT_PRODUCT.category}
                  </span>
                  <h1
                    className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    {product.productName}
                  </h1>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setWishlisted((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors duration-150 hover:border-white/20 hover:text-white"
                  >
                    <Heart className={"h-4 w-4 " + (wishlisted ? "fill-pink-400 text-pink-400" : "")} />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors duration-150 hover:border-white/20 hover:text-white"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* rating - using fallback since API doesn't have rating */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={"h-3.5 w-3.5 " + (i < DEFAULT_PRODUCT.rating ? "fill-current" : "fill-transparent stroke-white/20")} />
                  ))}
                </div>
                <span className="text-xs text-white/50">
                  {DEFAULT_PRODUCT.rating.toFixed(1)} · {DEFAULT_PRODUCT.reviewCount} reviews
                </span>
              </div>

              {/* price - using productPrice from API */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-3xl font-semibold text-white">${product.productPrice?.toFixed(2) || product.productPrice}</span>
                {product.compareAt && (
                  <>
                    <span className="text-sm text-white/35 line-through">${product.compareAt.toFixed(2)}</span>
                    <span className="rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-2.5 py-1 text-[10px] font-bold text-white">
                      -{discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* brand */}
              <p className="mt-4 text-sm leading-relaxed text-white/50">{product.brand || "Artisan Collection"}</p>

              {/* color - using dynamic colors or default */}
              <div className="mt-7">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Color — <span className="text-white/60">{color}</span>
                </p>
                <div className="flex gap-2.5">
                  {DEFAULT_PRODUCT.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      className={
                        "h-9 w-9 rounded-full bg-gradient-to-br p-0.5 transition-transform duration-150 " +
                        c.swatch +
                        " " +
                        (color === c.name ? "ring-2 ring-white/70 ring-offset-2 ring-offset-indigo-900" : "hover:scale-105")
                      }
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* size - using dynamic sizes or default */}
              <div className="mt-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">Size</p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_PRODUCT.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={
                        "rounded-xl border px-4 py-2 text-xs font-semibold transition-colors duration-150 " +
                        (size === s
                          ? "border-transparent bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md shadow-pink-500/20"
                          : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* quantity + add to cart */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-6 w-6 items-center justify-center text-white/60 transition-colors duration-150 hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold text-white">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-6 w-6 items-center justify-center text-white/60 transition-colors duration-150 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 sm:flex-initial sm:px-10"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Added to cart
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              <p className="mt-3 text-[11px] text-white/35">SKU: {product._id?.slice(-8) || DEFAULT_PRODUCT.sku}</p>

              {/* feature strip */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-white/50">
                    <Icon className="h-4 w-4 text-white/40" />
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* tabs: description / highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
            className="mt-16 rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-2xl sm:p-8"
          >
            <div className="flex gap-6 border-b border-white/10 pb-4">
              {[
                { id: "description", label: "Description" },
                { id: "highlights", label: "Highlights" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={
                    "relative text-sm font-semibold transition-colors duration-150 " +
                    (tab === t.id ? "text-white" : "text-white/40 hover:text-white/70")
                  }
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="detailTabUnderline"
                      className="absolute -bottom-4 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                {tab === "description" ? (
                  <motion.p
                    key="description"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-2xl text-sm leading-relaxed text-white/55"
                  >
                    {product.description || DEFAULT_PRODUCT.description}
                  </motion.p>
                ) : (
                  <motion.ul
                    key="highlights"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {DEFAULT_PRODUCT.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-white/55">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                        {h}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* related products */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
              You might also like
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {RELATED.map((p, i) => (
                <RelatedCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}