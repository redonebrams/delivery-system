import React from "react";

const Badge = ({ text, color = "secondary", className = "" }) => (
  <span className={`badge badge-${color} ${className}`}>
    {text}
  </span>
);

export default Badge;
