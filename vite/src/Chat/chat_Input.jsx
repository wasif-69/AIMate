import React, { useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import {
  collection,
  query,
  doc,
  getDoc,
  limit,
  getDocs,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { savemessage } from "../Firebase/SAVEMessage";
import EmojiPicker from "emoji-picker-react"; // ✅ NEW IMPORT
import "./chat_Input.css"; // Make sure you style emoji btn etc.

export default function Chat_Input({ setIsLoading, isLoading }) {
  const [text, setText] = useState("");
  const { modelId } = useParams();



  const send = async () => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setText("");
    setIsLoading(true);

    try {
      await savemessage(auth.currentUser.uid, modelId, "User", userMessage);
      await sendMessageToAPI(userMessage);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetch_data = async () => {
    try {
      const ref = doc(db, "Student", auth.currentUser.uid, "models", modelId);
      const data_fetched = await getDoc(ref);
      return data_fetched.data();
    } catch (error) {
      console.log("Error fetching Data (in chat.jsx)", error);
      return null;
    }
  };

  const getFirstThreeDocs = async (uid) => {
    const q = query(
      collection(db, "Student", uid, "models", modelId, "Chat"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);

    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return docs;
  };

  const sendMessageToAPI = async (userText) => {
    try {
      const fetched_data = await fetch_data();
      if (!fetched_data) throw new Error("No model data found");
      const history = await getFirstThreeDocs(auth.currentUser.uid);
      const response = await fetch("https://aimate-7rdt.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          ID: fetched_data,
          history: history,
        }),
      });

      const data = await response.json();
      if (data.message) {
        await savemessage(auth.currentUser.uid, modelId, "AI", data.message);
      }
    } catch (err) {
      console.error("Error calling API:", err);
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input">
        

        {/* Input Field */}
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={isLoading}
        />

        {/* Send Button */}
        <button onClick={send} disabled={isLoading || !text.trim()}>
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
