import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit3, Trash2, X, Package, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ productName: "", productPrice: "", description: "", brand: "", category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/product/get-products?page=${page}&limit=8&search=${search}`);
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ productName: "", productPrice: "", description: "", brand: "", category: "" });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      productName: p.productName || "",
      productPrice: p.productPrice || "",
      description: p.description || "",
      brand: p.brand || "",
      category: p.category || "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("productName", form.productName);
      fd.append("productPrice", form.productPrice);
      fd.append("description", form.description);
      fd.append("brand", form.brand);
      fd.append("category", form.category);
      if (imageFile) fd.append("productImg", imageFile);

      if (editProduct) {
        await axiosInstance.put(`/product/update-product/${editProduct._id}`, fd);
        toast.success("Product updated");
      } else {
        await axiosInstance.post("/product/create", fd);
        toast.success("Product created");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/product/del-product/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>Products</h1>
          <p className="mt-1 text-sm text-white/50">Manage your product catalog.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center text-white/50">Loading...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 hidden md:table-cell">Brand</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                      {p.productImg ? (
                        <img src={getImageUrl(p.productImg)} alt={p.productName} className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <Package className="h-4 w-4 text-white/40" />
                      )}
                    </div>
                    <span className="font-medium text-white">{p.productName}</span>
                  </td>
                  <td className="px-4 py-3 text-white/70">${Number(p.productPrice).toFixed(2)}</td>
                  <td className="hidden px-4 py-3 text-white/50 sm:table-cell">{p.category}</td>
                  <td className="hidden px-4 py-3 text-white/50 md:table-cell">{p.brand || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 text-indigo-400 hover:text-indigo-300">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-pink-400 hover:text-pink-300">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="py-8 text-center text-sm text-white/40">No products found</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-white/50">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
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
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{editProduct ? "Edit Product" : "Add Product"}</h3>
                <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.productPrice}
                  onChange={(e) => setForm({ ...form, productPrice: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Brand"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400"
                  />
                </div>
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
                {saving ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
