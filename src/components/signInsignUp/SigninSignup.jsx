import React, { useState } from "react";
import Input from "../input/Input";
import "./signinsignup.css";
import Button from "../buttons/Button";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, doc, provider } from "../../firebse";
import { useNavigate } from "react-router-dom";
import { getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";

function SigninSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginform] = useState(false);
  const signUpEmailfunc = () => {
    setLoading(true);
    console.log(name, email, password, "Account created");
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log(user);
            toast.success("User Created");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            setLoading(false);
            navigate("/dashboard");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Please Correctly confirm your password");
        setLoading(false);
      }
    } else {
      toast.error("Fill the Valid Credentials");
      setLoading(false);
    }
  };
  const createDoc = async (user) => {
    //make sure doc with the same uid doesn't exist
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created");
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Doc Already Exists");
    }
  };
  const loginEmailfunc = () => {
    setLoading(true);
    console.log(email, password);
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          console.log(user);
          setLoading(false);
          toast.success("Logging In...");
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("Enter Valid Credentials");
      setLoading(false);
    }
  };

  const googleSignIn = () => {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          createDoc(user);
          console.log("Google User>> :", user);
          setLoading(false);
          navigate("/dashboard");
          toast.success("User Logged in");
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          toast.error(errorMessage);
          setLoading(false);

          // ...
        });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      {loginForm ? (
        <>
          <div className="signup-wrapper">
            <h2 className="signup-title">
              Login on <span style={{ color: "var(--theme)" }}>Financely.</span>{" "}
            </h2>
            <form>
              <Input
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"AshishBiardar@gmail.com"}
                type="email"
              />
              <Input
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"AshishBiardar@123"}
                type="password"
              />

              <div className="btn-par">
                <Button
                  disabled={loading}
                  text={
                    loading ? "Loading..." : "Login using email and password"
                  }
                  onClick={loginEmailfunc}
                />
                <p className="p-login">or</p>
                <Button
                  onClick={googleSignIn}
                  text={loading ? "Loading..." : "Login using Google"}
                  blue={true}
                />
              </div>
              <p className="p-login" onClick={() => setLoginform(!loginForm)}>
                Don't Have an Account ? Click here
              </p>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="signup-wrapper">
            <h2 className="signup-title">
              Sign Up on{" "}
              <span style={{ color: "var(--theme)" }}>Financely.</span>{" "}
            </h2>
            <form>
              <Input
                label={"Fullname"}
                state={name}
                setState={setName}
                placeholder={"Ashish Biardar"}
                type="text"
              />
              <Input
                label={"Email"}
                state={email}
                setState={setEmail}
                placeholder={"AshishBiardar@gmail.com"}
                type="email"
              />
              <Input
                label={"Password"}
                state={password}
                setState={setPassword}
                placeholder={"AshishBiardar@123"}
                type="password"
              />
              <Input
                label={"Confirm Password"}
                state={confirmPassword}
                setState={setConfirmPassword}
                placeholder={"AshishBiardar@123"}
                type="password"
              />
              <div className="btn-par">
                <Button
                  disabled={loading}
                  text={
                    loading ? "Loading..." : "Sign Up using email and password"
                  }
                  onClick={signUpEmailfunc}
                />
                <p className="p-login">or</p>
                <Button
                  onClick={googleSignIn}
                  text={loading ? "Loading..." : "Sign Up using Google"}
                  blue={true}
                />
              </div>
              <p className="p-login" onClick={() => setLoginform(!loginForm)}>
                Have an Account Already ? Click here
              </p>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default SigninSignup;
