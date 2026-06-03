import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientLayout from "../../components/Layout/ClientLayout";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const steps = [
  { key: "en_attente", label: "Commande creee" },
  { key: "assignee", label: "Livreur assigne" },
  { key: "en_retrait", label: "En retrait" },
  { key: "recuperee", label: "Colis recupere" },
  { key: "livree", label: "Livree" },
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les details de la commande.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Annuler cette commande ?")) return;

    try {
      setCancelling(true);
      await updateOrderStatus(order.id, "annulee");
      setOrder((current) => ({ ...current, statut: "annulee" }));
    } catch (err) {
      console.error(err);
      setError("Impossible d'annuler cette commande.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Details de la commande" subtitle={`Commande #${id}`}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Recuperation des details...</p>
        </div>
      </ClientLayout>
    );
  }

  if (error || !order) {
    return (
      <ClientLayout title="Details de la commande" subtitle={`Commande #${id}`}>
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || "Commande non trouvee."}
        </div>
        <button className="btn btn-outline-primary" onClick={() => navigate("/client/history")}>
          <i className="bi bi-arrow-left"></i>
          Retour a l'historique
        </button>
      </ClientLayout>
    );
  }

  const statusKey = normalizeStatus(order);
  const status = statusMeta[statusKey] || statusMeta.en_attente;
  const currentStep = Math.max(0, steps.findIndex((step) => step.key === statusKey));

  return (
    <ClientLayout title="Details de la commande" subtitle={`Commande #${order.id}`}>
      <div className="row g-4 mb-4">
        {[
          { label: "Commande", value: `#${order.id}`, icon: "bi-receipt", color: "#2563eb" },
          { label: "Type", value: order.type_commande || order.type || "-", icon: "bi-box-seam", color: "#0ea5e9" },
          { label: "Prix", value: `${order.prix_livraison || order.totalPrice || 0} MAD`, icon: "bi-cash-coin", color: "#10b981" },
          { label: "Statut", value: status.label, icon: "bi-activity", color: status.color },
        ].map((item) => (
          <div className="col-md-3 col-sm-6" key={item.label}>
            <div className="client-card client-stat-card">
              <div>
                <h6 className="text-muted mb-2">{item.label}</h6>
                <h5 className="fw-bold m-0" style={{ color: "#1e293b" }}>{item.value}</h5>
              </div>
              <span className="client-stat-icon" style={{ background: `${item.color}1f`, color: item.color }}>
                <i className={`bi ${item.icon} fs-4`}></i>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="client-card p-4 mb-4">
        <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
          <i className="bi bi-clock-history me-2" style={{ color: "#2563eb" }}></i>
          Suivi de livraison
        </h5>
        <div className="row g-3">
          {steps.map((step, index) => {
            const complete = statusKey === "livree" || index < currentStep;
            const active = index === currentStep && statusKey !== "livree" && statusKey !== "annulee";
            return (
              <div className="col-lg col-md-4 col-sm-6" key={step.key}>
                <div className="text-center p-3 rounded-3" style={{ background: active ? "rgba(37, 99, 235, 0.08)" : "#f8fafc" }}>
                  <span
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                    style={{
                      width: 44,
                      height: 44,
                      background: complete ? "#10b981" : active ? "#2563eb" : "#e2e8f0",
                      color: complete || active ? "#fff" : "#94a3b8",
                    }}
                  >
                    <i className={`bi ${complete ? "bi-check" : active ? "bi-arrow-right" : "bi-circle"}`}></i>
                  </span>
                  <div className="fw-semibold" style={{ color: complete ? "#10b981" : active ? "#2563eb" : "#64748b" }}>{step.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <AddressCard title="Point de retrait" icon="bi-geo-alt" color="#10b981" name={order.nom_retrait || order.pickupName} phone={order.telephone_retrait || order.pickupPhone} address={order.adresse_retrait || order.pickupAddress} />
        <AddressCard title="Point de livraison" icon="bi-truck" color="#2563eb" name={order.nom_livraison || order.deliveryName} phone={order.telephone_livraison || order.deliveryPhone} address={order.adresse_livraison || order.deliveryAddress} />
      </div>

      {order.livreur && (
        <div className="client-card p-4 mb-4">
          <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
            <i className="bi bi-person-badge me-2" style={{ color: "#0ea5e9" }}></i>
            Livreur assigne
          </h5>
          <div className="row g-3">
            <Info label="Nom" value={order.livreur.name || `${order.livreur.prenom || ""} ${order.livreur.nom || ""}`} icon="bi-person" />
            <Info label="Telephone" value={order.livreur.phone || order.livreur.telephone || "-"} icon="bi-telephone" />
            <Info label="Vehicule" value={order.livreur.vehicle || order.livreur.type_vehicule || "Moto"} icon="bi-bicycle" />
          </div>
        </div>
      )}

      {order.instructions_speciales && (
        <div className="client-card p-4 mb-4">
          <h5 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
            <i className="bi bi-chat-left-text me-2" style={{ color: "#2563eb" }}></i>
            Instructions speciales
          </h5>
          <p className="mb-0 text-muted">{order.instructions_speciales}</p>
        </div>
      )}

      <div className="client-card p-4 text-center">
        <button className="btn btn-outline-primary me-2" type="button" onClick={() => navigate("/client/history")}>
          <i className="bi bi-arrow-left"></i>
          Retour a l'historique
        </button>
        {statusKey === "en_attente" && (
          <button className="btn btn-danger" type="button" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-x-circle"></i>}
            Annuler la commande
          </button>
        )}
      </div>
    </ClientLayout>
  );
};

const AddressCard = ({ title, icon, color, name, phone, address }) => (
  <div className="col-md-6">
    <div className="client-card p-4 h-100">
      <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
        <i className={`bi ${icon} me-2`} style={{ color }}></i>
        {title}
      </h5>
      <Info label="Nom" value={name || "-"} icon="bi-person" />
      <Info label="Telephone" value={phone || "-"} icon="bi-telephone" />
      <Info label="Adresse" value={address || "-"} icon="bi-house" />
    </div>
  </div>
);

const Info = ({ label, value, icon }) => (
  <div className="mb-3">
    <small className="text-muted text-uppercase fw-semibold">{label}</small>
    <p className="fw-bold mb-0 mt-1" style={{ color: "#1e293b" }}>
      <i className={`bi ${icon} me-2`} style={{ color: "#2563eb" }}></i>
      {value}
    </p>
  </div>
);

export default OrderDetails;
