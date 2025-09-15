import React, { useState } from "react";
import { addModelToData } from "../Firebase/model";
import { auth } from "../Firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./model.css";

// Assets
import stress from "../assets/stress.jpg";
import conseller from "../assets/conseller.jpg";
import planner from "../assets/planner.png";
import intro from "../assets/intro.jpg";
import extro from "../assets/extro.jpg";
import professional from "../assets/pro.png";

export default function ModelForm() {
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const [type, setType] = useState("");
  const [goals, setGoals] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !style || !type || !goals) {
      alert("⚠️ Please fill out all fields.");
      return;
    }

    try {
      const modelID = await addModelToData(
        auth.currentUser.uid,
        name,
        style,
        goals,
        type
      );
      setName("");
      setStyle("");
      setType("");
      setGoals("");
      navigate(`/chat/${modelID}`);
    } catch (e) {
      console.error("ERROR:", e);
      alert("❌ Failed to add model.");
    }
  };

  return (
    <div className="form-wrapper">
      <form className="model-form" onSubmit={handleSubmit}>
        <h2 className="form-title">🚀 Create Your AI Model</h2>

        {/* Model Name */}
        <div className="input-group">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="name">Model Name</label>
        </div>

        {/* Style Selection */}
        <h4 className="section-title">Choose Style</h4>
        <div className="options-grid">
          <div
            className={`option-card ${style === "Introvert" ? "selected" : ""}`}
            onClick={() => setStyle("Introvert")}
          >
            <img src={intro} alt="Introvert" />
            <span>Introvert</span>
          </div>
          <div
            className={`option-card ${style === "Extrovert" ? "selected" : ""}`}
            onClick={() => setStyle("Extrovert")}
          >
            <img src={extro} alt="Extrovert" />
            <span>Extrovert</span>
          </div>
          <div
            className={`option-card ${style === "Professional" ? "selected" : ""}`}
            onClick={() => setStyle("Professional")}
          >
            <img src={professional} alt="Professional" />
            <span>Professional</span>
          </div>
        </div>

        {/* Type Selection */}
        <h4 className="section-title">Choose Type</h4>
        <div className="options-grid">
          <div
            className={`option-card ${type === "Stress Manager" ? "selected" : ""}`}
            onClick={() => setType("Stress Manager")}
          >
            <img src={stress} alt="Stress Manager" />
            <span>Stress Manager</span>
          </div>
          <div
            className={`option-card ${type === "Counselor" ? "selected" : ""}`}
            onClick={() => setType("Counselor")}
          >
            <img src={conseller} alt="Counselor" />
            <span>Counselor</span>
          </div>
          <div
            className={`option-card ${type === "Planner" ? "selected" : ""}`}
            onClick={() => setType("Planner")}
          >
            <img src={planner} alt="Planner" />
            <span>Planner</span>
          </div>
        </div>

        {/* Goals */}
        <div className="input-group">
          <textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            required
          />
          <label htmlFor="goals">Goals</label>
        </div>

        <button type="submit" className="btn-submit">
          Create Model
        </button>
      </form>
    </div>
  );
}
