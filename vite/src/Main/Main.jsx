import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { auth } from "../Firebase/firebaseConfig";
import { Link } from "react-router-dom";
import "./main.css";
import robot from "../assets/personality image/robot (2).png"

export default function Main() {
  const [user, setUser] = useState(null);

  useEffect(() => {

    const wakeup=async ()=>{
      const response = await fetch("https://aimate-7rdt.onrender.com/ping");
      console.log("API wake-up ping sent", response.status);
    }

    wakeup();

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="hero-container">
      {/* Robot Image */}
      <motion.img
        src={robot} // put robot.png inside /public/images
        alt="AI Robot"
        className="hero-robot"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      {/* Title */}
      <h1 className="hero-title">
        Meet <span className="highlight">AImate</span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Your AI companion — always ready to chat, assist, and grow with you.
      </p>

      {/* Buttons - conditional */}
      <div className="hero-buttons">
        {!user ? (
          <Link to="/signup">
            <button className="btn-primary">Sign up to Get Started</button>
          </Link>
        ) : (
          <>
            <Link to="/chatModels">
              <button className="btn-primary">Model Chat</button>
            </Link>
            <Link to="/quicktest">
              <button className="btn-secondary">Take Test</button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
