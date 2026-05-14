import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { AdminLoginPage } from "./pages/AdminLoginPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { ProductsPage } from "./pages/ProductsPage.jsx";
import { OrdersPage } from "./pages/OrdersPage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { PaymentsPage } from "./pages/PaymentsPage.jsx";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
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
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
