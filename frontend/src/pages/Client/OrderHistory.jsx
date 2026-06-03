import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "../../components/Layout/ClientLayout";
import { getOrders } from "../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const statusOptions = [
  { value: "tous", label: "Tous" },
  { value: "en_attente", label: "En attente" },
  { value: "assignee", label: "Assignée" },
  { value: "en_retrait", label: "En retrait" },
  { value: "recuperee", label: "Récupérée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

const typeOptions = [
  { value: "tous", label: "Tous" },
  { value: "restaurant", label: "Restaurant" },
  { value: "pharmacie", label: "Pharmacie" },
  { value: "colis", label: "Colis" },
  { value: "courses", label: "Courses" },
];

const statusMeta = {
  en_attente: { label: "En attente", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)" },
  assignee: { label: "Assignee", color: "#2563eb", bg: "rgba(37, 99, 235, 0.15)" },
  en_retrait: { label: "En retrait", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)" },
  recuperee: { label: "Recuperee", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.15)" },
  livree: { label: "Livree", color: "#10b981", bg: "rgba(16, 185, 129, 0.15)" },
  annulee: { label: "Annulee", color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)" },
};

const normalizeStatus = (order) =>
  String(order?.statut || order?.status || "en_attente")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");

const normalizeType = (orderType) =>
  String(orderType || "")
    .toLowerCase()
    .trim();

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "tous",
    type: "tous",
    dateStart: "",
    dateEnd: "",
  });

  const perPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'historique des commandes.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return orders.filter((order) => {
      const createdAt = order.created_at || order.createdAt;
      const text = [
        order.id,
        order.type_commande || order.type,
        order.adresse_retrait || order.pickupAddress,
        order.adresse_livraison || order.deliveryAddress,
      ].join(" ").toLowerCase();

      if (filters.status !== "tous" && normalizeStatus(order) !== filters.status) return false;
      if (filters.type !== "tous" && normalizeType(order.type_commande || order.type) !== filters.type) return false;
      if (filters.dateStart && createdAt && new Date(createdAt) < new Date(filters.dateStart)) return false;
      if (filters.dateEnd && createdAt) {
        const endDate = new Date(filters.dateEnd);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(createdAt) > endDate) return false;
      }
      if (search && !text.includes(search)) return false;
      return true;
    });
  }, [filters, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const visibleOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  const updateFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  return (
    <ClientLayout title="Historique des Commandes" subtitle="Consultez, filtrez et ouvrez vos commandes passees.">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Recuperation de l'historique...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      ) : (
        <>
          <div className="client-card p-4 mb-4">
            <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
              <i className="bi bi-funnel me-2" style={{ color: "#2563eb" }}></i>
              Filtres
            </h5>
            <div className="row g-3">
              <div className="col-lg-3 col-md-6">
                <label className="form-label">Recherche</label>
                <input className="form-control" placeholder="Numero ou adresse..." value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} />
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label">Statut</label>
                <select className="form-select" value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}>
                  {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label">Type</label>
                <select className="form-select" value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label">Debut</label>
                <input type="date" className="form-control" value={filters.dateStart} onChange={(e) => updateFilter("dateStart", e.target.value)} />
              </div>
              <div className="col-lg-2 col-md-6">
                <label className="form-label">Fin</label>
                <input type="date" className="form-control" value={filters.dateEnd} onChange={(e) => updateFilter("dateEnd", e.target.value)} />
              </div>
              <div className="col-lg-1 col-md-6 d-flex align-items-end">
                <button
                  className="btn btn-outline-secondary w-100"
                  type="button"
                  onClick={() => {
                    setFilters({ search: "", status: "tous", type: "tous", dateStart: "", dateEnd: "" });
                    setPage(1);
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="client-table-card">
            {visibleOrders.length === 0 ? (
              <div className="client-empty-state">
                <i className="bi bi-inbox display-5 text-muted"></i>
                <h5 className="mt-3" style={{ color: "#1e293b" }}>Aucune commande trouvee</h5>
                <p className="mb-0">Modifiez les filtres pour afficher plus de resultats.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Commande</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Retrait</th>
                      <th>Livraison</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order) => {
                      const meta = statusMeta[normalizeStatus(order)] || statusMeta.en_attente;
                      return (
                        <tr key={order.id}>
                          <td className="fw-semibold">#{order.id}</td>
                          <td>{order.created_at || order.createdAt ? new Date(order.created_at || order.createdAt).toLocaleDateString("fr-FR") : "-"}</td>
                          <td>{order.type_commande || order.type || "-"}</td>
                          <td>{order.adresse_retrait || order.pickupAddress || "-"}</td>
                          <td>{order.adresse_livraison || order.deliveryAddress || "-"}</td>
                          <td>{order.prix_livraison || order.totalPrice || 0} MAD</td>
                          <td><span className="badge" style={{ background: meta.bg, color: meta.color }}>{meta.label}</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => navigate(`/client/orders/${order.id}`)}>
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <span className="btn btn-light disabled">{page} / {totalPages}</span>
              <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </ClientLayout>
  );
};

export default OrderHistory;
