import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../services/orderService";
import ClientLayout from "../../components/Layout/ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError("Impossible de charger les détails de la commande.");
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Fonction pour déterminer le statut et sa couleur
  const getStatusInfo = (status) => {
    const statusMap = {
      "En attente": { color: "warning", icon: "bi-clock", text: "En attente" },
      "Assignée": { color: "primary", icon: "bi-person-check", text: "Assignée" },
      "En cours de retrait": { color: "orange", icon: "bi-box-seam", text: "En retrait" },
      "En cours": { color: "info", icon: "bi-truck", text: "En livraison" },
      "Livrée": { color: "success", icon: "bi-check-circle", text: "Livrée" },
      "Annulée": { color: "danger", icon: "bi-x-circle", text: "Annulée" }
    };
    return statusMap[status] || { color: "secondary", icon: "bi-question-circle", text: status };
  };

  // Timeline statique (à remplacer par les vraies données du backend)
  const getTimelineSteps = (currentStatus) => {
    const steps = [
      { key: "En attente", label: "Commande créée", completed: true },
      { key: "Assignée", label: "Livreur assigné", completed: ["Assignée", "En cours de retrait", "En cours", "Livrée"].includes(currentStatus) },
      { key: "En cours de retrait", label: "En cours de retrait", completed: ["En cours de retrait", "En cours", "Livrée"].includes(currentStatus) },
      { key: "En cours", label: "En livraison", completed: ["En cours", "Livrée"].includes(currentStatus) },
      { key: "Livrée", label: "Livrée", completed: currentStatus === "Livrée" }
    ];
    return steps;
  };

  if (loading) {
    return (
      <ClientLayout title="Chargement">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Récupération des détails de la commande...</p>
        </div>
      </ClientLayout>
    );
  }

  if (error || !order) {
    return (
      <ClientLayout title="Erreur">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-exclamation-triangle text-danger fs-1 mb-3"></i>
                <h4>Erreur</h4>
                <p className="text-muted">{error || "Commande non trouvée."}</p>
                <button className="btn btn-primary" onClick={() => navigate("/client/dashboard")}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Retour au dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        // Call your cancel order API here
        // await cancelOrder(orderId);
        // For now, just show a success message
        alert("La commande a été annulée avec succès.");
        navigate("/client/dashboard");
      } catch (err) {
        alert("Erreur lors de l'annulation de la commande.");
        console.error("Error cancelling order:", err);
      }
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const timelineSteps = getTimelineSteps(order.status);

  return (
    <ClientLayout>
      {/* Header */}
      <div
        className="w-100 rounded-4 p-5 mb-5"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
          color: "white",
        }}
      >
        <h1 className="fw-bold mb-2">
          <i className="bi bi-box-seam me-2"></i>Détails de la commande
        </h1>
        <p className="m-0 opacity-75">
          #{order.id} • {new Date(order.created_at || order.createdAt).toLocaleDateString(
            "fr-FR"
          )}
        </p>
      </div>

      {/* Carte Résumé */}
      <div className="row g-3 mb-5">
        <div className="col-md-3 col-sm-6">
          <div
            className="card rounded-4 border text-center p-4"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Commande
            </small>
            <h5 className="fw-bold mt-2 mb-0" style={{ color: "#2563eb", fontSize: "1.5rem" }}>
              #{order.id}
            </h5>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div
            className="card rounded-4 border text-center p-4"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Type
            </small>
            <h5 className="fw-bold mt-2 mb-0" style={{ color: "#1e293b" }}>
              <i className="bi bi-box-seam me-1" style={{ color: "#2563eb" }}></i>
              {order.type_commande || order.type}
            </h5>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div
            className="card rounded-4 border text-center p-4"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Prix
            </small>
            <h5 className="fw-bold mt-2 mb-0" style={{ color: "#2563eb", fontSize: "1.5rem" }}>
              {order.prix_livraison || order.totalPrice || order.price} MAD
            </h5>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div
            className="card rounded-4 border text-center p-4"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase" }}>
              Statut
            </small>
            <span
              className="badge rounded-pill px-3 py-2 mt-2 d-inline-block"
              style={{
                background: statusInfo.color === "warning" ? "rgba(245, 158, 11, 0.15)" : statusInfo.color === "success" ? "rgba(16, 185, 129, 0.15)" : "rgba(37, 99, 235, 0.15)",
                color:
                  statusInfo.color === "warning"
                    ? "#f59e0b"
                    : statusInfo.color === "success"
                    ? "#10b981"
                    : "#2563eb",
                fontWeight: 600,
              }}
            >
              <i className={`bi ${statusInfo.icon} me-1`}></i>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline de suivi */}
      <div
        className="card rounded-4 border mb-5"
        style={{
          borderColor: "#e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="card-body p-5">
          <h5 className="mb-4 fw-bold" style={{ color: "#1e293b" }}>
            <i
              className="bi bi-clock-history me-2"
              style={{ color: "#2563eb", fontSize: "1.25rem" }}
            ></i>
            Suivi en temps réel
          </h5>
          <div className="row">
            {timelineSteps.map((step, index) => (
              <div
                key={step.key}
                className="col-lg-2 col-md-4 col-sm-6 col-12 mb-4"
                style={{
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: step.completed
                        ? "#10b981"
                        : step.key === order.status
                        ? "#2563eb"
                        : "#e2e8f0",
                      color: step.completed || step.key === order.status ? "white" : "#94a3b8",
                      fontSize: "1.5rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i
                      className={`bi ${
                        step.completed
                          ? "bi-check"
                          : step.key === order.status
                          ? "bi-arrow-right"
                          : "bi-circle"
                      }`}
                    ></i>
                  </div>
                </div>
                <h6
                  className="fw-bold mt-2 mb-1"
                  style={{
                    color: step.completed ? "#10b981" : step.key === order.status ? "#2563eb" : "#94a3b8",
                    fontSize: "0.9rem",
                  }}
                >
                  {step.label}
                </h6>
                {step.key === order.status && (
                  <span
                    className="badge rounded-pill px-2"
                    style={{
                      background: "#2563eb",
                      color: "white",
                      fontSize: "0.75rem",
                    }}
                  >
                    En cours
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Informations de livraison */}
      <div className="row g-4 mb-5">
        {/* Point de retrait */}
        <div className="col-md-6">
          <div
            className="card rounded-4 border h-100"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i
                  className="bi bi-geo-alt-fill me-2"
                  style={{ color: "#10b981", fontSize: "1.1rem" }}
                ></i>
                Point de retrait
              </h6>
              <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Nom</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-person me-2" style={{ color: "#2563eb" }}></i>
                  {order.nom_retrait || order.pickupName}
                </p>
              </div>
              <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Téléphone</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-telephone me-2" style={{ color: "#2563eb" }}></i>
                  {order.telephone_retrait || order.pickupPhone}
                </p>
              </div>
              <div className="mb-0">
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Adresse</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-house me-2" style={{ color: "#2563eb" }}></i>
                  {order.adresse_retrait || order.pickupAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Point de livraison */}
        <div className="col-md-6">
          <div
            className="card rounded-4 border h-100"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i
                  className="bi bi-truck me-2"
                  style={{ color: "#2563eb", fontSize: "1.1rem" }}
                ></i>
                Point de livraison
              </h6>
              <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Nom</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-person me-2" style={{ color: "#2563eb" }}></i>
                  {order.nom_livraison || order.deliveryName}
                </p>
              </div>
              <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Téléphone</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-telephone me-2" style={{ color: "#2563eb" }}></i>
                  {order.telephone_livraison || order.deliveryPhone}
                </p>
              </div>
              <div className="mb-0">
                <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Adresse</small>
                <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                  <i className="bi bi-house me-2" style={{ color: "#2563eb" }}></i>
                  {order.adresse_livraison || order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livreur assigné */}
      {order.livreur && (
        <div
          className="card rounded-4 border mb-5"
          style={{
            borderColor: "#e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body p-4">
            <h6 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
              <i
                className="bi bi-person-badge me-2"
                style={{ color: "#0ea5e9", fontSize: "1.1rem" }}
              ></i>
              Livreur assigné
            </h6>
            <div className="d-flex gap-4 align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "2rem",
                }}
              >
                <i className="bi bi-person"></i>
              </div>
              <div>
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Nom</small>
                  <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                    {order.livreur.name}
                  </p>
                </div>
                <div className="mb-3">
                  <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Téléphone</small>
                  <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                    {order.livreur.phone}
                  </p>
                </div>
                <div>
                  <small style={{ color: "#64748b", fontWeight: 500, fontSize: "0.75rem" }}>Véhicule</small>
                  <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                    <i className="bi bi-bicycle me-1"></i>
                    {order.livreur.vehicle || "Moto"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions spéciales */}
      {order.instructions_speciales && (
        <div className="mb-4">
          <div
            className="card rounded-4 border"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: "#1e293b" }}>
                <i
                  className="bi bi-chat-left-text me-2"
                  style={{ color: "#2563eb", fontSize: "1.1rem" }}
                ></i>
                Instructions spéciales
              </h6>
              <div
                className="p-3 rounded-3"
                style={{
                  backgroundColor: "#f8fafc",
                  borderLeft: "4px solid #0ea5e9",
                }}
              >
                <p className="m-0" style={{ color: "#1e293b", lineHeight: "1.6" }}>
                  {order.instructions_speciales}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-5">
        <div
          className="card rounded-4 border"
          style={{
            borderColor: "#e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="card-body p-4 text-center">
            <button
              className="btn fw-500 me-3"
              onClick={() => navigate("/client/dashboard")}
              style={{
                backgroundColor: "white",
                color: "#2563eb",
                border: "2px solid #2563eb",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#2563eb";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
                e.target.style.color = "#2563eb";
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Retour au dashboard
            </button>
            {order.status === "En attente" && (
              <button
                className="btn fw-500"
                onClick={() => handleCancelOrder(order.id)}
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#dc2626";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ef4444";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Annuler la commande
              </button>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default OrderDetails;
