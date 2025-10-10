import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../Firebase/firebaseConfig";
import { Send_message, listenMessage } from "../Firebase/Chats/Chat";
import "./chat.css";

export default function UserChat() {
  const { uid } = useParams(); // other user’s id
  const currentUserId = auth.currentUser?.uid;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Listen to messages
  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = listenMessage(currentUserId, uid, setMessages);
    return () => unsubscribe();
  }, [currentUserId, uid]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    setText("");
    await Send_message(currentUserId, uid, text);
  };

  return (
    <section className="chat-box">
      <h2 className="chat-title">Chat with {uid}</h2>

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
              {msg.timestamp?.toDate?.().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </section>
  );
}
