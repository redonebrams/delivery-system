import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AdminLayout = ({ children, title }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", width: "100%" }}>
      <AdminSidebar />
      <div
        className="flex-grow-1 d-flex flex-column page-container"
        style={{
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          paddingTop: "1.25rem",
          paddingBottom: "1.25rem",
        }}
      >
        {/* Header */}
        {title && (
          <div
            className="mb-4"
            style={{
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "1.25rem",
            }}
          >
            <h1
              style={{
                color: "#1e293b",
                fontSize: "2rem",
                fontWeight: 700,
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.95rem",
                marginTop: "0.5rem",
                marginBottom: 0,
              }}
            >
              Gérez votre plateforme de livraison
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-grow-1">{children}</div>

        {/* Footer */}
        <div
          className="mt-3 text-center"
          style={{
            borderTop: "1px solid #e2e8f0",
            paddingTop: "1.25rem",
            color: "#64748b",
            fontSize: "0.9rem",
          }}
        >
          <p>
            © {new Date().getFullYear()} Delivery System. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
