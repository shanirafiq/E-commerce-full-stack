import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/Context";
import { getImageUrl } from "../utils/imageUrl";

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useContext(AppContext);

  const shipping = cartTotal > 50 || cartTotal === 0 ? 0 : 6;
  const total = cartTotal + shipping;

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-2xl">
                Your bag
              </span>
              <h1
                className="mt-3 text-3xl font-semibold text-white sm:text-4xl"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Shopping Cart
              </h1>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 text-xs font-semibold text-white/60 hover:text-white sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Continue shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-14 text-center backdrop-blur-2xl">
              <ShoppingBag className="h-10 w-10 text-white/25" strokeWidth={1.25} />
              <p className="text-sm text-white/50">Your cart is empty.</p>
              <Link
                to="/products"
                className="mt-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
              >
                Browse products
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
              <div className="flex flex-col gap-4">
                <AnimatePresence>
                  {cart.map((item) => {
                    const imgSrc = getImageUrl(item.image);
                    return (
                      <motion.div
                        key={`${item.productId}-${item.color}-${item.size}`}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur-2xl sm:p-5"
                      >
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30">
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <ShoppingBag className="h-8 w-8 text-white/60" strokeWidth={1.25} />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3
                                className="text-sm font-semibold text-white sm:text-base"
                                style={{ fontFamily: "Fraunces, serif" }}
                              >
                                {item.name}
                              </h3>
                              <p className="mt-0.5 text-[11px] text-white/40">
                                {item.color} Â· {item.size}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId, item.color, item.size)}
                              className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors duration-150 hover:bg-white/10 hover:text-pink-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.productId, item.color, item.size, item.qty - 1)
                                }
                                className="flex h-6 w-6 items-center justify-center text-white/60 hover:text-white"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-4 text-center text-sm font-semibold text-white">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQty(item.productId, item.color, item.size, item.qty + 1)
                                }
                                className="flex h-6 w-6 items-center justify-center text-white/60 hover:text-white"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <span className="text-sm font-semibold text-white">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-2 w-fit text-xs font-semibold text-pink-300 underline-offset-2 hover:underline"
                >
                  Clear cart
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="h-fit rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-2xl"
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Order Summary
                </h2>

                <div className="mt-4 flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span className="text-white">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout">
                  <motion.button
                    type="button"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
                  >
                    Checkout
                  </motion.button>
                </Link>

                <Link
                  to="/products"
                  className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-white/50 hover:text-white sm:hidden"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Continue shopping
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
