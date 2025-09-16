import { useEffect, useState } from "react";
import { auth } from "../Firebase/firebaseConfig";
import { Send_message, listenMessage } from "../Firebase/Chats/Chat";
import "./win.css";

export default function ChatWindow({ otherUserId, onBack }) {
  const currentUserId = auth.currentUser?.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const unsubscribe = listenMessage(currentUserId, otherUserId, setMessages);
    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    await Send_message(currentUserId, otherUserId, text);
    setText("");
  };

  return (
    <div className="chat-window">
      {/* Sticky back button */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ⬅ Back
        </button>
        <h3>Chat</h3>
      </div>

      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.sender === currentUserId ? "sent" : "received"
            }`}
          >
            <p>{msg.text}</p>
            <small>
              {msg.timestamp?.toDate
                ? msg.timestamp.toDate().toLocaleTimeString()
                : ""}
            </small>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}