import React, { useEffect, useState } from "react";
import { getOrders, assignLivreur } from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Gestion des Commandes</h2>
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Livreur</th>
            <th>Prix</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.clientName}</td>
              <td>{o.type}</td>
              <td>{o.status}</td>
              <td>{o.livreurName || "Non assigné"}</td>
              <td>{o.totalPrice} MAD</td>
              <td>
                <button onClick={() => assignLivreur(o.id, 1)}>Assigner</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
