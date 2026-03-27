import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import LivreurSidebar from "../../components/Layout/LivreurSidebar";
import Badge from "../../components/Common/Badge";
import { getDeliveryById, updateOrderStatus } from "../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const { setLoading, isLoading } = useLoading();
  const { handleSuccess, handleError } = useError();

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

  const [delivery, setDelivery] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Récupération des données
  useEffect(() => {
    fetchDelivery();
  }, [id]);

  const fetchDelivery = async () => {
    try {
      setLoading("delivery", true);
      const data = await getDeliveryById(id);
      setDelivery(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading("delivery", false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading("updateStatus", true);
      await updateOrderStatus(id, newStatus);
      handleSuccess("Statut mis à jour avec succès");
      setShowStatusModal(false);
      fetchDelivery();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading("updateStatus", false);
    }
  };

  const getStatusBadgeColor = (statut) => {
    const map = {
      livree: "success",
      en_attente: "warning",
      en_retrait: "info",
      assignee: "primary",
      recuperee: "secondary",
      annulee: "danger",
    };
    return map[statut] || "secondary";
  };

  const getStatusLabel = (statut) => {
    const labels = {
      livree: "Livrée",
      en_attente: "En attente",
      en_retrait: "En retrait",
      assignee: "Assignée",
      recuperee: "Récupérée",
      annulee: "Annulée",
    };
    return labels[statut] || statut;
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <LivreurSidebar />

      {/* Main Content */}
      <main
        style={{
          marginLeft: "250px",
          padding: "30px",
          width: "calc(100% - 250px)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#2c3e50", margin: 0 }}>
              <i className="bi bi-box-seam" style={{ marginRight: "12px" }}></i>
              Détails de la livraison
            </h1>
            <p style={{ color: "#7f8c8d", marginTop: "8px", marginBottom: 0 }}>
              Informations complètes sur la commande #{id}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ecf0f1",
              border: "1px solid #bdc3c7",
              borderRadius: "6px",
              color: "#2c3e50",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d5dbdb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ecf0f1";
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Retour
          </button>
        </div>

        {isLoading("delivery") ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner-border text-primary" role="status" style={{ width: "50px", height: "50px" }}>
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p style={{ color: "#7f8c8d", marginTop: "20px" }}>Chargement des détails...</p>
          </div>
        ) : !delivery ? (
          <div
            style={{
              padding: "40px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <i className="bi bi-inbox" style={{ fontSize: "48px", color: "#bdc3c7", marginBottom: "15px" }}></i>
            <p style={{ color: "#7f8c8d", fontSize: "16px" }}>Livraison non trouvée</p>
          </div>
        ) : (
          <>
            {/* Status Card */}
            <div
              style={{
                padding: "25px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                marginBottom: "20px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" }}>
                  Statut actuel
                </p>
                <h3 style={{ color: "#2c3e50", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                  {getStatusLabel(delivery.statut)}
                </h3>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Badge
                  text={delivery.statut}
                  color={getStatusBadgeColor(delivery.statut)}
                />
                <button
                  onClick={() => setShowStatusModal(true)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#229954";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#27ae60";
                  }}
                >
                  <i className="bi bi-pencil"></i>
                  Changer
                </button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Client Information */}
              <div
                style={{
                  padding: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                  <i className="bi bi-person" style={{ marginRight: "8px" }}></i>
                  Informations client
                </h4>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Nom
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.nom_livraison}
                  </p>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Téléphone
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.telephone_livraison || "Non fourni"}
                  </p>
                </div>

                <div>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Email
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.email_livraison || "Non fourni"}
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div
                style={{
                  padding: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                  <i className="bi bi-info-circle" style={{ marginRight: "8px" }}></i>
                  Informations commande
                </h4>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Type de commande
                  </p>
                  <Badge text={delivery.type_commande} color="info" />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Distance
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.distance_km || "Non définie"} km
                  </p>
                </div>

                <div>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Prix
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0, fontWeight: "600" }}>
                    {delivery.prix_livraison || 0} MAD
                  </p>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {/* Pickup Address */}
              <div
                style={{
                  padding: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  borderLeft: "4px solid #f39c12",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                  <i className="bi bi-geo-alt" style={{ marginRight: "8px", color: "#f39c12" }}></i>
                  Adresse de retrait
                </h4>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Contact
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.nom_retrait || "Non fourni"}
                  </p>
                </div>

                <div>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Adresse
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                    {delivery.adresse_retrait || "Non fournie"}
                  </p>
                </div>
              </div>

              {/* Delivery Address */}
              <div
                style={{
                  padding: "25px",
                  backgroundColor: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  borderLeft: "4px solid #27ae60",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                  <i className="bi bi-geo-alt-fill" style={{ marginRight: "8px", color: "#27ae60" }}></i>
                  Adresse de livraison
                </h4>

                <div style={{ marginBottom: "16px" }}>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Contact
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0 }}>
                    {delivery.nom_livraison || "Non fourni"}
                  </p>
                </div>

                <div>
                  <p style={{ color: "#7f8c8d", fontSize: "12px", fontWeight: "600", marginBottom: "6px", textTransform: "uppercase" }}>
                    Adresse
                  </p>
                  <p style={{ color: "#2c3e50", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                    {delivery.adresse_livraison || "Non fournie"}
                  </p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {delivery.instructions_speciales && (
              <div
                style={{
                  padding: "25px",
                  backgroundColor: "#fef8f0",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  borderLeft: "4px solid #f39c12",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "12px" }}>
                  <i className="bi bi-exclamation-circle" style={{ marginRight: "8px", color: "#f39c12" }}></i>
                  Instructions spéciales
                </h4>
                <p style={{ color: "#5d5d5d", fontSize: "14px", margin: 0, lineHeight: "1.6" }}>
                  {delivery.instructions_speciales}
                </p>
              </div>
            )}

            {/* Timeline / Additional Info */}
            <div
              style={{
                padding: "25px",
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                <i className="bi bi-clock-history" style={{ marginRight: "8px" }}></i>
                Historique
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "#27ae60",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-check"></i>
                    </div>
                    <div
                      style={{
                        width: "2px",
                        height: "40px",
                        backgroundColor: "#bdc3c7",
                        marginTop: "8px",
                      }}
                    ></div>
                  </div>
                  <div style={{ paddingTop: "6px" }}>
                    <p style={{ color: "#2c3e50", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      Commande créée
                    </p>
                    <p style={{ color: "#7f8c8d", fontSize: "12px", margin: 0 }}>
                      {delivery.created_at || "Date non disponible"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor:
                          ["assignee", "en_retrait", "recuperee", "livree"].includes(delivery.statut) ?
                            "#27ae60" : "#ecf0f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: ["assignee", "en_retrait", "recuperee", "livree"].includes(delivery.statut) ? "#fff" : "#bdc3c7",
                      }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                  </div>
                  <div style={{ paddingTop: "6px" }}>
                    <p style={{ color: "#2c3e50", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                      Assignée à un livreur
                    </p>
                    <p style={{ color: "#7f8c8d", fontSize: "12px", margin: 0 }}>
                      {["assignee", "en_retrait", "recuperee", "livree"].includes(delivery.statut) ? "Complété" : "En attente"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Status Modal */}
        {showStatusModal && delivery && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setShowStatusModal(false)}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                padding: "30px",
                maxWidth: "400px",
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h5 style={{ fontSize: "18px", fontWeight: "700", color: "#2c3e50", marginBottom: "20px" }}>
                <i className="bi bi-pencil-square" style={{ marginRight: "8px" }}></i>
                Changer le statut
              </h5>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {[
                  { label: "Commencer le retrait", value: "en_retrait", icon: "box-seam" },
                  { label: "Colis récupéré", value: "recuperee", icon: "check-circle" },
                  { label: "Livrée", value: "livree", icon: "check-all" },
                  { label: "Annulée", value: "annulee", icon: "x-circle" },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusUpdate(status.value)}
                    disabled={isLoading("updateStatus")}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "6px",
                      border: "1px solid #bdc3c7",
                      backgroundColor: "#f8f9fa",
                      color: "#2c3e50",
                      cursor: isLoading("updateStatus") ? "not-allowed" : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      opacity: isLoading("updateStatus") ? 0.6 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading("updateStatus")) {
                        e.currentTarget.style.backgroundColor = "#3498db";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.borderColor = "#3498db";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading("updateStatus")) {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                        e.currentTarget.style.color = "#2c3e50";
                        e.currentTarget.style.borderColor = "#bdc3c7";
                      }
                    }}
                  >
                    <i className={`bi bi-${status.icon}`}></i>
                    {status.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  border: "1px solid #bdc3c7",
                  backgroundColor: "#ecf0f1",
                  color: "#2c3e50",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d5dbdb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ecf0f1";
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDetails;
