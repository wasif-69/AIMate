import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [info, setInfo] = useState(null);
  const [userState, setUserState] = useState(null);
  const navigate = useNavigate(); // React Router navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUserState(currentUser);
      if (currentUser) {
        const info = await getInfo(currentUser.uid);
        setInfo(info);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("mail");
    const password = formData.get("password");

    try {
      const user = await login(email, password);
      const info = await getInfo(user.uid);
      setInfo(info);

      // Redirect to home page after successful login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const login = async (email, password) => {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return credentials.user;
  };

  const getInfo = async (uid) => {
    const data = await getDoc(doc(db, "Student", uid));
    return data.exists() ? data.data() : null;
  };

  const logOut = async () => {
    await signOut(auth);
    setInfo(null);
    console.log("Logged out");
  };

  return (
    <div className="login-container">
      {userState === null ? (
        <form className="login-form" onSubmit={handleForm}>
          <h2>Login to Your Account</h2>
          <input type="email" name="mail" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit" className="btn btn-filled">Login</button>
        </form>
      ) : (
        <div className="welcome-card">
          <h2>please wait......</h2>
          
          <button onClick={logOut} className="btn btn-outline">Logout</button>
        </div>
      )}
    </div>
  );
}
