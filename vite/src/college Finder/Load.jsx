import React from "react";
import "./load.css";

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Finding best universities for you... 🎓✨</p>
    </div>
  );
}
