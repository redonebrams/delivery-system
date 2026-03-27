import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const LivreurSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#2c3e50",
        color: "#ecf0f1",
        padding: "20px 0",
        overflowY: "auto",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* Logo/Header */}
      <div style={{ padding: "0 20px 30px", borderBottom: "1px solid rgba(236, 240, 241, 0.1)" }}>
        <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
          <i className="bi bi-truck-front" style={{ marginRight: "8px" }}></i>
          Livreur
        </h4>
      </div>

      {/* Navigation */}
      <nav style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {/* Dashboard */}
          <li style={{ margin: 0 }}>
            <Link
              to="/livreur/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                color: isActive("/livreur/dashboard") ? "#3498db" : "#ecf0f1",
                textDecoration: "none",
                backgroundColor: isActive("/livreur/dashboard") ? "rgba(52, 152, 219, 0.1)" : "transparent",
                borderLeft: isActive("/livreur/dashboard") ? "4px solid #3498db" : "4px solid transparent",
                transition: "all 0.3s ease",
                fontSize: "14px",
                fontWeight: isActive("/livreur/dashboard") ? "600" : "500",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/livreur/dashboard")) {
                  e.currentTarget.style.backgroundColor = "rgba(52, 152, 219, 0.05)";
                  e.currentTarget.style.color = "#3498db";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/livreur/dashboard")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#ecf0f1";
                }
              }}
            >
              <i className="bi bi-speedometer2" style={{ marginRight: "12px", fontSize: "16px" }}></i>
              Tableau de bord
            </Link>
          </li>

          {/* Mes Livraisons */}
          <li style={{ margin: 0 }}>
            <Link
              to="/livreur/deliveries"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                color: isActive("/livreur/deliveries") ? "#3498db" : "#ecf0f1",
                textDecoration: "none",
                backgroundColor: isActive("/livreur/deliveries") ? "rgba(52, 152, 219, 0.1)" : "transparent",
                borderLeft: isActive("/livreur/deliveries") ? "4px solid #3498db" : "4px solid transparent",
                transition: "all 0.3s ease",
                fontSize: "14px",
                fontWeight: isActive("/livreur/deliveries") ? "600" : "500",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/livreur/deliveries")) {
                  e.currentTarget.style.backgroundColor = "rgba(52, 152, 219, 0.05)";
                  e.currentTarget.style.color = "#3498db";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/livreur/deliveries")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#ecf0f1";
                }
              }}
            >
              <i className="bi bi-boxes" style={{ marginRight: "12px", fontSize: "16px" }}></i>
              Mes livraisons
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer avec Logout */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px",
          borderTop: "1px solid rgba(236, 240, 241, 0.1)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#c0392b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#e74c3c";
          }}
        >
          <i className="bi bi-box-arrow-right" style={{ marginRight: "8px" }}></i>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default LivreurSidebar;
