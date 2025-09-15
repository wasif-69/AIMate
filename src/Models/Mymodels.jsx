import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../Firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./MyModels.css";

export default function MyModels() {
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      if (!auth.currentUser) return;
      try {
        const modelsRef = collection(db, "Student", auth.currentUser.uid, "models");
        const snapshot = await getDocs(modelsRef);
        const modelsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModels(modelsData);
      } catch (err) {
        console.error("Error fetching models:", err);
      }
    };

    fetchModels();
  }, []);

  const continueChat = (modelId) => {
    navigate(`/chat/${modelId}`);
  };

  return (
    <div className="models-container">
      <h2>My Chatbots</h2>
      {models.length === 0 ? (
        <p className="no-models">You have no chatbots yet. Create one!</p>
      ) : (
        <div className="models-grid">
          {models.map((model) => (
            <div key={model.id} className="model-card">
              <div className="model-header">
                <h3>{model.name_model}</h3>
                <span className="model-type">{model.type}</span>
              </div>
              <p className="model-goals">{model.Goals}</p>
              <button onClick={() => continueChat(model.id)}>Continue Chat</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
