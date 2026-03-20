import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <aside
      style={{
        width: "200px",
        backgroundColor: "#3498db",
        color: "#fff",
        padding: "15px",
        minHeight: "100vh",
      }}
    >
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {role === "client" && (
          <>
            <li><Link to="/client/dashboard">Dashboard</Link></li>
            <li><Link to="/client/new-order">Nouvelle commande</Link></li>
            <li><Link to="/client/history">Historique</Link></li>
            <li><Link to="/client/profile">Profil</Link></li>
          </>
        )}
        {role === "livreur" && (
          <>
            <li><Link to="/livreur/dashboard">Dashboard</Link></li>
            <li><Link to="/livreur/deliveries">Mes livraisons</Link></li>
          </>
        )}
        {role === "admin" && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/orders">Commandes</Link></li>
            <li><Link to="/admin/livreurs">Livreurs</Link></li>
            <li><Link to="/admin/clients">Clients</Link></li>
            <li><Link to="/admin/settings">Paramètres</Link></li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
