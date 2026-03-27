import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorProvider } from "./context/ErrorContext";

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
          <Routes>

            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 Client Routes */}
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/new-order" element={<NewOrder />} />
            <Route path="/client/history" element={<OrderHistory />} />
            <Route path="/client/orders/:id" element={<OrderDetails />} />
            <Route path="/client/profile" element={<Profile />} />

            {/* 🧑‍💼 Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/livreurs" element={<AdminLivreurs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* 🚴 Livreur Routes */}
            <Route path="/livreur/dashboard" element={<LivreurDashboard />} />
            <Route path="/livreur/deliveries" element={<MyDeliveries />} />
            <Route path="/livreur/deliveries/:id" element={<DeliveryDetails />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LoadingProvider>
  </ErrorProvider>
);

export default App;