import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getOrders } from "../../services/orderService";
import ClientLayout from "../../components/Layout/ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérification de la connexion
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && !user && token) {
      try {
        login(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, [user, login]);

  // Données du dashboard
  const [ordersData, setOrdersData] = useState({
    orders: [],
    stats: { pending: 0, inProgress: 0, delivered: 0, cancelled: 0 },
    loading: true,
  });

  // Récupération des commandes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setOrdersData(prev => ({ ...prev, loading: true }));
        const allOrders = await getOrders();
        if (!Array.isArray(allOrders)) return;

        const userOrders = allOrders.filter(o => !o.clientId || o.clientId === user?.id);
        const activeOrders = userOrders.filter(o => o.status !== "Livrée" && o.status !== "Annulée");

        setOrdersData({
          orders: activeOrders,
          stats: {
            pending: userOrders.filter(o => o.status === "En attente").length,
            inProgress: userOrders.filter(o => ["Assignée", "En cours de retrait", "En cours"].includes(o.status)).length,
            delivered: userOrders.filter(o => o.status === "Livrée").length,
            cancelled: userOrders.filter(o => o.status === "Annulée").length,
          },
          loading: false,
        });
      } catch (err) {
        console.error("Erreur dashboard:", err);
        setOrdersData(prev => ({ ...prev, loading: false }));
      }
    };
    if (user) fetchData();
  }, [user]);

  if (!user) {
    return (
      <ClientLayout title="Connexion requise">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-xl">
              <div className="card-body text-center py-5">
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "1rem",
                    background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    fontSize: "3rem",
                  }}
                >
                  <i className="bi bi-lock"></i>
                </div>
                <h4 style={{ color: "#1e293b", fontWeight: 700 }}>Veuillez vous connecter</h4>
                <p className="text-muted">Pour accéder à votre dashboard client</p>
                <Link
                  to="/login"
                  className="btn btn-lg"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                    color: "white",
                    border: "none",
                    marginTop: "1.5rem",
                    fontWeight: 600,
                    padding: "0.85rem 2rem",
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (ordersData.loading) {
    return (
      <ClientLayout title="Dashboard" subtitle="Chargement...">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Chargement de votre dashboard...</p>
        </div>
      </ClientLayout>
    );
  }

  const getStatusBadge = status => {
    const map = {
      "En attente": { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", icon: "bi-clock" },
      "Assignée": { color: "#2563eb", bg: "rgba(37, 99, 235, 0.15)", icon: "bi-person-check" },
      "En cours de retrait": { color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)", icon: "bi-box-seam" },
      "En cours": { color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)", icon: "bi-truck" },
      "Livrée": { color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", icon: "bi-check-circle" },
      "Annulée": { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", icon: "bi-x-circle" },
    };
    const config = map[status];
    if (!config) return null;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: "0.5rem 0.9rem",
          borderRadius: "0.5rem",
          fontSize: "0.85rem",
          fontWeight: 600,
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.bg}`,
        }}
      >
        <i className={`bi ${config.icon}`}></i> {status}
      </span>
    );
  };

  const getProgress = status => {
    const map = { "En attente": 10, "Assignée": 30, "En cours de retrait": 60, "En cours": 80, "Livrée": 100, "Annulée": 0 };
    return map[status] || 0;
  };

  const displayName = user?.prenom || user?.nom || user?.name || "Utilisateur";

  const getOrderType = type => {
    const map = {
      Restaurant: { icon: "bi-basket", label: "Restaurant" },
      Pharmacie: { icon: "bi-pill", label: "Pharmacie" },
      Colis: { icon: "bi-box", label: "Colis" },
      Courses: { icon: "bi-cart", label: "Courses" },
    };
    // Si type vide ou inconnu, afficher "Autre"
    return map[type] || { icon: "bi-bag", label: type && type.trim() !== "" ? type : "Autre" };
  };

  return (
    <ClientLayout>
      {/* Dashboard Header */}
      <div
        className="w-100 rounded-4 p-5 mb-5"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)", color: "white" }}
      >
        <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
          Bonjour, {displayName} 👋
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.95 }}>Voici un aperçu de vos livraisons et commandes en cours</p>
      </div>

      {/* Statistiques */}
      <div className="row g-4 mb-5">
        {[
          { label: "Commandes en attente", value: ordersData.stats.pending, icon: "bi-clock-fill", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.1)" },
          { label: "Commandes en cours", value: ordersData.stats.inProgress, icon: "bi-truck", color: "#2563eb", bgColor: "rgba(37, 99, 235, 0.1)" },
          { label: "Commandes livrées", value: ordersData.stats.delivered, icon: "bi-check-circle-fill", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.1)" },
          { label: "Commandes annulées", value: ordersData.stats.cancelled, icon: "bi-x-circle-fill", color: "#ef4444", bgColor: "rgba(239, 68, 68, 0.1)" },
        ].map((stat, idx) => (
          <div key={idx} className="col-lg-3 col-md-6 col-sm-12">
            <div className="card border rounded-4 h-100 shadow-sm text-center p-4 d-flex flex-column justify-content-center align-items-center">
              <div
                className="d-flex justify-content-center align-items-center rounded-3 mb-3"
                style={{ width: "80px", height: "80px", background: stat.bgColor, fontSize: "2.5rem", color: stat.color }}
              >
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <h2 className="h4 mb-2 fw-bold" style={{ color: "#1e293b" }}>
                {stat.value}
              </h2>
              <p className="text-muted mb-0" style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Commandes Actives */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: "2px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
            <i className="bi bi-box-seam me-2" style={{ color: "#2563eb", fontSize: "1.75rem" }}></i>
            Commandes Actives
          </h2>
          <span
            className="badge rounded-pill"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
              color: "white",
              padding: "0.35rem 0.75rem",
              fontSize: "0.85rem",
              fontWeight: 600,
            }}
          >
            {ordersData.orders.length}
          </span>
        </div>

        {ordersData.orders.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{ width: "100px", height: "100px", background: "#f8fafc", fontSize: "3rem" }}
            >
              <i className="bi bi-inbox"></i>
            </div>
            <h4 style={{ color: "#1e293b", fontWeight: 700 }}>Aucune commande en cours</h4>
            <p className="text-muted mb-4">Commencez maintenant en créant une nouvelle commande.</p>
            <Link
              to="/client/new-order"
              className="btn btn-lg"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)", color: "white", fontWeight: 600, border: "none" }}
            >
              <i className="bi bi-plus-circle me-2"></i>Nouvelle Commande
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {ordersData.orders.slice(0, 6).map(order => {
              const orderType = getOrderType(order.type);
              return (
                <div key={order.id} className="col-lg-4 col-md-6 col-sm-12">
                  <div className="card rounded-4 h-100 shadow-sm border p-4" style={{ borderColor: "#e2e8f0", transition: "all 0.3s ease" }}>
                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className={`bi ${orderType.icon}`} style={{ color: "#2563eb", fontSize: "1.25rem" }}></i>
                        <span className="fw-bold" style={{ color: "#1e293b", fontSize: "1.1rem" }}>
                          #{order.id}
                        </span>
                      </div>
                      <span className="d-inline-block px-3 py-2 rounded-2" style={{ background: "#f8fafc", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                        {orderType.label}
                      </span>
                    </div>

                    <div className="mb-3">{getStatusBadge(order.status)}</div>

                    <div className="mb-3" style={{ flex: 1 }}>
                      <div className="d-flex align-items-flex-start gap-2 mb-2">
                        <i className="bi bi-geo-alt" style={{ color: "#2563eb", minWidth: "1.2rem" }}></i>
                        <small style={{ color: "#1e293b", fontWeight: 500 }}>{order.address || "Adresse non spécifiée"}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-currency-dollar" style={{ color: "#2563eb" }}></i>
                        <small style={{ color: "#1e293b", fontWeight: 500 }}>{order.price || 0} MAD</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="progress rounded-pill" style={{ height: "6px", background: "#f1f5f9", marginBottom: "0.5rem" }}>
                        <div
                          className="progress-bar"
                          style={{
                            background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
                            width: `${getProgress(order.status)}%`,
                            transition: "width 0.6s ease",
                          }}
                        ></div>
                      </div>
                      <small style={{ color: "#64748b", fontWeight: 500 }}>{getProgress(order.status)}% complété</small>
                    </div>

                    <Link
                      to={`/client/orders/${order.id}`}
                      className="btn btn-sm w-100 rounded-2 text-white fw-500"
                      style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)", border: "none", fontWeight: 500 }}
                    >
                      <i className="bi bi-geo-alt me-1"></i>Suivre
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default Dashboard;