import { Routes, Route } from "react-router-dom";
import StorefrontLayout from "./components/layout/StorefrontLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminCoupons from "./pages/admin/AdminCoupons.jsx";

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute message="Please sign in to view your cart.">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            requireAdmin
            message="Please sign in with an admin account to continue."
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Route>
    </Routes>
  );
}

export default App;
