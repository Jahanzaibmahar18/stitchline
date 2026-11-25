import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/admin/AuthContext";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../layouts/admin/AdminLayout";
import Login from "../pages/admin/Login";
import ForgotPassword from "../pages/admin/ForgotPassword";
import ResetPassword from "../pages/admin/ResetPassword";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import ProductForm from "../pages/admin/ProductForm";
import ProductDetails from "../pages/admin/ProductDetails";
import Orders from "../pages/admin/Orders";
import OrderDetail from "../pages/admin/OrderDetail";
import Customers from "../pages/admin/Customers";
import CustomerDetail from "../pages/admin/CustomerDetail";
import Categories from "../pages/admin/Categories";
import Inventory from "../pages/admin/Inventory";
import Reviews from "../pages/admin/Reviews";
import Settings from "../pages/admin/Settings";

export default function App({ basename = "/admin" }) {
  return (
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="products/:id/edit" element={<ProductForm />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="categories" element={<Categories />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
