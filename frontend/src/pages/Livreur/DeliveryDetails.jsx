import React, { useEffect, useState } from "react";
import { getOrderById, updateOrderStatus } from "../../services/orderService";
import { useParams } from "react-router-dom";

const DeliveryDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(id);
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    await updateOrderStatus(id, newStatus);
    setOrder({ ...order, status: newStatus });
  };

  if (!order) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Livraison #{order.id}</h2>
      <p>Client : {order.clientName}</p>
      <p>Retrait : {order.pickupAddress}</p>
      <p>Livraison : {order.deliveryAddress}</p>
      <p>Distance : {order.distance} km</p>
      <p>Prix : {order.totalPrice} MAD</p>
      <p>Instructions : {order.instructions}</p>

      {order.status === "Assignée au livreur" && (
        <button onClick={() => handleStatusChange("En cours de retrait")}>Commencer le retrait</button>
      )}
      {order.status === "En cours de retrait" && (
        <button onClick={() => handleStatusChange("Récupérée")}>Colis récupéré</button>
      )}
      {order.status === "Récupérée" && (
        <button onClick={() => handleStatusChange("Livrée")}>Marquer comme livrée</button>
      )}
    </div>
  );
};

export default DeliveryDetails;
