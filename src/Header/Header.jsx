import React, { useState, useEffect } from "react";
import "./Header.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userState, setUserState] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUserState(currentUser);
      if (currentUser) {
        const info = await getInfo(currentUser.uid);
        setUserInfo(info);
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const getInfo = async (uid) => {
    try {
      const data = await getDoc(doc(db, "Student", uid));
      return data.exists() ? data.data() : null;
    } catch (err) {
      console.error("Error fetching user info:", err);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserInfo(null);
      setUserState(null);
      console.log("User logged out");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const loggedInNav = (
    <>
      <div className="user-greeting">Hello, {userInfo?.Student}</div>

      {/* New Buttons */}
      <Link to="/quicktest">
        <button className="btn btn-outline"> Quick Test!</button>
      </Link>
      <Link to="/chatModels">
        <button className="btn btn-outline">Model Chat</button>
      </Link>
      <Link to="/exp">
        <button className="btn btn-outline">User Chats</button>
      </Link>
      <Link to="/aivoice">
        <button className="btn btn-outline">AI Voice</button>
      </Link>

      {/* Logout */}
      <button className="btn btn-outline" onClick={handleLogout}>
        Logout
      </button>
    </>
  );

  const loggedOutNav = (
    <>
      <Link to="/login">
        <button className="btn btn-outline">Login</button>
      </Link>
      <Link to="/signup">
        <button className="btn btn-filled">Sign Up</button>
      </Link>
    </>
  );

  const homeNavigate = async () => {
    navigate("/");
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo" onClick={homeNavigate}>
        <span className="sparkle">💡</span>
        <h1 className="logo-text">AImate</h1>
      </div>

      {/* Desktop Nav */}
      <nav className="nav">{userState && userInfo ? loggedInNav : loggedOutNav}</nav>

      {/* Mobile Menu Button */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${menuOpen ? "show" : ""}`}>
        {userState && userInfo ? loggedInNav : loggedOutNav}
      </div>
    </header>
  );
}
