import React from "react";

const statusColors = {
  "En attente d'affectation": "yellow",
  "Assignée au livreur": "blue",
  "En cours de retrait": "orange",
  "Récupérée": "purple",
  "Livrée": "green",
  "Annulée": "red",
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${statusColors[status]}`}>{status}</span>
);

export default StatusBadge;
