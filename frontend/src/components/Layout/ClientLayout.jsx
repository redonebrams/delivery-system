import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ClientLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const getNavIcon = (path) => {
    const iconMap = {
      "/client/dashboard": "bi-speedometer2",
      "/client/new-order": "bi-plus-circle",
      "/client/orders": "bi-clock-history",
      "/client/profile": "bi-person"
    };
    return iconMap[path] || "bi-circle";
  };

  const getNavLabel = (path) => {
    const labelMap = {
      "/client/dashboard": "Dashboard",
      "/client/new-order": "Nouvelle Commande",
      "/client/orders": "Historique",
      "/client/profile": "Profil"
    };
    return labelMap[path] || "";
  };

  return (
    <div className="client-layout min-vh-100 bg-light">
      
      {/* Sidebar Navigation */}
      <div className="client-sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3">
              <i className="bi bi-truck fs-3"></i>
            </div>
            <h5 className="brand-name mb-0">DeliverySystem</h5>
            <small className="text-muted">Espace Client</small>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section mb-4">
            <small className="nav-section-title text-muted text-uppercase">Navigation</small>
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <Link 
                  to="/client/dashboard" 
                  className={`nav-link ${isActiveRoute("/client/dashboard") ? "active" : ""}`}
                >
                  <i className={`bi ${getNavIcon("/client/dashboard")} me-3`}></i>
                  {getNavLabel("/client/dashboard")}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/client/new-order" 
                  className={`nav-link ${isActiveRoute("/client/new-order") ? "active" : ""}`}
                >
                  <i className={`bi ${getNavIcon("/client/new-order")} me-3`}></i>
                  {getNavLabel("/client/new-order")}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/client/history" 
                  className={`nav-link ${isActiveRoute("/client/history") ? "active" : ""}`}
                >
                  <i className={`bi ${getNavIcon("/client/history")} me-3`}></i>
                  {getNavLabel("/client/history")}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/client/profile" 
                  className={`nav-link ${isActiveRoute("/client/profile") ? "active" : ""}`}
                >
                  <i className={`bi ${getNavIcon("/client/profile")} me-3`}></i>
                  {getNavLabel("/client/profile")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="nav-section">
            <small className="nav-section-title text-muted text-uppercase">Actions</small>
            <ul className="nav nav-pills flex-column">
              <li className="nav-item">
                <button className="nav-link text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-3"></i>
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* User Info */}
        <div className="sidebar-footer">
          <div className="user-info-card">
            <div className="d-flex align-items-center">
              <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                <i className="bi bi-person fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold">{user?.firstName || user?.name?.split(' ')[0] || "Client"}</div>
                <small className="text-muted">{user?.email || "client@delivery.com"}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="client-main">
        
        {/* Top Header */}
        <header className="client-header">
          <div className="header-content">
            <div className="d-flex justify-content-between align-items-center">
              <div className="header-title">
                {title && <h1 className="h3 mb-1">{title}</h1>}
                {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
              </div>
              <div className="header-actions">
                <div className="header-stats d-flex gap-3">
                  <div className="stat-item">
                    <small className="text-muted d-block">Commandes actives</small>
                    <span className="badge bg-primary">3</span>
                  </div>
                  <div className="stat-item">
                    <small className="text-muted d-block">Statut</small>
                    <span className="badge bg-success">Actif</span>
                  </div>
                </div>
                <button className="btn btn-outline-primary ms-3" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="client-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>

      <style jsx>{`
        .client-layout {
          display: flex;
          min-height: 100vh;
        }

        .client-sidebar {
          width: 280px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          box-shadow: 4px 0 15px rgba(0,0,0,0.1);
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .logo-section {
          text-align: center;
        }

        .logo-circle {
          width: 80px;
          height: 80px;
          margin: 0 auto;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }

        .sidebar-nav {
          flex-grow: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .nav-section {
          margin-bottom: 2rem;
        }

        .nav-section-title {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .nav-link {
          color: rgba(255,255,255,0.8) !important;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          text-decoration: none;
          display: flex;
          align-items: center;
        }

        .nav-link:hover {
          color: white !important;
          background: rgba(255,255,255,0.1);
          transform: translateX(5px);
        }

        .nav-link.active {
          color: white !important;
          background: rgba(255,255,255,0.2);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .nav-link.text-danger {
          color: rgba(255,255,255,0.8) !important;
        }

        .nav-link.text-danger:hover {
          color: #ff6b6b !important;
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .user-info-card {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }

        .avatar-circle {
          width: 40px;
          height: 40px;
        }

        .client-main {
          flex-grow: 1;
          margin-left: 280px;
          display: flex;
          flex-direction: column;
        }

        .client-header {
          background: white;
          border-bottom: 1px solid #e9ecef;
          padding: 1.5rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-actions {
          display: flex;
          align-items: center;
        }

        .header-stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat-item {
          text-align: center;
        }

        .client-content {
          flex-grow: 1;
          padding: 2rem;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .client-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }

          .client-main {
            margin-left: 0;
          }

          .sidebar-nav {
            padding: 1rem;
          }

          .sidebar-header {
            padding: 1rem;
          }

          .client-header {
            padding: 1rem;
          }

          .client-content {
            padding: 1rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .header-stats {
            order: -1;
            justify-content: center;
          }
        }

        /* Animations */
        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: width 0.3s ease;
        }

        .nav-link:hover::before {
          width: 100%;
        }

        /* Scrollbar Styling */
        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
};

export default ClientLayout;
