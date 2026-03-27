import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const OrderCard = ({ order }) => (
  <div className="card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <h3 className="card-title">Commande #{order.id}</h3>
      <StatusBadge status={order.status} />
    </div>
    <p><strong>Type :</strong> {order.type}</p>
    <p><strong>Prix :</strong> {order.totalPrice} MAD</p>
    <Link to={`/client/orders/${order.id}`} className="btn btn-primary">Voir détails</Link>
  </div>
);

export default OrderCard;
