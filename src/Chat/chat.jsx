import React, { useState, useEffect, useRef } from "react";
import { savemessage } from "../Firebase/SAVEMessage";
import { auth, db } from "../Firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import "./Chat.css";

export default function Chat() {
  const { modelId } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages in real-time
  useEffect(() => {
    if (!auth.currentUser) return;
    const messagesRef = collection(
      db,
      "Student",
      auth.currentUser.uid,
      "models",
      modelId,
      "Chat"
    );
    const q = query(messagesRef, orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      scrollToBottom();
    });
    return () => unsubscribe();
  }, [modelId]);

  const send = async () => {
    if (!text.trim()) return;

    const userMessage = text; // keep current text
    setText(""); // clear input instantly

    try {
      await savemessage(auth.currentUser.uid, modelId, "User", userMessage);
      await sendMessageToAPI(userMessage);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const fetch_data = async () => {
    try {
      const ref = doc(
        db,
        "Student",
        auth.currentUser.uid,
        "models",
        modelId
      );
      const data_fetched = await getDoc(ref);
      return data_fetched.data();
    } catch {
      console.log("Error fetching Data (in chat.jsx)");
    }
  };

  const sendMessageToAPI = async (userText) => {
    try {
      const fetched_data = await fetch_data();
      const response = await fetch("https://aimateserver.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, ID: fetched_data }),
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
    <div className="chat-container">
      <div className="chat-header">
        <h2>AImate Chat</h2>
      </div>

      <div className="chat-box">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender === "User" ? "user" : "ai"}`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
