import React, { useState, useEffect } from "react";
import { getTarifs, updateTarifs } from "../../services/orderService";

const Settings = () => {
  const [basePrice, setBasePrice] = useState(15);
  const [pricePerKm, setPricePerKm] = useState(3);

  useEffect(() => {
    const fetchTarifs = async () => {
      const data = await getTarifs();
      setBasePrice(data.basePrice);
      setPricePerKm(data.pricePerKm);
    };
    fetchTarifs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTarifs({ basePrice, pricePerKm });
    alert("Tarifs mis à jour !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Paramètres Système</h2>
      <div>
        <label>Prix de base (MAD)</label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Tarif par kilomètre (MAD)</label>
        <input
          type="number"
          value={pricePerKm}
          onChange={(e) => setPricePerKm(Number(e.target.value))}
        />
      </div>
      <button type="submit">Sauvegarder</button>
    </form>
  );
};

export default Settings;
