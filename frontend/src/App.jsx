import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorProvider } from "./context/ErrorContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";

// Pages Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Pages Client
import ClientDashboard from "./pages/Client/Dashboard";
import NewOrder from "./pages/Client/NewOrder";
import OrderHistory from "./pages/Client/OrderHistory";
import OrderDetails from "./pages/Client/OrderDetails";
import Profile from "./pages/Client/Profile";

// Pages Admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import AdminClients from "./pages/Admin/Clients";
import AdminLivreurs from "./pages/Admin/Livreurs";
import AdminSettings from "./pages/Admin/Settings";
import AdminTestimonials from "./pages/Admin/Testimonials";

// Pages Livreur
import LivreurDashboard from "./pages/Livreur/Dashboard";
import MyDeliveries from "./pages/Livreur/MyDeliveries";
import DeliveryDetails from "./pages/Livreur/DeliveryDetails";

// 🏠 Home page (Landing page)
import Home from "./pages/Public/Home";

const App = () => (
  <ErrorProvider>
    <LoadingProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Routes>

            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 Client Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute roles={["client"]}>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/new-order"
              element={
                <ProtectedRoute roles={["client"]}>
                  <NewOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/history"
              element={
                <ProtectedRoute roles={["client"]}>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/orders/:id"
              element={
                <ProtectedRoute roles={["client"]}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute roles={["client"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 🧑‍💼 Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/clients"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/livreurs"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminLivreurs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />

            {/* 🚴 Livreur Routes */}
            <Route
              path="/livreur/dashboard"
              element={
                <ProtectedRoute roles={["livreur"]}>
                  <LivreurDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/livreur/deliveries"
              element={
                <ProtectedRoute roles={["livreur"]}>
                  <MyDeliveries />
                </ProtectedRoute>
              }
            />
            <Route
              path="/livreur/deliveries/:id"
              element={
                <ProtectedRoute roles={["livreur"]}>
                  <DeliveryDetails />
                </ProtectedRoute>
              }
            />

          </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  </ErrorProvider>
);

export default App;