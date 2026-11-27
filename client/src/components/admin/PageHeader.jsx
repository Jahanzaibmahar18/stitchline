import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-[#4A250F] sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-[#765236]">{subtitle}</p>
        ) : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="inline-flex rounded-md bg-[#4A250F] px-4 py-2.5 text-sm font-semibold text-[#FAF3E8] transition hover:bg-[#A87943]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
