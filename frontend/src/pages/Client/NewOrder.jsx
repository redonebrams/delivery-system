import React, { useState } from "react";
import { createOrder } from "../../services/orderService";
import { calculatePrice } from "../../utils/priceCalculator";

const NewOrder = () => {
  const [form, setForm] = useState({
    type: "Restaurant",
    pickupName: "",
    pickupPhone: "",
    pickupAddress: "",
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    distance: 0,
    instructions: "",
    paymentMode: "Cash",
  });

  const basePrice = 15;
  const pricePerKm = 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = calculatePrice(form.distance, basePrice, pricePerKm);
    const orderData = { ...form, totalPrice };
    await createOrder(orderData);
    alert("Commande créée avec succès !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nouvelle Commande</h2>
      <input
        type="text"
        placeholder="Nom du contact retrait"
        value={form.pickupName}
        onChange={(e) => setForm({ ...form, pickupName: e.target.value })}
      />
      {/* autres champs similaires */}
      <button type="submit">Créer la commande</button>
    </form>
  );
};

export default NewOrder;
