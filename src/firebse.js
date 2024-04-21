import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyrG2AkAjQ8camGp1PeFRAYxyJh_ZxwrQ",
  authDomain: "financely-29048.firebaseapp.com",
  projectId: "financely-29048",
  storageBucket: "financely-29048.appspot.com",
  messagingSenderId: "762183134771",
  appId: "1:762183134771:web:8195c101380c61aec9fd46",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { auth, db, provider, doc, setDoc };
