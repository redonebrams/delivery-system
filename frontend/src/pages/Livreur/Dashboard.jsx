import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import LivreurSidebar from "../../components/Layout/LivreurSidebar";
import Badge from "../../components/Common/Badge";
import LineChart from "../../components/Charts/LineChart";
import { getLivreurStats, getMyDeliveries } from "../../services/userService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const { setLoading, isLoading } = useLoading();
  const { handleApiError } = useError();

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
  const [stats, setStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    pending: 0,
    today: 0,
    deliveries: [],
    loading: true,
  });

  // Récupération de données
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading("dashboard", true);
      
      // Récupérer les données en parallèle
      const [statsData, deliveriesData] = await Promise.all([
        getLivreurStats(),
        getMyDeliveries(),
      ]);

      const deliveries = Array.isArray(deliveriesData) ? deliveriesData : [];

      // Calcul des statistiques
      const completed = deliveries.filter((d) => d.statut === "livree").length;
      const ongoing = deliveries.filter((d) =>
        ["assignee", "en_retrait", "recuperee"].includes(d.statut)
      ).length;
      const pending = deliveries.filter((d) => d.statut === "en_attente").length;
      const total = deliveries.length;
      const today = statsData?.today || 0;

      setStats({
        total,
        ongoing,
        completed,
        pending,
        today,
        deliveries,
        loading: false,
      });
    } catch (err) {
      handleApiError(err);
      setStats((prev) => ({ ...prev, loading: false }));
    } finally {
      setLoading("dashboard", false);
    }
  };

  // Données pour le graphique
  const chartData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"],
    datasets: [
      {
        label: "Livraisons complétées",
        data: [12, 19, 8, 15, 14],
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        tension: 0.4,
      },
      {
        label: "Livraisons en cours",
        data: [5, 8, 4, 6, 7],
        borderColor: "#f39c12",
        backgroundColor: "rgba(243, 156, 18, 0.1)",
        tension: 0.4,
      },
    ],
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
            <i className="bi bi-speedometer2" style={{ marginRight: "12px" }}></i>
            Tableau de bord
          </h1>
          <p style={{ color: "#7f8c8d", marginTop: "8px", marginBottom: 0 }}>
            Bienvenue, <strong>{user?.prenom}</strong>! Voici votre vue d'ensemble.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Total Livraisons */}
          <div
            style={{
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderLeft: "5px solid #3498db",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#7f8c8d", margin: 0, marginBottom: "8px" }}>
                  Total Livraisons
                </p>
                <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#3498db", margin: 0 }}>
                  {stats.total}
                </h3>
              </div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(52, 152, 219, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-boxes" style={{ fontSize: "24px", color: "#3498db" }}></i>
              </div>
            </div>
          </div>

          {/* Livraisons En Cours */}
          <div
            style={{
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderLeft: "5px solid #f39c12",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#7f8c8d", margin: 0, marginBottom: "8px" }}>
                  En cours
                </p>
                <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#f39c12", margin: 0 }}>
                  {stats.ongoing}
                </h3>
              </div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(243, 156, 18, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-clock" style={{ fontSize: "24px", color: "#f39c12" }}></i>
              </div>
            </div>
          </div>

          {/* Livraisons Complétées */}
          <div
            style={{
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderLeft: "5px solid #27ae60",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#7f8c8d", margin: 0, marginBottom: "8px" }}>
                  Complétées
                </p>
                <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#27ae60", margin: 0 }}>
                  {stats.completed}
                </h3>
              </div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(39, 174, 96, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-check-circle" style={{ fontSize: "24px", color: "#27ae60" }}></i>
              </div>
            </div>
          </div>

          {/* Aujourd'hui */}
          <div
            style={{
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderLeft: "5px solid #9b59b6",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <p style={{ fontSize: "14px", color: "#7f8c8d", margin: 0, marginBottom: "8px" }}>
                  Aujourd'hui
                </p>
                <h3 style={{ fontSize: "32px", fontWeight: "700", color: "#9b59b6", margin: 0 }}>
                  {stats.today}
                </h3>
              </div>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(155, 89, 182, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="bi bi-calendar-day" style={{ fontSize: "24px", color: "#9b59b6" }}></i>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              padding: "25px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#2c3e50", marginBottom: "20px" }}>
              <i className="bi bi-graph-up" style={{ marginRight: "8px" }}></i>
              Tendance des livraisons
            </h5>
            <LineChart data={chartData} />
          </div>
        </div>

        {/* Livraisons récentes */}
        <div
          style={{
            padding: "25px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#2c3e50", marginBottom: "20px" }}>
            <i className="bi bi-hourglass-split" style={{ marginRight: "8px" }}></i>
            Livraisons récentes
          </h5>

          {stats.loading || isLoading("dashboard") ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : stats.deliveries.length === 0 ? (
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
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ecf0f1" }}>
                    <th style={{ padding: "12px", textAlign: "left", color: "#7f8c8d", fontWeight: "600" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#7f8c8d", fontWeight: "600" }}>Client</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#7f8c8d", fontWeight: "600" }}>Adresse</th>
                    <th style={{ padding: "12px", textAlign: "left", color: "#7f8c8d", fontWeight: "600" }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.deliveries.slice(0, 5).map((delivery) => (
                    <tr key={delivery.id} style={{ borderBottom: "1px solid #ecf0f1" }}>
                      <td style={{ padding: "12px", color: "#2c3e50", fontWeight: "500" }}>#{delivery.id}</td>
                      <td style={{ padding: "12px", color: "#2c3e50" }}>{delivery.nom_livraison}</td>
                      <td style={{ padding: "12px", color: "#7f8c8d", fontSize: "13px" }}>
                        {delivery.adresse_livraison?.substring(0, 30)}...
                      </td>
                      <td style={{ padding: "12px" }}>
                        <Badge
                          text={delivery.statut}
                          color={getStatusBadgeColor(delivery.statut)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;