import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../services/orderService";
import LineChart from "../../components/Charts/LineChart";
import DonutChart from "../../components/Charts/DonutChart";
import BarChart from "../../components/Charts/BarChart";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAdminStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Dashboard Admin</h2>
      <p>Commandes aujourd'hui : {stats.todayOrders}</p>
      <p>En cours : {stats.ongoingOrders}</p>
      <p>Livreurs actifs : {stats.activeLivreurs}</p>
      <p>Revenus aujourd'hui : {stats.revenue} MAD</p>

      <LineChart data={stats.ordersPerDay} />
      <DonutChart data={stats.ordersByStatus} />
      <BarChart data={stats.ordersByType} />
    </div>
  );
};

export default Dashboard;
