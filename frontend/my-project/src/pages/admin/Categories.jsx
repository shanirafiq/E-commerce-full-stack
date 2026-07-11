import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, X, Tag, ToggleLeft, ToggleRight } from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/category/admin/all");
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditCat(null);
    setForm({ name: "", description: "" });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditCat(c);
    setForm({ name: c.name || "", description: c.description || "" });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      if (editCat) {
        await axiosInstance.put(`/category/${editCat._id}`, fd);
        toast.success("Category updated");
      } else {
        await axiosInstance.post("/category/create", fd);
        toast.success("Category created");
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c) => {
    try {
      await axiosInstance.put(`/category/${c._id}`, { isActive: !c.isActive });
      toast.success(c.isActive ? "Category deactivated" : "Category activated");
      fetchCategories();
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await axiosInstance.delete(`/category/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>Categories</h1>
          <p className="mt-1 text-sm text-white/50">Organize your product categories.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-white/50">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c._id}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/10">
                    {c.image ? (
                      <img src={getImageUrl(c.image)} alt={c.name} className="h-full w-full object-cover" />
                    ) : (
                      <Tag className="h-5 w-5 text-white/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                    <p className="text-xs text-white/40">{c.description || "No description"}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  c.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-pink-500/20 text-pink-300"
                }`}>
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                <button onClick={() => handleToggleActive(c)} className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/60 hover:bg-white/10">
                  {c.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                  {c.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => openEdit(c)} className="rounded-lg bg-white/5 p-1.5 text-indigo-400 hover:bg-white/10">
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(c._id)} className="rounded-lg bg-white/5 p-1.5 text-pink-400 hover:bg-white/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{editCat ? "Edit Category" : "Add Category"}</h3>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0])}
                  className="w-full text-xs text-white/50"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editCat ? "Update" : "Create"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
