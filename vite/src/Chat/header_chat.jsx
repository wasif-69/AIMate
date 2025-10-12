import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "./header_chat.css";

export default function HeaderChat() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const [modelName, setModelName] = useState("");
  const [chatStyle, setChatStyle] = useState("");
  const [goals, setGoals] = useState("");
  const [showGoals, setShowGoals] = useState(false);

  const getStyleEmoji = (style) => {
    switch (style.toLowerCase()) {
      case "introvert":
        return "🧘‍♂️";
      case "extrovert":
        return "🎉";
      case "professional":
        return "💼";
      case "friendly":
        return "😊";
      case "funny":
        return "😂";
      default:
        return "🤖";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(
          db,
          "Student",
          auth.currentUser.uid,
          "models",
          modelId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setModelName(data.name_model || "");
          setChatStyle(data.counselor || "");
          setGoals(data.Goals || "");
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [modelId]);

  return (
    <div className="chat-headerr" >
      <div className="chat-info">
        
        <span className="chat-name" data-emoji={getStyleEmoji(chatStyle)}>
          {modelName}
        </span>
      </div>

      <div className="chat-actions">
        <div className="goals-dropdown">
          <button
            className="goals-button"
            onClick={() => setShowGoals(!showGoals)}
            aria-expanded={showGoals}
          >
            🎯 Goals <span className="chevron">{showGoals ? "▲" : "▼"}</span>
          </button>
          {showGoals && (
            <div className="goals-content">
              <p>{goals}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
