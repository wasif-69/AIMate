import React from "react";
import "./main.css";
import bgImage from "../assets/robot5.png"; // Background image (AI-themed)

export default function Main() {
  return (
    <main
      className="main"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay">
        <div className="hero-content">
          <h1>
            Welcome to <span className="highlight">AImate</span>
          </h1>
          <p className="subtitle">
            Your personal AI companion for <br />
            stress relief, guidance, and future planning.
          </p>
          <div className="actions">
            <button className="btn btn-filled">🚀 Get Started</button>
            <button className="btn btn-outline">💡 Learn More</button>
          </div>
        </div>
      </div>
    </main>
  );
}
