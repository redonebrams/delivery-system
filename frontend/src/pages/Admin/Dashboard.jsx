import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getOrders } from "../../services/orderService";
import { getClients } from "../../services/userService";
import { useError } from "../../context/ErrorContext";
import { useLoading } from "../../context/LoadingContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaBox, FaCalendarDay, FaTruck, FaUsers, FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const { handleApiError } = useError();
  const { setLoading, isLoading } = useLoading();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading("dashboard", true);

        const [statsData, ordersData, clientsData] = await Promise.all([
          getAdminStats(),
          getOrders(),
          getClients(),
        ]);

        setStats(statsData || {});
        setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 10) : []);
        setClients(Array.isArray(clientsData?.data) ? clientsData.data : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        handleApiError(error);
      } finally {
        setLoading("dashboard", false);
      }
    };

    fetchData();
  }, []);

  if (isLoading("dashboard") || !stats) {
    return (
      <AdminLayout title="Dashboard">
        <div className="text-center py-5">
          <FaSpinner className="spin" size={32} color="#3C5E82" />
          <p className="mt-3 text-muted">Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Livrée":
        return { bg: "#10b981", text: "white" };
      case "En cours":
        return { bg: "#0ea5e9", text: "white" };
      case "Annulée":
        return { bg: "#ef4444", text: "white" };
      case "En attente":
        return { bg: "#f59e0b", text: "white" };
      default:
        return { bg: "#64748b", text: "white" };
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card p-3 d-flex align-items-center">
            <FaBox className="me-3" size={24} color="#3C5E82" />
            <div>
              <h6>Commandes</h6>
              <h3>{stats.totalCommandes || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 d-flex align-items-center">
            <FaCalendarDay className="me-3" size={24} color="#5E82AC" />
            <div>
              <h6>Aujourd'hui</h6>
              <h3>{stats.todayOrders || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 d-flex align-items-center">
            <FaTruck className="me-3" size={24} color="#789ACA" />
            <div>
              <h6>En cours</h6>
              <h3>{stats.ongoingOrders || 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 d-flex align-items-center">
            <FaUsers className="me-3" size={24} color="#82AFE5" />
            <div>
              <h6>Clients</h6>
              <h3>{clients.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <h5>Clients récents</h5>

        {clients.length === 0 ? (
          <p className="text-muted">Aucun client trouvé</p>
        ) : (
          <ul className="list-group">
            {clients.slice(0, 5).map((client) => (
              <li key={client.id} className="list-group-item">
                {client.nom || client.name || "Client"} - {client.email || "-"}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-4">
        <h5>Commandes Récentes</h5>

        {orders.length === 0 ? (
          <p className="text-muted">Aucune commande</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Prix</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = getStatusColor(order.status);
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.nom_retrait}</td>
                    <td>{order.prix_livraison} MAD</td>
                    <td>
                      <span
                        style={{
                          background: status.bg,
                          color: status.text,
                          padding: "5px 10px",
                          borderRadius: "5px",
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;