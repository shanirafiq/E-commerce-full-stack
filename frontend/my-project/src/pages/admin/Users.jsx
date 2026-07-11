import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Edit3, Trash2, Ban, CheckCircle, Shield, X, User, Eye, ShieldOff,
} from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingRole, setPendingRole] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/get-all-users");
      let data = res.data.data || [];
      if (search) {
        const s = search.toLowerCase();
        data = data.filter(
          (u) =>
            u.firstName?.toLowerCase().includes(s) ||
            u.lastName?.toLowerCase().includes(s) ||
            u.email?.toLowerCase().includes(s)
        );
      }
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleToggleBlock = async (id) => {
    try {
      const res = await axiosInstance.patch(`/user/toggle-block/${id}`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axiosInstance.delete(`/user/delete-user/${id}`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const openRoleModal = (user, role) => {
    setSelectedUser(user);
    setPendingRole(role);
    setShowRoleModal(true);
  };

  const confirmRoleChange = async () => {
    setProcessing(true);
    try {
      const res = await axiosInstance.patch(`/user/change-role/${selectedUser._id}`, { role: pendingRole });
      toast.success(res.data.message);
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Role change failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>Users</h1>
        <p className="mt-1 text-sm text-white/50">Manage user accounts and permissions.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-white/50">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 hidden md:table-cell">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-pink-500">
                      {u.avatar ? (
                        <img src={getImageUrl(u.avatar)} alt={u.firstName} className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-white">{u.firstName} {u.lastName}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-white/50 sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-indigo-500/20 text-indigo-300"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.isBlocked
                        ? "bg-pink-500/20 text-pink-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-white/40 lg:table-cell">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Block/Unblock */}
                      <button
                        onClick={() => handleToggleBlock(u._id)}
                        title={u.isBlocked ? "Unblock" : "Block"}
                        className={`rounded-lg p-1.5 transition-colors hover:bg-white/10 ${
                          u.isBlocked ? "text-emerald-400" : "text-pink-400"
                        }`}
                      >
                        {u.isBlocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      {/* Make Admin / Remove Admin */}
                      {u.role === "user" ? (
                        <button
                          onClick={() => openRoleModal(u, "admin")}
                          title="Make Admin"
                          className="rounded-lg p-1.5 text-amber-400 transition-colors hover:bg-white/10"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => openRoleModal(u, "user")}
                          title="Remove Admin"
                          className="rounded-lg p-1.5 text-amber-400/60 transition-colors hover:bg-white/10"
                        >
                          <ShieldOff className="h-4 w-4" />
                        </button>
                      )}
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(u._id)}
                        title="Delete"
                        className="rounded-lg p-1.5 text-pink-400 transition-colors hover:bg-white/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-8 text-center text-sm text-white/40">No users found</p>
          )}
        </div>
      )}

      {/* Role Change Confirmation Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowRoleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 p-6 shadow-2xl"
            >
              <h3 className="text-lg font-semibold text-white">Confirm Role Change</h3>
              <p className="mt-2 text-sm text-white/60">
                Change <strong className="text-white">{selectedUser?.firstName} {selectedUser?.lastName}</strong>'s
                role to <strong className="text-amber-300">{pendingRole}</strong>?
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRoleChange}
                  disabled={processing}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {processing ? "Processing..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
