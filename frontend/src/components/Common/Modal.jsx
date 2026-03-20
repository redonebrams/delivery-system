import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
        }}
      >
        <h3>{title}</h3>
        <div>{children}</div>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default Modal;
