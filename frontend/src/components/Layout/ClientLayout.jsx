import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ClientLayout.css";

const ClientLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/client/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
    { path: "/client/new-order", label: "Nouvelle commande", icon: "bi-plus-circle" },
    { path: "/client/history", label: "Historique", icon: "bi-clock-history" },
    { path: "/client/profile", label: "Profil", icon: "bi-person" },
  ];

  const displayName =
    user?.prenom || user?.firstName || user?.nom || user?.name?.split(" ")[0] || "Client";

  const handleLogout = () => {
    if (window.confirm("Etes-vous sur de vouloir vous deconnecter ?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="client-layout">
      <aside className={`client-sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="client-sidebar-brand">
          {!isCollapsed && (
            <span>
              <i className="bi bi-truck client-brand-mark"></i>
              Delivery
            </span>
          )}
          <button
            className="client-sidebar-toggle"
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            aria-label={isCollapsed ? "Ouvrir le menu" : "Reduire le menu"}
          >
            <i className={`bi bi-${isCollapsed ? "chevron-right" : "chevron-left"}`}></i>
          </button>
        </div>

        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`client-nav-link ${location.pathname === item.path ? "active" : ""}`}
              title={isCollapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon}`}></i>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="client-sidebar-footer">
          {!isCollapsed && (
            <div className="client-user-card">
              <div className="d-flex align-items-center gap-2">
                <span className="client-user-avatar">
                  <i className="bi bi-person"></i>
                </span>
                <div className="text-truncate">
                  <div className="fw-semibold text-white text-truncate">{displayName}</div>
                  <small className="text-white-50 text-truncate d-block">
                    {user?.email || "client@delivery.com"}
                  </small>
                </div>
              </div>
            </div>
          )}

          <button className="client-logout-btn" type="button" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left me-2"></i>
            {!isCollapsed && "Deconnexion"}
          </button>
        </div>
      </aside>

      <main className={`client-main ${isCollapsed ? "collapsed" : ""}`}>
        {title && (
          <header className="client-page-header">
            <h1>{title}</h1>
            <p>{subtitle || "Gerez vos commandes et suivez vos livraisons"}</p>
          </header>
        )}

        <div className="client-content">{children}</div>

        <footer className="client-footer">
          <p>© {new Date().getFullYear()} Delivery System. Tous droits reserves.</p>
        </footer>
      </main>
    </div>
  );
};

export default ClientLayout;
