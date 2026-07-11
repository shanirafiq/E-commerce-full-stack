import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Mail, Shield, Key } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axiosInstance.put(`/user/updateduser/${user._id}`, form);
      const updated = res.data.data;
      updateUser(updated);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-white/50">Manage your admin account settings.</p>
      </div>

      {/* Account Info */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <h3 className="mb-5 text-sm font-semibold text-white">Account Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              />
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={saving}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      {/* Role Info */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-white">Role & Permissions</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
            <Shield className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white capitalize">{user?.role}</p>
            <p className="text-xs text-white/40">Full access to all admin features</p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-white">System Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">User ID</span>
            <span className="text-white/70 font-mono text-xs">{user?._id}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="text-white/40">Account Created</span>
            <span className="text-white/70">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/40">Email Verified</span>
            <span className={`text-xs ${user?.isVerified ? "text-emerald-400" : "text-pink-400"}`}>
              {user?.isVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
