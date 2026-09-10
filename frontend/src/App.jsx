import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import StorefrontLayout from "./components/layout/StorefrontLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Admin pages are code-split into their own chunk — recharts (used only on the dashboard) and
// the rest of the admin panel would otherwise bloat every storefront visitor's initial bundle.
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.jsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.jsx"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons.jsx"));
const AdminGallery = lazy(() => import("./pages/admin/AdminGallery.jsx"));

const AdminLoading = () => <div className="flex justify-center py-20 text-ink-400">Loading admin panel...</div>;

function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute message="Please sign in to view your cart.">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute message="Please sign in to check out.">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation/:id"
          element={
            <ProtectedRoute message="Please sign in to view your order.">
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute message="Please sign in to view your orders.">
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute message="Please sign in to view your order.">
              <OrderDetailPage />
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
            <Suspense fallback={<AdminLoading />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminProducts />
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminOrders />
            </Suspense>
          }
        />
        <Route
          path="categories"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminCategories />
            </Suspense>
          }
        />
        <Route
          path="coupons"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminCoupons />
            </Suspense>
          }
        />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminGallery />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
