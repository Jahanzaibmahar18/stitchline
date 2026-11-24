export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-[#E4D2BA] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[1.5px] text-[#A87943]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#4A250F]">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[#765236]">{hint}</p> : null}
    </div>
  );
}
