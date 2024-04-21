import React from "react";
import Header from "../components/header/Header";
import SigninSignup from "../components/signInsignUp/SigninSignup";
import "../App.css";
function Signup() {
  return (
    <div>
      <Header />
      <div className="Signup-wrapper">
        <SigninSignup />
      </div>
    </div>
  );
}

export default Signup;
