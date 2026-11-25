import { useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../context/admin/AuthContext";

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

function crumbLabel(segment) {
  if (!segment) return "Overview";
  if (segment === "new") return "Add";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return [{ label: "Overview", to: "/" }];
    const crumbs = [{ label: "Overview", to: "/" }];
    let path = "";
    parts.forEach((part) => {
      path += `/${part}`;
      crumbs.push({ label: crumbLabel(part), to: path });
    });
    return crumbs;
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F1EC] text-[#1F1A17] lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 transform bg-[#4A250F] text-[#FAF3E8] transition-all lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link to="/" className="truncate font-semibold tracking-wide">
            {collapsed ? "SL" : "StitchLane Admin"}
          </Link>
          <button
            type="button"
            className="hidden rounded p-1 text-sm hover:bg-white/10 lg:inline"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Collapse sidebar"
          >
            {collapsed ? "»" : "«"}
          </button>
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
              title={item.label}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm transition ${
                  isActive ? "bg-[#A87943] text-white" : "hover:bg-white/10"
                } ${collapsed ? "text-center" : ""}`
              }
            >
              {collapsed ? item.label.slice(0, 1) : item.label}
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
        <header className="sticky top-0 z-20 border-b border-[#E4D2BA] bg-[#FAF3E8]/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="rounded-md border border-[#D9BFA0] px-3 py-1.5 text-sm lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>

            <form onSubmit={onSearch} className="hidden flex-1 md:block md:max-w-sm">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-sm outline-none focus:border-[#A87943]"
              />
            </form>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-md border border-[#D9BFA0] bg-white px-3 py-2 text-xs font-medium text-[#765236]"
                aria-label="Notifications"
              >
                Alerts
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#A87943]" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-md border border-[#D9BFA0] bg-white px-3 py-1.5 text-left text-sm"
                >
                  <span>
                    <span className="block font-medium">{user?.name || "Admin"}</span>
                    <span className="block text-xs capitalize text-[#765236]">
                      {user?.role || "admin"}
                    </span>
                  </span>
                </button>
                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-44 rounded-md border border-[#E4D2BA] bg-white py-1 shadow-lg">
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-sm hover:bg-[#FAF3E8]"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-[#FAF3E8]"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-[#EDE0CF] px-4 py-2 text-xs text-[#765236] sm:px-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.to} className="flex items-center gap-2">
                {index > 0 ? <span>/</span> : null}
                <Link to={crumb.to} className="hover:text-[#A87943]">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
