import React from "react";

const Footer = () => (
  <footer
    style={{
      backgroundColor: "#2c3e50",
      color: "#fff",
      textAlign: "center",
      padding: "10px",
      marginTop: "20px",
    }}
  >
    <p>© {new Date().getFullYear()} Delivery App - Tous droits réservés</p>
  </footer>
);

export default Footer;
