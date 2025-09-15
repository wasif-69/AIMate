import React from "react";
import "./talk.css";
import einsteinImg from "../assets/enistein.png";
import detectiveImg from "../assets/detect (1).png";
import hitlerImg from "../assets/intro.jpg";
import { useNavigate } from "react-router-dom";

export default function TalkWithPersonalities({ setpersonaity }) {
  const navigate = useNavigate();

  const ens = () => {
    setpersonaity("Albert Einstein");
    navigate("/exp");
  };

  const hit = () => {
    setpersonaity("Hitler");
    navigate("/exp");
  };

  const detect = () => {
    setpersonaity("The Detective");
    navigate("/exp");
  };

  return (
    <section className="personalities-section">
      <h2 className="section-title">Talk With Personalities</h2>

      <div className="personalities-grid">
        {/* Einstein */}
        <div className="personality-card card-einstein">
          <img src={einsteinImg} alt="Albert Einstein" />
          <h3>Albert Einstein</h3>
          <p className="role">Physicist</p>
          <p>
            Chat with Einstein about science, curiosity, and the mysteries of the
            universe.
          </p>
          <button onClick={ens}>Talk</button>
        </div>

        {/* Detective */}
        <div className="personality-card card-detective">
          <img src={detectiveImg} alt="Detective" />
          <h3>The Detective</h3>
          <p className="role">Investigator</p>
          <p>
            Solve mysteries and train your mind with a sharp and logical
            detective.
          </p>
          <button onClick={detect}>Talk</button>
        </div>

        {/* Hitler */}
        <div className="personality-card card-hitler">
          <img src={hitlerImg} alt="Hitler" />
          <h3>Hitler</h3>
          <p className="role">Controversial Leader</p>
          <p>
            Learn history with a critical perspective. (Educational purposes only)
          </p>
          <button onClick={hit}>Talk</button>
        </div>
      </div>

      <div className="disclaimer">
        ⚠️ Disclaimer: Conversations with these personalities are AI-simulated
        for learning/entertainment only.
      </div>
    </section>
  );
}
