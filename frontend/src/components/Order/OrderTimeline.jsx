import React from "react";
import StatusBadge from "./StatusBadge";
import Badge from "../Common/Badge";

const OrderTimeline = ({ timeline = [], currentStatus = "" }) => {
  const statusSteps = [
    { key: "En attente", label: "En attente 🟡", color: "warning" },
    { key: "Assignée", label: "Assignée 🔵", color: "info" },
    { key: "En cours de retrait", label: "En cours de retrait 🟠", color: "warning" },
    { key: "Récupérée", label: "Récupérée 🟣", color: "info" },
    { key: "Livrée", label: "Livrée 🟢", color: "success" },
    { key: "Annulée", label: "Annulée 🔴", color: "danger" }
  ];

  const getStatusClass = (stepKey) => {
    if (currentStatus === stepKey) return "current";
    if (statusSteps.findIndex(s => s.key === stepKey) < statusSteps.findIndex(s => s.key === currentStatus)) return "completed";
    return "pending";
  };

  return (
    <ul className="timeline">
      {statusSteps.map((step, index) => {
        const isCurrent = currentStatus === step.key;
        const event = timeline.find(t => t.status === step.key) || {};
        const statusClass = getStatusClass(step.key);
        
        return (
          <li key={step.key} className={statusClass}>
            <div className="timeline-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StatusBadge status={step.key} />
                <span>{step.label}</span>
              </div>
              {event.date && (
                <small>{new Date(event.date).toLocaleString('fr-FR')}</small>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default OrderTimeline;
