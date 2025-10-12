import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from 'firebase/firestore';
import "./header_chat.css";

export default function Header_chat() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const [modelname, setModelname] = useState("");
  const [chatStyle, setChatStyle] = useState("");
  const [goals, setGoals] = useState("");
  const [showGoals, setShowGoals] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, 'Student', auth.currentUser.uid, 'models', modelId);
        const data = await getDoc(docRef);

        if (data.exists()) {
          const docData = data.data();
          setModelname(docData.name_model || "");
          setChatStyle(docData.counselor || "");
          setGoals(docData.Goals || "");
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getData();
  }, [modelId]);

  const handleBack = () => navigate("/chatModels");

  return (
    <div className="chat-header-bar">
      <div className="info-group">
        <span className="info">
          <strong>📘 Name:</strong> {modelname}
        </span>
        <span className="info">
          <strong>🎨 Style:</strong> {chatStyle}
        </span>
      </div>

      <div className="button-group">
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => setShowGoals(!showGoals)}>
            🎯 Goals <span className="chevron">{showGoals ? "▲" : "▼"}</span>
          </button>
          <div className={`dropdown-content ${showGoals ? "show" : ""}`}>
            <p>{goals}</p>
          </div>
        </div>

        <button className="back-btn" onClick={handleBack}>⏪ Back</button>
      </div>
    </div>
  );
}
