import React, { useEffect, useState } from "react";
import { getLivreurStats } from "../../services/userService";

const Dashboard = () => {
  const [stats, setStats] = useState({ today: 0, total: 0, ongoing: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getLivreurStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard Livreur</h2>
      <p>Livraisons aujourd'hui : {stats.today}</p>
      <p>Total livraisons : {stats.total}</p>
      <p>En cours : {stats.ongoing}</p>
    </div>
  );
};

export default Dashboard;
