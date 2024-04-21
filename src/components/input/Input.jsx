import React from "react";
import "./input.css";
function Input({ label, state, setState, placeholder, type }) {
  return (
    <div className="input-wrapper">
      <p className="input-label-input">{label}</p>
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="input-custom-input"
      />
    </div>
  );
}

export default Input;
