import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, Star, TrendingUp, Shield, UserCheck } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get("/analytics/analytics");
        setData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-white/50">Loading analytics...</div>;
  }

  const userStats = data?.userStatistics || [];
  const totalAdmins = userStats.find((s) => s.role === "admin")?.count || 0;
  const totalUsers = userStats.find((s) => s.role === "user")?.count || 0;

  const pieData = userStats.map((s) => ({ name: s.role, value: s.count }));

  const monthlyProducts = (data?.monthlyData?.products || []).slice(-6);
  const monthlyReviews = (data?.monthlyData?.reviews || []).slice(-6);
  const monthlyUsers = (data?.monthlyData?.users || []).slice(-6);

  const categoryData = (data?.productsByCategory || []).slice(0, 5);

  const ratingDist = data?.reviewsOverview?.ratingDistribution || {};
  const ratingData = [5, 4, 3, 2, 1].map((r) => ({ name: `${r} Star`, count: ratingDist[r] || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
          Analytics
        </h1>
        <p className="mt-1 text-sm text-white/50">Detailed insights about your store performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={totalUsers + totalAdmins} color="bg-indigo-500/20" />
        <StatCard icon={Shield} label="Total Admins" value={totalAdmins} color="bg-amber-500/20" />
        <StatCard icon={Package} label="Total Products" value={data?.totalProducts || 0} color="bg-emerald-500/20" />
        <StatCard icon={Star} label="Total Reviews" value={data?.reviewsOverview?.total || 0} color="bg-pink-500/20" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Distribution Pie */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">User Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <XAxis dataKey="name" tick={{ fill: "#ffffff60", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Products */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Products by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyProducts}>
              <XAxis dataKey="month" tick={{ fill: "#ffffff60", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Registrations by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyUsers}>
              <XAxis dataKey="month" tick={{ fill: "#ffffff60", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-white">Products by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={categoryData}>
            <XAxis dataKey="category" tick={{ fill: "#ffffff60", fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: "#ffffff60", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }} />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
