import React from "react";

const Card = ({ title, children, className = "" }) => (
  <div className={`card ${className}`}>
    {title && <h3 className="card-title">{title}</h3>}
    <div>{children}</div>
  </div>
);

export default Card;
