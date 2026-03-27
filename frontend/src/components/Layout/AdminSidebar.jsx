import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "bi-graph-up" },
    { path: "/admin/orders", label: "Commandes", icon: "bi-box-seam" },
    { path: "/admin/clients", label: "Clients", icon: "bi-people" },
    { path: "/admin/livreurs", label: "Livreurs", icon: "bi-truck" },
    { path: "/admin/settings", label: "Paramètres", icon: "bi-gear" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className="d-flex flex-column"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: isCollapsed ? "80px" : "280px",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          color: "white",
          zIndex: 1045,
          transition: "width 0.3s ease",
          overflowY: "auto",
          paddingTop: "2rem",
        }}
      >
        {/* Logo/Brand */}
        <div
          className="px-3 mb-4 d-flex align-items-center justify-content-between"
          style={{
            color: "white",
            fontSize: isCollapsed ? "0.9rem" : "1.5rem",
            fontWeight: 700,
            transition: "all 0.3s ease",
          }}
        >
          {!isCollapsed && (
            <span>
              <i
                className="bi bi-truck me-2"
                style={{ color: "#0ea5e9", fontSize: "1.8rem" }}
              ></i>
              Delivery
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: "transparent",
              border: "none",
              color: "#0ea5e9",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            <i className={`bi bi-${isCollapsed ? "chevron-right" : "chevron-left"}`}></i>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="d-flex align-items-center"
              style={{
                padding: "1rem 1.5rem",
                color: isActive(item.path) ? "#0ea5e9" : "#cbd5e1",
                textDecoration: "none",
                transition: "all 0.3s ease",
                borderLeft: isActive(item.path) ? "4px solid #0ea5e9" : "4px solid transparent",
                background: isActive(item.path) ? "rgba(14, 165, 233, 0.1)" : "transparent",
                fontSize: isCollapsed ? "0.9rem" : "1rem",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "rgba(14, 165, 233, 0.05)";
                  e.currentTarget.style.color = "#e2e8f0";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#cbd5e1";
                }
              }}
            >
              <i
                className={`bi ${item.icon}`}
                style={{
                  fontSize: "1.3rem",
                  minWidth: "30px",
                }}
              ></i>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <button
            onClick={handleLogout}
            className="w-100 d-flex align-items-center justify-content-center"
            style={{
              padding: "0.75rem",
              background: "transparent",
              color: "#ec4899",
              border: "1px solid rgba(236, 72, 153, 0.3)",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: isCollapsed ? "0.9rem" : "1rem",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(236, 72, 153, 0.1)";
              e.currentTarget.style.borderColor = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.3)";
            }}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            {!isCollapsed && "Déconnexion"}
          </button>
        </div>
      </div>

      {/* Spacer for sidebar width */}
      <div style={{ marginLeft: isCollapsed ? "80px" : "280px", transition: "margin-left 0.3s ease" }} />
    </>
  );
};

export default AdminSidebar;
