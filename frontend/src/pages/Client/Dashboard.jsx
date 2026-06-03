import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ClientLayout from "../../components/Layout/ClientLayout";
import { getOrders } from "../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const statusConfig = {
  en_attente: { label: "En attente", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", icon: "bi-clock" },
  assignee: { label: "Assignee", color: "#2563eb", bg: "rgba(37, 99, 235, 0.15)", icon: "bi-person-check" },
  en_retrait: { label: "En retrait", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)", icon: "bi-box-seam" },
  recuperee: { label: "Recuperee", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)", icon: "bi-truck" },
  livree: { label: "Livree", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)", icon: "bi-check-circle" },
  annulee: { label: "Annulee", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", icon: "bi-x-circle" },
};

const normalizeStatus = (order) =>
  String(order?.statut || order?.status || "en_attente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");

const getStatus = (order) => statusConfig[normalizeStatus(order)] || statusConfig.en_attente;

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        const list = Array.isArray(data) ? data : [];
        setOrders(list.filter((order) => !order.client_id || !user?.id || order.client_id === user.id));
      } catch (error) {
        console.error("Erreur dashboard client:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => normalizeStatus(order) === "en_attente").length;
    const ongoing = orders.filter((order) => ["assignee", "en_retrait", "recuperee"].includes(normalizeStatus(order))).length;
    const delivered = orders.filter((order) => normalizeStatus(order) === "livree").length;
    const cancelled = orders.filter((order) => normalizeStatus(order) === "annulee").length;
    return { pending, ongoing, delivered, cancelled };
  }, [orders]);

  const activeOrders = orders.filter((order) => !["livree", "annulee"].includes(normalizeStatus(order))).slice(0, 6);
  const displayName = user?.prenom || user?.nom || user?.name || "Client";

  return (
    <ClientLayout title="Dashboard" subtitle={`Bienvenue, ${displayName}. Voici votre vue d'ensemble.`}>
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Chargement de votre dashboard...</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-5">
            {[
              { label: "En attente", value: stats.pending, icon: "bi-clock", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
              { label: "En cours", value: stats.ongoing, icon: "bi-truck", color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)" },
              { label: "Livrees", value: stats.delivered, icon: "bi-check-circle", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
              { label: "Annulees", value: stats.cancelled, icon: "bi-x-circle", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" },
            ].map((stat) => (
              <div className="col-md-3 col-sm-6" key={stat.label}>
                <div className="client-card client-stat-card">
                  <div>
                    <h6 className="text-muted mb-2">{stat.label}</h6>
                    <h3 className="fw-bold m-0" style={{ color: stat.color }}>{stat.value}</h3>
                  </div>
                  <span className="client-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                    <i className={`bi ${stat.icon} fs-4`}></i>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="client-card p-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                  <i className="bi bi-box-seam me-2" style={{ color: "#2563eb" }}></i>
                  Commandes actives
                </h5>
                <p className="text-muted mb-0">Suivez les livraisons qui demandent encore une action.</p>
              </div>
              <Link to="/client/new-order" className="btn client-gradient-btn">
                <i className="bi bi-plus-circle"></i>
                Nouvelle commande
              </Link>
            </div>

            {activeOrders.length === 0 ? (
              <div className="client-empty-state">
                <i className="bi bi-inbox display-5 text-muted"></i>
                <h5 className="mt-3" style={{ color: "#1e293b" }}>Aucune commande active</h5>
                <p className="mb-0">Creez une commande pour commencer une nouvelle livraison.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Commande</th>
                      <th>Type</th>
                      <th>Livraison</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeOrders.map((order) => {
                      const status = getStatus(order);
                      return (
                        <tr key={order.id}>
                          <td className="fw-semibold">#{order.id}</td>
                          <td>{order.type_commande || order.type || "-"}</td>
                          <td>{order.adresse_livraison || order.deliveryAddress || "-"}</td>
                          <td>{order.prix_livraison || order.totalPrice || 0} MAD</td>
                          <td>
                            <span className="badge" style={{ background: status.bg, color: status.color }}>
                              <i className={`bi ${status.icon} me-1`}></i>
                              {status.label}
                            </span>
                          </td>
                          <td>
                            <Link to={`/client/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </ClientLayout>
  );
};

export default Dashboard;
