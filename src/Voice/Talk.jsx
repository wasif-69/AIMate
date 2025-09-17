import React from "react";
import "./talk.css";
import einsteinImg from "../assets/personality image/ens.jpeg";
import mentorImg from "../assets/personality image/mark.png";
import hitlerImg from "../assets/personality image/hit.jpeg";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebaseConfig";

export default function TalkWithPersonalities({ setPersonality }) {
  const navigate = useNavigate();

  const handleTalk = (personality) => {
    if (!auth.currentUser) {
      alert("⚠️ Please login to talk with personalities.");
      navigate("/login");
      return;
    }
    setPersonality(personality);
    navigate("/personalityChat");
  };

  return (
    <section className="personalities-section">
      <h2 className="section-title">Talk With Personalities</h2>

      <div className="personalities-grid">
        {/* Einstein */}
        <div className="personality-card einstein-theme">
          <img src={einsteinImg} alt="Albert Einstein" />
          <h3>Albert Einstein</h3>
          <p className="role">Physicist</p>
          <p>
            Chat with Einstein about science, curiosity, and the mysteries of the universe.
          </p>
          <button onClick={() => handleTalk("Albert Einstein")}>Talk</button>
        </div>

        {/* Student Mentor */}
        <div className="personality-card mentor-theme">
          <img src={mentorImg} alt="Student Mentor" />
          <h3>Student Mentor</h3>
          <p className="role">Guide & Motivator</p>
          <p>
            Get advice on studies, time management, exams, and building a brighter future.
          </p>
          <button onClick={() => handleTalk("Student Mentor")}>Talk</button>
        </div>

        {/* Hitler */}
        <div className="personality-card hitler-theme">
          <img src={hitlerImg} alt="Hitler" />
          <h3>Hitler</h3>
          <p className="role">Controversial Leader</p>
          <p>
            Learn history with a critical perspective. (Educational purposes only)
          </p>
          <button onClick={() => handleTalk("Hitler")}>Talk</button>
        </div>
      </div>

      <div className="disclaimer">
        ⚠️ Disclaimer: Conversations with these personalities are AI-simulated
        for learning/entertainment only.  
        <br />
        🔑 You must be logged in to chat.
      </div>
    </section>
  );
}
