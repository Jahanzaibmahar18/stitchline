import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/", label: "Overview", end: true },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/categories", label: "Categories" },
  { to: "/inventory", label: "Inventory" },
  { to: "/reviews", label: "Reviews" },
  { to: "/settings", label: "Settings" },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#1F1A17] lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[#4A250F] text-[#FAF3E8] transition lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/" className="font-semibold tracking-wide">
            StitchLane Admin
          </Link>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-[#A87943] text-white" : "hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E4D2BA] bg-[#FAF3E8]/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            className="rounded-md border border-[#D9BFA0] px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="hidden text-sm text-[#765236] sm:block">
            Store operations · Bahawalpur
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#765236]">{user?.role || "admin"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-[#4A250F] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#FAF3E8]"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
