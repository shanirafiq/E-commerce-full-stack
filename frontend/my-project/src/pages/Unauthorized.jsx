import { Link } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-blue-900 px-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-500/20">
          <ShieldX className="h-10 w-10 text-pink-400" />
        </div>
        <h1
          className="mt-6 text-3xl font-semibold text-white sm:text-4xl"
          style={{ fontFamily: "Fraunces, serif" }}
        >
          Access Denied
        </h1>
        <p className="mt-3 text-sm text-white/50">
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
