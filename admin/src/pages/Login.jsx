import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@thestitchlane.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F1EC] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-[#E4D2BA] bg-white p-8 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-[2px] text-[#A87943]">
          StitchLane
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#4A250F]">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-[#765236]">
          Sign in to manage products, orders, and store settings.
        </p>

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block text-[#765236]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[#D9BFA0] px-3 py-2.5 outline-none focus:border-[#A87943]"
          />
        </label>
        <label className="mt-4 block text-sm">
          <span className="mb-1.5 block text-[#765236]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-[#D9BFA0] px-3 py-2.5 outline-none focus:border-[#A87943]"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-[#4A250F] py-3 text-sm font-semibold text-[#FAF3E8] disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
        <Link
          to="/forgot-password"
          className="mt-4 block text-center text-sm text-[#A87943]"
        >
          Forgot password?
        </Link>
      </form>
    </div>
  );
}
