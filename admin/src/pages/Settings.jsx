import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { api } from "../api/client";

const defaults = {
  storeName: "The StitchLane",
  email: "thestitchlane404@gmail.com",
  phone: "03121825417",
  location: "Bahawalpur, Pakistan",
  currency: "PKR",
  deliveryCharge: 250,
  codEnabled: true,
};

export default function Settings() {
  const [form, setForm] = useState(defaults);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api("/api/admin/settings")
      .then((res) => setForm({ ...defaults, ...res.data }))
      .catch(() => setForm(defaults));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api("/api/admin/settings", {
        method: "PUT",
        body: {
          ...form,
          deliveryCharge: Number(form.deliveryCharge),
        },
      });
      setMessage("Settings saved.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Store branding, COD, and shipping defaults."
      />
      {message ? (
        <p className="mb-4 rounded-md bg-[#FAF3E8] px-3 py-2 text-sm">{message}</p>
      ) : null}
      <form
        onSubmit={onSubmit}
        className="grid max-w-xl gap-4 rounded-xl border border-[#E4D2BA] bg-white p-6"
      >
        {[
          ["storeName", "Store name"],
          ["email", "Email"],
          ["phone", "Phone"],
          ["location", "Location"],
          ["currency", "Currency"],
          ["deliveryCharge", "Delivery charge"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1 block text-[#765236]">{label}</span>
            <input
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-md border border-[#D9BFA0] px-3 py-2"
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.codEnabled}
            onChange={(e) => set("codEnabled", e.target.checked)}
          />
          Cash on Delivery enabled
        </label>
        <button
          type="submit"
          className="rounded-md bg-[#4A250F] px-4 py-3 text-sm font-semibold text-[#FAF3E8]"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
