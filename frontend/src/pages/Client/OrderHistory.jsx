import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";

const OrderHistory = () => {
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
      <h2>Historique des Commandes</h2>
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Date</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Prix</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>{o.type}</td>
              <td>{o.status}</td>
              <td>{o.totalPrice} MAD</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
