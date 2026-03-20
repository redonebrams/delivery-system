import React from "react";
import StatusBadge from "./StatusBadge";

const OrderCard = ({ order }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    }}
  >
    <h3>Commande #{order.id}</h3>
    <p><strong>Type :</strong> {order.type}</p>
    <p><strong>Retrait :</strong> {order.pickupAddress}</p>
    <p><strong>Livraison :</strong> {order.deliveryAddress}</p>
    <p><strong>Prix :</strong> {order.totalPrice} MAD</p>
    <StatusBadge status={order.status} />
  </div>
);

export default OrderCard;
