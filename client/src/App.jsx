import AdminApp from "./apps/AdminApp";
import StorefrontApp from "./apps/StorefrontApp";

export default function App() {
  const isAdminRoute =
    window.location.pathname === "/admin" ||
    window.location.pathname.startsWith("/admin/");

  return isAdminRoute ? <AdminApp /> : <StorefrontApp />;
}
