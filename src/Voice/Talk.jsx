import React, { useState } from "react";
import "./talk.css";
import einsteinImg from "../assets/personality image/ens.jpeg";
import mentorImg from "../assets/personality image/mark.png";
import hitlerImg from "../assets/personality image/hit.jpeg";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebaseConfig";
import { motion } from "framer-motion";
import LoginModal from "./loginmodel";

export default function TalkWithPersonalities({ setPersonality }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleTalk = (personality) => {
    if (!auth.currentUser) {
      setShowModal(true);
      // navigate("/login");
      return;
    }
    setPersonality(personality);
    navigate("/personalityChat");
  };

  const personalities = [
    {
      name: "Albert Einstein",
      image: einsteinImg,
      role: "Physicist",
      description:
        "Chat with Einstein about science, creativity, and the mysteries of the universe.",
      theme: "einstein-theme",
    },
    {
      name: "Student Mentor",
      image: mentorImg,
      role: "Guide & Motivator",
      description:
        "Get advice on studies, productivity, and how to build a brighter future.",
      theme: "mentor-theme",
    },
    {
      name: "Adolf Hitler",
      image: hitlerImg,
      role: "Historical Figure (1930s–1940s)",
      description:
        "Understand history from a critical and educational lens. (Simulated AI character)",
      theme: "hitler-theme",
    },
  ];

  return (
    

    <motion.section
      className="personalities-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <section className="personalities-section">
      <h2 className="section-title">Talk With Personalities</h2>
      <p className="section-subtitle">
        Choose a personality to simulate a guided conversation powered by AI.
      </p>

      <div className="personalities-grid">
        {personalities.map(({ name, image, role, description, theme }) => (
          <div key={name} className={`personality-card ${theme}`}>
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p className="role">{role}</p>
            <p>{description}</p>
            <button onClick={() => handleTalk(name)}>Talk</button>
          </div>
        ))}
      </div>

      <div className="disclaimer">
        ⚠️ <strong>Disclaimer:</strong> These AI personalities are fictional
        simulations for educational and entertainment purposes only.
        <br />
        🔒 You must be logged in to start a conversation.
        <br />
        📚 Historical figures are presented with critical context and are not intended to promote any ideology.
      </div>
    </section>
    {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onLoginRedirect={() => {
            setShowModal(false);
            navigate("/login");
          }}
        />
      )}
    </motion.section>
  );
}
