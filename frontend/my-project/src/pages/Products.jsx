import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "./api/axios";
import { ProductCard } from "../components/ProductCard";

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

const CATEGORIES = ["All", "Bags", "Home", "Apparel", "Ceramics", "Accessories"];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to high" },
  { value: "price-desc", label: "Price: High to low" },
  { value: "rating-desc", label: "Top rated" },
];

function GlassPill({ active, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={
        "whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-150 " +
        (active
          ? "border-transparent bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md shadow-pink-500/20"
          : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white")
      }
    >
      {children}
    </button>
  );
}

export default function Products() {
  useFonts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("product/get-products", {
        params: {
          search: query,
          page,
          limit: 8,
          category: category === "All" ? "" : category,
          minPrice,
          maxPrice,
          sort,
        },
      });

      if (res.data.success) {
        setProducts(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, category, minPrice, maxPrice, sort, page]);

  const MAX_PRICE =
    products.length > 0
      ? Math.max(...products.map((p) => p.productPrice || 0))
      : 1000;

  const currentPage = Math.min(page, totalPages);

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-2xl">
              Shop the collection
            </span>
            <h1
              className="text-3xl font-semibold text-white sm:text-4xl"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              All products
            </h1>
          </div>

          <div className="sticky top-4 z-20 mt-8 rounded-3xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-white/35 outline-none transition-colors duration-150 focus:border-white/25"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSortOpen((v) => !v);
                    setFiltersOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/70 transition-colors duration-150 hover:border-white/20 hover:text-white sm:w-auto"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  {SORTS.find((s) => s.value === sort)?.label}
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-indigo-950/95 shadow-2xl backdrop-blur-2xl"
                    >
                      {SORTS.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => {
                            setSort(s.value);
                            setSortOpen(false);
                          }}
                          className={
                            "block w-full px-4 py-3 text-left text-xs font-medium transition-colors duration-150 " +
                            (sort === s.value
                              ? "bg-white/10 text-white"
                              : "text-white/60 hover:bg-white/5 hover:text-white")
                          }
                        >
                          {s.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFiltersOpen((v) => !v);
                  setSortOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/70 transition-colors duration-150 hover:border-white/20 hover:text-white"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
            </div>

            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex flex-col gap-5 border-t border-white/10 pt-4">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                        Category
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((c) => (
                          <GlassPill key={c} active={category === c} onClick={() => setCategory(c)}>
                            {c}
                          </GlassPill>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">
                          Max price
                        </p>
                        <p className="text-xs font-semibold text-white/70">${maxPrice || MAX_PRICE}</p>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={MAX_PRICE}
                        step={2}
                        value={maxPrice || MAX_PRICE}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="folio-range w-full"
                      />
                      <div className="mt-1 flex justify-between text-[10px] text-white/30">
                        <span>$0</span>
                        <span>${MAX_PRICE}</span>
                      </div>
                    </div>

                    {(category !== "All" || maxPrice) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCategory("All");
                          setMaxPrice("");
                        }}
                        className="w-fit text-xs font-semibold text-pink-300 underline-offset-2 hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {loading ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <p className="text-sm text-white/50">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <Search className="h-8 w-8 text-white/20" />
              <p className="text-sm text-white/50">Nothing matches those filters yet. Try widening your search.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors duration-150 hover:border-white/20 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-150 " +
                      (n === currentPage
                        ? "bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-md shadow-pink-500/20"
                        : "border border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white")
                    }
                  >
                    {n}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors duration-150 hover:border-white/20 hover:text-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <style>{`
        .folio-range {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.12);
        }
        .folio-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 9999px;
          background: linear-gradient(90deg, #FBBF24, #EC4899);
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
        }
        .folio-range::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border: none;
          border-radius: 9999px;
          background: linear-gradient(90deg, #FBBF24, #EC4899);
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
        }
      `}</style>
      </section>
      <Footer />
    </>
  );
}
