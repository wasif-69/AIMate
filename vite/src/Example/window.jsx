import { useEffect, useState, useRef } from "react";
import { auth } from "../Firebase/firebaseConfig";
import { Send_message, listenMessage } from "../Firebase/Chats/Chat";
import { useChat } from "./Chatcontst"; // ✅ import
import "./win.css";

export default function ChatWindow({ otherUserId, otherUserName, onBack }) {
  const currentUserId = auth.currentUser?.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);
  const { clearUnread } = useChat();

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    const unsubscribe = listenMessage(currentUserId, otherUserId, (msgs) => {
      setMessages(msgs);
      clearUnread(otherUserId); // clear notifications when opened
    });
    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (text.trim() === "") return;
    await Send_message(currentUserId, otherUserId, text);
    setText("");
    setTimeout(scrollToBottom, 100);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ⬅ Back
        </button>
        <h3>{otherUserName || "Chat"}</h3>
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
        <div ref={chatEndRef} />
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
