import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, Star, Activity, TrendingUp, MessageSquare } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/analytics/dashboard");
        setData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-white/50">
        Loading dashboard...
      </div>
    );
  }

  const stats = [
    { icon: Users, label: "Total Users", value: data?.totalUsers || 0, color: "bg-indigo-500/20" },
    { icon: Package, label: "Total Products", value: data?.totalProducts || 0, color: "bg-emerald-500/20" },
    { icon: MessageSquare, label: "Total Reviews", value: data?.totalReviews || 0, color: "bg-amber-500/20" },
    { icon: Activity, label: "Activities", value: data?.recentActivities?.length || 0, color: "bg-pink-500/20" },
  ];

  // Build chart data from recent activities
  const activityData = (data?.recentActivities || []).slice(0, 7).reverse().map((a, i) => ({
    name: a.description?.substring(0, 15) || `Event ${i + 1}`,
    value: 1,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white" style={{ fontFamily: "Fraunces, serif" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/50">Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Recent Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" tick={{ fill: "#ffffff60", fontSize: 10 }} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Activity Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <XAxis dataKey="name" tick={{ fill: "#ffffff60", fontSize: 10 }} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#1e1b4b", border: "1px solid #ffffff20", borderRadius: 12 }}
                labelStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="value" stroke="#ec4899" fill="#ec489930" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
        <h3 className="mb-4 text-sm font-semibold text-white">Recent Activities</h3>
        <div className="space-y-2">
          {(data?.recentActivities || []).length === 0 ? (
            <p className="text-sm text-white/40">No recent activities</p>
          ) : (
            data?.recentActivities?.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white/80">{activity.description}</p>
                  <p className="text-xs text-white/30">
                    {activity.userId?.firstName || "System"} · {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs text-indigo-300">
                  {activity.action}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
