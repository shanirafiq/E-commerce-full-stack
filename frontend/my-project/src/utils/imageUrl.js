export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base =
    import.meta.env.VITE_BASE_URL?.replace("/api", "") || "http://localhost:5000";
  const clean = path.replace(/\\/g, "/").replace(/^\//, "");
  return `${base}/${clean}`;
};
