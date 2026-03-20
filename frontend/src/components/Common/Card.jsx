import React from "react";

const Card = ({ title, children }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      margin: "10px 0",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    }}
  >
    {title && <h3>{title}</h3>}
    <div>{children}</div>
  </div>
);

export default Card;
