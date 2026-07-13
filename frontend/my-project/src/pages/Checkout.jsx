import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/Context";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "./api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUrl";

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

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40";

export default function Checkout() {
  useFonts();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, cartTotal, clearCart } = useContext(AppContext);

  const shipping = cartTotal > 50 ? 0 : 6;
  const total = cartTotal + shipping;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        address: (user.address && user.address !== "undefined") ? user.address : "",
        city: (user.city && user.city !== "undefined") ? user.city : "",
        postalCode: (user.postalCode && user.postalCode !== "undefined") ? user.postalCode : "",
        phone: (user.phoneNumber && user.phoneNumber !== "undefined") ? user.phoneNumber : "",
      });
    }
  }, [user]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const validate = () => {
    if (!form.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!form.postalCode.trim()) {
      toast.error("Postal code is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) {
      toast.error("Enter a valid phone number");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          color: item.color,
          size: item.size,
        })),
        shippingAddress: form,
        paymentMethod: "COD",
      };

      const res = await axiosInstance.post("/orders/place-order", orderData);

      if (res.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 backdrop-blur-2xl">
                Checkout
              </span>
              <h1
                className="mt-3 text-3xl font-semibold text-white sm:text-4xl"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Complete your order
              </h1>
            </div>

            <Link
              to="/cart"
              className="hidden items-center gap-2 text-xs font-semibold text-white/60 hover:text-white sm:flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to cart
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-2xl"
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      Street Address
                    </label>
                    <input
                      type="text"
                      className={inputBase}
                      placeholder="House 12, Street 4, Gulberg"
                      value={form.address}
                      onChange={update("address")}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        City
                      </label>
                      <input
                        type="text"
                        className={inputBase}
                        placeholder="Lahore"
                        value={form.city || ''}
                        onChange={update("city")}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        className={inputBase}
                        placeholder="54000"
                        value={form.postalCode}
                        onChange={update("postalCode")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className={inputBase}
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={update("phone")}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-2xl"
              >
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </h2>

                <div className="mt-5 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-indigo-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Cash on Delivery (COD)
                      </p>
                      <p className="mt-1 text-xs text-white/60">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order · $${total.toFixed(2)}`
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-fit rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-2xl"
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                Order Summary
              </h2>

              <div className="mt-4 flex flex-col gap-3">
                {cart.map((item) => {
                  const imgSrc = getImageUrl(item.image);
                  return (
                    <div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      className="flex gap-3 rounded-xl border border-white/5 bg-white/5 p-3"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-pink-500/30">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-white/60">
                            NO IMG
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-white/40">
                            {item.color} · {item.size} · Qty: {item.qty}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-white">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
