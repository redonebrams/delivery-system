import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import StatusBadge from "../../components/Order/StatusBadge";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data.filter((o) => o.status !== "Livrée" && o.status !== "Annulée"));
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Mes Commandes Actives</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            #{o.id} - {o.type} - <StatusBadge status={o.status} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
