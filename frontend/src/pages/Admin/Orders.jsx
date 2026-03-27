import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, assignLivreur, updateOrderStatus, deleteOrder } from "../../services/orderService";
import { getLivreurs } from "../../services/userService";
import { useError } from "../../context/ErrorContext";
import { useLoading } from "../../context/LoadingContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Orders = () => {
  const navigate = useNavigate();
  const { handleApiError, handleSuccess } = useError();
  const { setLoading, isLoading } = useLoading();

  const [orders, setOrders] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedLivreur, setSelectedLivreur] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Fetch orders and livreurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading('ordersPage', true);
        const [ordersData, livreursList] = await Promise.all([getOrders(), getLivreurs()]);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLivreurs(Array.isArray(livreursList) ? livreursList : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Impossible de charger les données");
        handleApiError(err);
      } finally {
        setLoading('ordersPage', false);
      }
    };
    fetchData();
  }, []);

  // Assign a livreur
  const handleAssign = async () => {
    if (!selectedOrder || !selectedLivreur) return;
    try {
      setLoading('assign', true);
      await assignLivreur(selectedOrder.id, selectedLivreur);
      handleSuccess("Livreur assigné avec succès");
      setShowAssignModal(false);
      setSelectedOrder(null);
      setSelectedLivreur('');
      const updatedOrders = await getOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading('assign', false);
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(`status-${orderId}`, true);
      await updateOrderStatus(orderId, newStatus);
      handleSuccess("Statut mis à jour");
      const updatedOrders = await getOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(`status-${orderId}`, false);
    }
  };

  // Delete an order
  const handleDelete = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) return;
    try {
      setLoading(`delete-${orderId}`, true);
      await deleteOrder(orderId);
      handleSuccess("Commande supprimée");
      setOrders(orders.filter(o => o.id !== orderId));
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(`delete-${orderId}`, false);
    }
  };

  // Get badge color
  const getStatusColor = (status) => {
    const statusMap = {
      'en_attente': { bg: '#f59e0b', text: 'white', label: 'En attente' },
      'assignee': { bg: '#2563eb', text: 'white', label: 'Assignée' },
      'en_retrait': { bg: '#0ea5e9', text: 'white', label: 'En retrait' },
      'recuperee': { bg: '#0ea5e9', text: 'white', label: 'Récupérée' },
      'livree': { bg: '#10b981', text: 'white', label: 'Livrée' },
      'annulee': { bg: '#ef4444', text: 'white', label: 'Annulée' },
    };
    return statusMap[status] || { bg: '#64748b', text: 'white', label: status };
  };

  if (error && !orders.length) {
    return (
      <AdminLayout title="Gestion des Commandes">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Commandes">
      {/* Summary */}
      <div className="card rounded-4 border mb-4" style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="card-body p-4 d-flex justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              <i className="bi bi-filter me-2" style={{ color: "#2563eb" }}></i> Total Commandes
            </h6>
            <h2 className="fw-bold m-0" style={{ color: "#2563eb", fontSize: "2rem" }}>{orders.length}</h2>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <i className="bi bi-graph-up me-2"></i> Voir Dashboard
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading('ordersPage') ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Chargement des commandes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card rounded-4 border text-center py-5" style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#cbd5e1" }}></i>
          <p className="text-muted mt-3">Aucune commande trouvée</p>
        </div>
      ) : (
        <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="card-body p-4 table-responsive">
            <table className="table mb-0">
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <th>Commande</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Livreur</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const statusInfo = getStatusColor(order.statut || order.status);
                  return (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.nom_retrait || order.clientName || '-'}</td>
                      <td><span className="badge bg-info">{order.type_commande || order.type || '-'}</span></td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.statut}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={isLoading(`status-${order.id}`)}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="assignee">Assignée</option>
                          <option value="en_retrait">En retrait</option>
                          <option value="recuperee">Récupérée</option>
                          <option value="livree">Livrée</option>
                          <option value="annulee">Annulée</option>
                        </select>
                      </td>
                      <td>{order.livreur ? `${order.livreur.name}` : <span className="text-danger">Non assigné</span>}</td>
                      <td>{order.prix_livraison || order.totalPrice ? `${order.prix_livraison || order.totalPrice} MAD` : '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => { setSelectedOrder(order); setShowAssignModal(true); setSelectedLivreur(''); }}>
                          <i className="bi bi-person-plus"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)} disabled={isLoading(`delete-${order.id}`)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assigner un livreur</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Commande #{selectedOrder.id}</p>
                <select className="form-select" value={selectedLivreur} onChange={(e) => setSelectedLivreur(e.target.value)}>
                  <option value="">Sélectionner un livreur</option>
                  {livreurs.map(l => (
                    <option key={l.id} value={l.id}>{l.nom} {l.prenom} - {l.type_vehicule}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Annuler</button>
                <button type="button" className="btn btn-primary" onClick={handleAssign} disabled={!selectedLivreur || isLoading('assign')}>
                  {isLoading('assign') ? 'Assignation...' : 'Assigner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;