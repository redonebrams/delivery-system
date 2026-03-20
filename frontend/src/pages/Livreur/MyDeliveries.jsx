import React, { useEffect, useState } from "react";
import { getMyDeliveries } from "../../services/orderService";

const MyDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const data = await getMyDeliveries();
      setDeliveries(data);
    };
    fetchDeliveries();
  }, []);

  return (
    <div>
      <h2>Mes Livraisons</h2>
      <ul>
        {deliveries.map((d) => (
          <li key={d.id}>
            Commande #{d.id} - {d.type} - {d.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDeliveries;
