import React from "react";
import "./button.css";
function Button({ text, onClick, blue, disbaled }) {
  return (
    <div
      disbaled={disbaled}
      className={blue ? "button-btn btn-blue" : "button-btn "}
      onClick={onClick}
    >
      {text}
    </div>
  );
}

export default Button;
