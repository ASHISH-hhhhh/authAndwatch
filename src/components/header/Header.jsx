import React, { useEffect } from "react";
import "./header.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebse";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
function Header() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          navigate("/");
          toast.success("Logged Out Sucessfully");
        })
        .catch((error) => {
          // An error happened.
          toast.error(error.message);
        });
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="header-navbar">
      <p className="header-logo">Financely.</p>
      {user && (
        <p className="header-logo header-link" onClick={logoutFnc}>
          Logout
        </p>
      )}
      {/* {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4>Logging In...</h4>
        </div> */}
      {/* )} */}
    </div>
  );
}

export default Header;
