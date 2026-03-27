import React from "react";

const statusColors = {
  "En attente": "warning",
  "Assignée": "info",
  "En cours de retrait": "warning",
  "Récupérée": "info",
  "Livrée": "success",
  "Annulée": "danger",
  "En attente d'affectation": "warning",
  "Assignée au livreur": "info"
};

const StatusBadge = ({ status }) => {
  const color = statusColors[status] || "secondary";
  return (
    <span className={`badge badge-${color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
