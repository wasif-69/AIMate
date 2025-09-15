import React from "react";
import { Link } from "react-router-dom";
import "./create.css";

export default function AddModel() {
  return (
    <div className="addmodel-container">
      <h2 className="addmodel-title">Create Your AI Model</h2>
      <p className="addmodel-subtitle">
        Build personalized AI companions for stress relief, college advice,
        planning your future, and much more.
      </p>

      <div className="addmodel-sections">
        <div className="addmodel-card">
          <h3>Stress-Free Buddy</h3>
          <p>Talk to an AI that helps reduce stress and stay calm.</p>
          <Link to="/createmodel">
            <button className="btn btn-filled">Create Model</button>
          </Link>
        </div>

        <div className="addmodel-card">
          <h3>College Advice</h3>
          <p>Get guidance on studies, college prep, and career choices.</p>
          <Link to="/createmodel">
            <button className="btn btn-filled">Create Model</button>
          </Link>
        </div>

        <div className="addmodel-card">
          <h3>Future Planner</h3>
          <p>Plan your goals and build a smarter future with AI support.</p>
          <Link to="/createmodel">
            <button className="btn btn-filled">Create Model</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
