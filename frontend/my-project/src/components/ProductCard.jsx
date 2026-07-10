import { useContext } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import {AppContext} from '../context/Context'

export function ProductCard({ product, index }) {
  const { addToCart } = useContext(AppContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.04 }}
      className="group relative rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-2xl transition-colors duration-200 hover:border-white/20"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/50">
          {product.category || "Category"}
        </span>
        <div className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current" />
          ))}
        </div>
      </div>

      <Link to={`/product-detail/${product?._id}`}>
        <div className="mt-4 h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30">
          {product?.productImg ? (
            <img
              src={`http://localhost:5000/${product.productImg.replace(/\\/g, "/")}`}
              alt={product.productName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-white/70" />
            </div>
          )}
        </div>

        <h3
          className="mt-4 text-base font-semibold text-white"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          {product.productName || "No Product Name"}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs text-white/45">
          {product.description || "No Description"}
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-white">
          ${product.productPrice || 0}
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-pink-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-pink-500/20 transition-transform duration-150 hover:-translate-y-0.5"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </motion.div>
  );
}