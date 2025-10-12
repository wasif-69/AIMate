// import React from "react";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { savemessage } from "../Firebase/SAVEMessage";
import { auth, db } from "../Firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./chat_text.css"

export default function Chat_text({isLoading}) {
  const { modelId } = useParams();
  
  const [messages, setMessages] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatBoxRef = useRef(null);
  const chatEndRef = useRef(null);
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

  

  return (
    <div>
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
    </div>
  );
}
