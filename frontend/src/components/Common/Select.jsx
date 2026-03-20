import React from "react";

const Select = ({ label, options, value, onChange }) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    <select value={value} onChange={onChange}>
      {options.map((opt, i) => (
        <option key={i} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
