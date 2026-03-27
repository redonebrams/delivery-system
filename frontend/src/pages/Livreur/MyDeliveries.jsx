import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import LivreurSidebar from "../../components/Layout/LivreurSidebar";
import Badge from "../../components/Common/Badge";
import { getMyDeliveries, updateOrderStatus } from "../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const MyDeliveries = () => {
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

  // États
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [filter, setFilter] = useState("tous"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Récupération des données
  useEffect(() => {
    fetchDeliveries();
  }, [user]);

  const fetchDeliveries = async () => {
    if (!user) return;

    try {
      setLoading("deliveries", true);
      const data = await getMyDeliveries();
      const deliveriesArray = Array.isArray(data) ? data : [];
      setDeliveries(deliveriesArray);
      applyFilters(deliveriesArray, "tous", "");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading("deliveries", false);
    }
  };

  // Appliquer les filtres
  const applyFilters = (data, newFilter, search) => {
    let result = data;

    // Filtre par statut
    if (newFilter !== "tous") {
      if (newFilter === "en_cours") {
        result = result.filter((d) =>
          ["assignee", "en_retrait", "recuperee"].includes(d.statut)
        );
      } else if (newFilter === "livree") {
        result = result.filter((d) => d.statut === "livree");
      } else if (newFilter === "en_attente") {
        result = result.filter((d) => d.statut === "en_attente");
      } else if (newFilter === "annulee") {
        result = result.filter((d) => d.statut === "annulee");
      }
    }

    // Recherche
    if (search.trim()) {
      result = result.filter(
        (d) =>
          d.nom_livraison?.toLowerCase().includes(search.toLowerCase()) ||
          d.adresse_livraison?.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toString() === search
      );
    }

    setFilteredDeliveries(result);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    applyFilters(deliveries, newFilter, searchTerm);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(deliveries, filter, value);
  };

  // Pagination
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Modal d'état
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!selectedDelivery) return;

    try {
      setLoading("updateStatus", true);
      await updateOrderStatus(selectedDelivery.id, newStatus);
      handleSuccess("Statut mis à jour avec succès");
      setShowModal(false);
      fetchDeliveries();
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
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#2c3e50", margin: 0 }}>
            <i className="bi bi-boxes" style={{ marginRight: "12px" }}></i>
            Mes livraisons
          </h1>
          <p style={{ color: "#7f8c8d", marginTop: "8px", marginBottom: 0 }}>
            Gérez vos commandes assignées et mettez à jour leur statut.
          </p>
        </div>

        {/* Filtres et Recherche */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Recherche */}
          <div
            style={{
              padding: "15px 20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="bi bi-search" style={{ color: "#7f8c8d" }}></i>
            <input
              type="text"
              placeholder="Rechercher par ID, client ou adresse..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "14px",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Filtres */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              padding: "15px 20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {[
              { label: "Tous", value: "tous" },
              { label: "En attente", value: "en_attente" },
              { label: "En cours", value: "en_cours" },
              { label: "Livrée", value: "livree" },
              { label: "Annulée", value: "annulee" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => handleFilterChange(f.value)}
                style={{
                  padding: "7px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500",
                  backgroundColor: filter === f.value ? "#3498db" : "#ecf0f1",
                  color: filter === f.value ? "#fff" : "#2c3e50",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (filter !== f.value) {
                    e.currentTarget.style.backgroundColor = "#d5dbdb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== f.value) {
                    e.currentTarget.style.backgroundColor = "#ecf0f1";
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            padding: "25px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            marginBottom: "20px",
          }}
        >
          {isLoading("deliveries") ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : paginatedDeliveries.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <i className="bi bi-inbox" style={{ fontSize: "32px", color: "#bdc3c7", marginBottom: "10px" }}></i>
              <p style={{ color: "#7f8c8d", marginTop: "10px" }}>Aucune livraison trouvée</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ecf0f1", backgroundColor: "#f8f9fa" }}>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>ID</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Client</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Type</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Retrait</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Livraison</th>
                      <th style={{ padding: "15px", textAlign: "left", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Statut</th>
                      <th style={{ padding: "15px", textAlign: "center", color: "#7f8c8d", fontWeight: "600", fontSize: "13px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDeliveries.map((delivery) => (
                      <tr key={delivery.id} style={{ borderBottom: "1px solid #ecf0f1", backgroundColor: "#fff" }}>
                        <td style={{ padding: "15px", color: "#2c3e50", fontWeight: "600" }}>
                          #{delivery.id}
                        </td>
                        <td style={{ padding: "15px", color: "#2c3e50" }}>
                          {delivery.nom_livraison}
                          <br />
                          <small style={{ color: "#7f8c8d", fontSize: "12px" }}>
                            {delivery.telephone_livraison}
                          </small>
                        </td>
                        <td style={{ padding: "15px" }}>
                          <Badge text={delivery.type_commande} color="info" />
                        </td>
                        <td style={{ padding: "15px", color: "#7f8c8d", fontSize: "12px" }}>
                          {delivery.adresse_retrait?.substring(0, 25)}...
                        </td>
                        <td style={{ padding: "15px", color: "#7f8c8d", fontSize: "12px" }}>
                          {delivery.adresse_livraison?.substring(0, 25)}...
                        </td>
                        <td style={{ padding: "15px" }}>
                          <Badge
                            text={delivery.statut}
                            color={getStatusBadgeColor(delivery.statut)}
                          />
                        </td>
                        <td style={{ padding: "15px", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <Link
                              to={`/livreur/delivery/${delivery.id}`}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#3498db",
                                color: "#fff",
                                borderRadius: "4px",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                                border: "none",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#2980b9";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#3498db";
                              }}
                            >
                              <i className="bi bi-eye" style={{ marginRight: "4px" }}></i>
                              Détails
                            </Link>
                            <button
                              onClick={() => {
                                setSelectedDelivery(delivery);
                                setShowModal(true);
                              }}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: "#27ae60",
                                color: "#fff",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#229954";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#27ae60";
                              }}
                            >
                              <i className="bi bi-pencil" style={{ marginRight: "4px" }}></i>
                              Statut
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #bdc3c7",
                      backgroundColor: currentPage === 1 ? "#ecf0f1" : "#fff",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      color: "#2c3e50",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    ← Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #bdc3c7",
                        backgroundColor: page === currentPage ? "#3498db" : "#fff",
                        color: page === currentPage ? "#fff" : "#2c3e50",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                      onMouseEnter={(e) => {
                        if (page !== currentPage) {
                          e.currentTarget.style.backgroundColor = "#ecf0f1";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== currentPage) {
                          e.currentTarget.style.backgroundColor = "#fff";
                        }
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #bdc3c7",
                      backgroundColor: currentPage === totalPages ? "#ecf0f1" : "#fff",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      color: "#2c3e50",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de changement de statut */}
        {showModal && selectedDelivery && (
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
            onClick={() => setShowModal(false)}
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
                Changer le statut de la livraison #{selectedDelivery.id}
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
                    onClick={() => handleStatusChange(status.value)}
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
                onClick={() => setShowModal(false)}
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

export default MyDeliveries;
