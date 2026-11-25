import { useEffect, useState } from "react";
import PageHeader from "../../components/admin/PageHeader";
import { api } from "../../api/admin/client";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const load = () => {
    api("/api/admin/reviews")
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api(`/api/admin/reviews/${id}`, {
        method: "PUT",
        body: { status },
      });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Approve or reject customer product reviews."
      />
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="rounded-xl border border-[#E4D2BA] bg-white p-6 text-sm text-[#765236]">
            No reviews yet.
          </p>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-xl border border-[#E4D2BA] bg-white p-5 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#4A250F]">
                    {r.product?.name || "Product"} · {r.rating}/5
                  </p>
                  <p className="mt-1 text-[#765236]">{r.authorName || r.user?.name}</p>
                  <p className="mt-3">{r.comment}</p>
                  <p className="mt-2 capitalize text-[#A87943]">{r.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus(r._id, "approved")}
                    className="rounded-md bg-green-700 px-3 py-1.5 text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(r._id, "rejected")}
                    className="rounded-md bg-red-700 px-3 py-1.5 text-white"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
