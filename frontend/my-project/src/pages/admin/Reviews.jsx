import { useEffect, useState } from "react";
import { Trash2, Star, CheckCircle, XCircle, Search } from "lucide-react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/review/all?page=${page}&limit=10`);
      setReviews(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await axiosInstance.delete(`/review/${id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleApproval = async (review) => {
    try {
      await axiosInstance.put(`/review/${review._id}`, { isApproved: !review.isApproved });
      toast.success(review.isApproved ? "Review unapproved" : "Review approved");
      fetchReviews();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filteredReviews = search
    ? reviews.filter((r) =>
        r.comment?.toLowerCase().includes(search.toLowerCase()) ||
        r.userId?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        r.productId?.productName?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>Reviews</h1>
        <p className="mt-1 text-sm text-white/50">Manage product reviews and approvals.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
        />
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center text-white/50">Loading...</div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {r.userId?.firstName} {r.userId?.lastName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                        />
                      ))}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      r.isApproved ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {r.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/40">
                    on <span className="text-white/60">{r.productId?.productName || "Deleted Product"}</span>
                    {" · "}{new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-white/70">{r.comment}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(r)}
                    className={`rounded-lg p-1.5 transition-colors hover:bg-white/10 ${
                      r.isApproved ? "text-amber-400" : "text-emerald-400"
                    }`}
                    title={r.isApproved ? "Unapprove" : "Approve"}
                  >
                    {r.isApproved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="rounded-lg p-1.5 text-pink-400 transition-colors hover:bg-white/10"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredReviews.length === 0 && (
            <p className="py-8 text-center text-sm text-white/40">No reviews found</p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                page === i + 1
                  ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
