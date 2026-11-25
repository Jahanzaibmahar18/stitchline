import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../api/admin/client";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = params.get("token") || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api("/api/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
      setMessage(res.message || "Password updated. You can sign in.");
    } catch (err) {
      setError(err.message || "Reset failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F1EC] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-[#E4D2BA] bg-white p-8"
      >
        <h1 className="text-2xl font-semibold text-[#4A250F]">Reset password</h1>
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
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="mt-6 w-full rounded-md border border-[#D9BFA0] px-3 py-2.5"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[#4A250F] py-3 text-sm font-semibold text-[#FAF3E8]"
        >
          Update password
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-[#A87943]">
          Back to login
        </Link>
      </form>
    </div>
  );
}
