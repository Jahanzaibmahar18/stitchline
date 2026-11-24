import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setMessage(res.message || "If that email exists, a reset link was sent.");
    } catch (err) {
      setError(err.message || "Request failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F1EC] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-[#E4D2BA] bg-white p-8"
      >
        <h1 className="text-2xl font-semibold text-[#4A250F]">Forgot password</h1>
        <p className="mt-2 text-sm text-[#765236]">
          Enter your admin email to receive a reset token.
        </p>
        {message ? (
          <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mt-6 w-full rounded-md border border-[#D9BFA0] px-3 py-2.5"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[#4A250F] py-3 text-sm font-semibold text-[#FAF3E8]"
        >
          Send reset
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-[#A87943]">
          Back to login
        </Link>
      </form>
    </div>
  );
}
