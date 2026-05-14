import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { CategoryPage } from "./pages/CategoryPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { OrdersPage } from "./pages/OrdersPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage.jsx";

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category/:category"
            element={
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
