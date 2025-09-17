import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [info, setInfo] = useState(null);
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const userInfo = await getInfo(currentUser.uid);
        setInfo(userInfo);
        setUserState(currentUser);
      } else {
        setUserState(null);
        setInfo(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle login form submit
  const handleForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("mail");
    const password = formData.get("password");

    try {
      const user = await login(email, password);
      const userInfo = await getInfo(user.uid);
      setInfo(userInfo);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
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
    setUserState(null);
  };

  return (
    <div className="login-container">
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : !userState ? (
        <form className="login-form" onSubmit={handleForm}>
          <h2>Login to Your Account</h2>

          <input
            type="email"
            name="mail"
            placeholder="Email"
            required
            autoFocus
            aria-label="Email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            aria-label="Password"
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-filled">
            Login
          </button>
        </form>
      ) : (
        <div className="welcome-card">
          <h2>Welcome back 👋</h2>
          <p>{info?.name ? `Hello, ${info.name}` : "You are logged in!"}</p>
          <button onClick={logOut} className="btn btn-outline">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
