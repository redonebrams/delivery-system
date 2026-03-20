import React, { useEffect, useState } from "react";
import { getLivreurs, createLivreur } from "../../services/userService";

const Livreurs = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchLivreurs = async () => {
      const data = await getLivreurs();
      setList(data);
    };
    fetchLivreurs();
  }, []);

  return (
    <div>
      <h2>Gestion des Livreurs</h2>
      <ul>
        {list.map((l) => (
          <li key={l.id}>
            {l.name} - {l.status} - {l.totalDeliveries} livraisons
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Livreurs;
