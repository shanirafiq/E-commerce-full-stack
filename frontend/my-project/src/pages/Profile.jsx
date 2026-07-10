import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Hash,
  Camera,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from "lucide-react";
import axiosInstance from "../pages/api/axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

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
  "w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all duration-150 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40";
const inputError = "border-pink-500 focus:border-pink-500 focus:ring-pink-500/40";

function Field({ label, icon: Icon, error, children, className = "" }) {
  return (
    <div className={className}>
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

const statusStyles = {
  delivered: { icon: CheckCircle2, className: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20" },
  shipped: { icon: Truck, className: "text-indigo-300 bg-indigo-400/10 border-indigo-400/20" },
  pending: { icon: Clock, className: "text-amber-300 bg-amber-400/10 border-amber-400/20" },
  cancelled: { icon: XCircle, className: "text-pink-300 bg-pink-400/10 border-pink-400/20" },
};

function StatusBadge({ status = "pending" }) {
  const s = statusStyles[status] || statusStyles.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${s.className}`}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

export default function ProfilePage() {
  useFonts();

  const [tab, setTab] = useState("profile"); // "profile" | "orders"

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipcode: "",
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const { id } = useParams();

  const token = localStorage.getItem("token");

  // load existing profile
useEffect(() => {
  const getUser = async () => {
    try {
      const res = await axiosInstance.get(`/user/get-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data.users;
      console.log('user',user)

      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
      });

      setAvatarPreview(user.avatar || "");
    } catch (err) {
      console.log(err);
    }
  };

  getUser();
}, [id]);

  // load orders only when that tab is opened
  useEffect(() => {
    if (tab !== "orders") return;
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await axiosInstance.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data?.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load orders");
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, [tab, token]);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (!form.address.trim()) next.address = "Required";
    if (!/^[0-9A-Za-z\s-]{3,10}$/.test(form.zipcode)) next.zipcode = "Enter a valid zip code";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const handleUpdate = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("firstName", form.firstName);
  formData.append("lastName", form.lastName);
  formData.append("email", form.email);
  formData.append("phoneNumber", form.phoneNumber);
  formData.append("address", form.address);
  formData.append("city", form.city);
  formData.append("postalCode", form.postalCode);

  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  try {
    const res = await axiosInstance.put(
      `/user/updateduser/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  return (
    <>
        <Navbar/>
         <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6 py-14 sm:px-10 lg:px-16">
      {/* aurora blobs — same treatment as the rest of the app */}
      <motion.div
        className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-indigo-500 opacity-40 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-36 -right-24 h-[380px] w-[380px] rounded-full bg-pink-500 opacity-30 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-3xl">
        <h1
          className="text-3xl font-semibold text-white sm:text-4xl"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Your account
        </h1>
        <p className="mt-1 text-sm text-white/50">Manage your details and track your orders.</p>

        {/* tab switcher */}
        <div className="mt-7 inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "orders", label: "Orders", icon: Package },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
                tab === key ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab === key && (
                <motion.span
                  layoutId="profile-tab-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
            >
              {/* avatar */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-amber-400 to-pink-500">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-white/90" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 backdrop-blur-md transition-colors duration-150 hover:bg-white/20 hover:text-white"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {form.firstName || "Your"} {form.lastName || "profile"}
                  </p>
                  <p className="text-xs text-white/50">JPG or PNG, up to 5MB</p>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="mt-8 space-y-4" noValidate>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="First name" icon={User} error={errors.firstName}>
                    <input
                      type="text"
                      className={`${inputBase} ${errors.firstName ? inputError : ""}`}
                      placeholder="Jordan"
                      value={form.firstName}
                      onChange={update("firstName")}
                    />
                  </Field>

                  <Field label="Last name" icon={User} error={errors.lastName}>
                    <input
                      type="text"
                      className={`${inputBase} ${errors.lastName ? inputError : ""}`}
                      placeholder="Rivera"
                      value={form.lastName}
                      onChange={update("lastName")}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email" icon={Mail} error={errors.email}>
                    <input
                      type="email"
                      className={`${inputBase} ${errors.email ? inputError : ""}`}
                      placeholder="you@studio.com"
                      value={form.email}
                      onChange={update("email")}
                    />
                  </Field>

                  <Field label="Phone number" icon={Phone} error={errors.phone}>
                    <input
                      type="tel"
                      className={`${inputBase} ${errors.phone ? inputError : ""}`}
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={update("phone")}
                    />
                  </Field>
                </div>

                <Field label="Address" icon={MapPin} error={errors.address}>
                  <input
                    type="text"
                    className={`${inputBase} ${errors.address ? inputError : ""}`}
                    placeholder="House 12, Street 4, Gulberg"
                    value={form.address}
                    onChange={update("address")}
                  />
                </Field>

                <Field
                  label="Zip code"
                  icon={Hash}
                  error={errors.zipcode}
                  className="max-w-[220px]"
                >
                  <input
                    type="text"
                    className={`${inputBase} ${errors.zipcode ? inputError : ""}`}
                    placeholder="54000"
                    value={form.zipcode}
                    onChange={update("zipcode")}
                  />
                </Field>

                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 disabled:opacity-60 sm:w-auto sm:px-8"
                >
                  {saving ? "Updating..." : "Update profile"}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-6 space-y-4"
            >
              {loadingOrders ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-10 text-center text-sm text-white/50 backdrop-blur-2xl">
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.07] p-12 text-center backdrop-blur-2xl">
                  <Package className="h-8 w-8 text-white/40" />
                  <p className="text-sm text-white/50">No orders yet — once you place one, it'll show up here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id || order.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-2xl"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Order #{order.orderId || order._id?.slice(-6) || order.id}
                        </p>
                        <p className="text-xs text-white/50">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                          {" · "}
                          {order.items?.length || 0} item{(order.items?.length || 0) === 1 ? "" : "s"}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-xs text-white/50">Total</span>
                      <span className="text-sm font-semibold text-white">
                        ${Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>

   
  );
}
