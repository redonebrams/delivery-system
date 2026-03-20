import React, { useEffect, useState } from "react";
import { getClients } from "../../services/userService";

const Clients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getClients();
      setClients(data);
    };
    fetchClients();
  }, []);

  return (
    <div>
      <h2>Gestion des Clients</h2>
      <ul>
        {clients.map((c) => (
          <li key={c.id}>
            {c.name} - {c.email} - {c.phone} - {c.ordersCount} commandes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;
