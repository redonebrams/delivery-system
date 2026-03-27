import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import ClientLayout from "../../components/Layout/ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    status: 'Tous',
    type: 'Tous',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        if (Array.isArray(data)) {
          setAllOrders(data);
          setOrders(data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'historique des commandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [filters, allOrders]);

  const getStatusInfo = (status) => {
    const map = {
      "En attente": { color: "warning", icon: "bi-clock", text: "En attente" },
      "Assignée": { color: "primary", icon: "bi-person-check", text: "Assignée" },
      "En cours de retrait": { color: "orange", icon: "bi-box-seam", text: "En retrait" },
      "En cours": { color: "info", icon: "bi-truck", text: "En livraison" },
      "Livrée": { color: "success", icon: "bi-check-circle", text: "Livrée" },
      "Annulée": { color: "danger", icon: "bi-x-circle", text: "Annulée" }
    };
    return map[status] || { color: "secondary", icon: "bi-question-circle", text: status };
  };

  const getTypeIcon = (type) => {
    const map = {
      "Restaurant": "bi-cup-hot",
      "Pharmacie": "bi-capsule",
      "Colis": "bi-box-seam",
      "Courses": "bi-cart3"
    };
    return map[type] || "bi-box";
  };

  const filterOrders = () => {
    let filtered = [...allOrders];

    if (filters.dateStart)
      filtered = filtered.filter(o => new Date(o.created_at || o.createdAt) >= new Date(filters.dateStart));
    if (filters.dateEnd)
      filtered = filtered.filter(o => new Date(o.created_at || o.createdAt) <= new Date(filters.dateEnd));
    if (filters.status !== "Tous")
      filtered = filtered.filter(o => o.status === filters.status);
    if (filters.type !== "Tous")
      filtered = filtered.filter(o => (o.type_commande || o.type) === filters.type);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toString().includes(s) ||
        (o.adresse_retrait || o.pickupAddress || "").toLowerCase().includes(s) ||
        (o.adresse_livraison || o.deliveryAddress || "").toLowerCase().includes(s)
      );
    }

    setOrders(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      dateStart: '',
      dateEnd: '',
      status: 'Tous',
      type: 'Tous',
      search: ''
    });
    setOrders(allOrders);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (loading) {
    return (
      <ClientLayout title="Historique" subtitle="Chargement...">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Récupération de l'historique...</p>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout title="Erreur">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
          <h4>Erreur</h4>
          <p className="text-muted">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-2"></i>Réessayer
          </button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Historique des Commandes">
      {/* Filters */}
      <div className="card rounded-4 mb-5 p-4 shadow-sm">
        <h5 className="mb-3 fw-bold"><i className="bi bi-funnel me-2 text-primary"></i>Filtres</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label>Date de début</label>
            <input type="date" className="form-control" value={filters.dateStart} onChange={e => setFilters({...filters, dateStart: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label>Date de fin</label>
            <input type="date" className="form-control" value={filters.dateEnd} onChange={e => setFilters({...filters, dateEnd: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label>Statut</label>
            <select className="form-select" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="Tous">Tous</option>
              <option value="En attente">En attente</option>
              <option value="Assignée">Assignée</option>
              <option value="En cours de retrait">En retrait</option>
              <option value="En cours">En livraison</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
          <div className="col-md-3">
            <label>Type</label>
            <select className="form-select" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
              <option value="Tous">Tous</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Pharmacie">Pharmacie</option>
              <option value="Colis">Colis</option>
              <option value="Courses">Courses</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Recherche</label>
            <input type="text" className="form-control" placeholder="Numéro ou adresse..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
          </div>
          <div className="col-md-6 d-flex gap-2 align-items-end">
            <button className="btn btn-primary flex-fill" onClick={filterOrders}>Filtrer</button>
            <button className="btn btn-secondary flex-fill" onClick={resetFilters}>Réinitialiser</button>
          </div>
        </div>
      </div>

      {/* Table */}
      {currentOrders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
          <h5>Aucune commande trouvée</h5>
          <p className="text-muted">Essayez de modifier vos filtres pour voir plus de résultats.</p>
        </div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#Commande</th>
                <th>Date</th>
                <th>Type</th>
                <th>Adresse</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.created_at || order.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td><i className={`bi ${getTypeIcon(order.type_commande || order.type)} me-1`}></i>{order.type_commande || order.type}</td>
                    <td>
                      <small>{(order.adresse_retrait || order.pickupAddress || "").substring(0,20)}...</small>
                      <br/>
                      <small>{(order.adresse_livraison || order.deliveryAddress || "").substring(0,20)}...</small>
                    </td>
                    <td>{order.prix_livraison || order.totalPrice} MAD</td>
                    <td>
                      <span className={`badge bg-${statusInfo.color}`}>
                        <i className={`bi ${statusInfo.icon} me-1`}></i>{statusInfo.text}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/client/orders/${order.id}`)}>
                        <i className="bi bi-eye me-1"></i>Voir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.max(p-1,1))}>
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i+1 && "active"}`}>
                <button className="page-link" onClick={() => setCurrentPage(i+1)}>{i+1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </ClientLayout>
  );
};

export default OrderHistory;