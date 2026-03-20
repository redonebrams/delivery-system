import React from "react";

const Badge = ({ text, color = "gray" }) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: "12px",
      padding: "5px 10px",
      color: "#fff",
      fontSize: "12px",
    }}
  >
    {text}
  </span>
);

export default Badge;
