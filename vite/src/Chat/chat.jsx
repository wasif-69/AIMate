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
import EmojiPicker from "emoji-picker-react";

export default function Chat() {
  const { modelId } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatBoxRef = useRef(null);
  const chatEndRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll to bottom if near bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle scroll detection for scroll-to-bottom button
  const handleScroll = () => {
    const box = chatBoxRef.current;
    if (!box) return;

    const distanceFromBottom =
      box.scrollHeight - box.scrollTop - box.clientHeight;
    setShowScrollButton(distanceFromBottom > 150);
  };

  useEffect(() => {
    const box = chatBoxRef.current;
    if (box) {
      box.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (box) box.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);

      if (msgs.length === 0) {
        await savemessage(
          auth.currentUser.uid,
          modelId,
          "AI",
          "Hey There! how can I help you today"
        );
      }

      scrollToBottom();
    });

    return () => unsubscribe();
  }, [modelId]);

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

  const sendMessageToAPI = async (userText) => {
    try {
      const fetched_data = await fetch_data();
      if (!fetched_data) throw new Error("No model data found");

      const response = await fetch("https://aimate-7rdt.onrender.com/chat", {
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
  <div className="chat-page">
    <div className="chat-header">AImate Chat</div>

    <div className="chat-messages" ref={chatBoxRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${msg.sender === "User" ? "user" : "ai"}`}
        >
          <p>{msg.message}</p>
          <span className="timestamp">
            {msg.time?.toDate?.().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}

      {isLoading && (
        <div className="chat-message ai typing-indicator">
          <span>Typing</span>
          <span className="dot one"></span>
          <span className="dot two"></span>
          <span className="dot three"></span>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>

    <div className="chat-input">
      
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        disabled={isLoading}
      />
      <button onClick={send} disabled={isLoading || !text.trim()}>
        {isLoading ? "..." : "Send"}
      </button>
      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={(emojiData) =>
              setText((prev) => prev + emojiData.emoji)
            }
          />
        </div>
      )}
    </div>
  </div>
);

}
