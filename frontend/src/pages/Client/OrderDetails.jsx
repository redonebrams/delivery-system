import React, { useEffect, useState } from "react";
import { getOrderById } from "../../services/orderService";
import { useParams } from "react-router-dom";
import OrderTimeline from "../../components/Order/OrderTimeline";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(id);
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Détails Commande #{order.id}</h2>
      <p>Type : {order.type}</p>
      <p>Retrait : {order.pickupAddress}</p>
      <p>Livraison : {order.deliveryAddress}</p>
      <p>Prix : {order.totalPrice} MAD</p>
      <OrderTimeline timeline={order.timeline} />
    </div>
  );
};

export default OrderDetails;
