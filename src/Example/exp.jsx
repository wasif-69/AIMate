import React, { useEffect, useState } from "react";
import { auth } from "../Firebase/firebaseConfig";
import { Send_message, listenMessage } from "../Firebase/Chats/Chat";
import { onAuthStateChanged } from "firebase/auth";

export default function Msg() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  
  const otherUserId = "81260xY1hzWr8seKfIoRcYvdYSf2";

  // ✅ Wait for Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Start listening to messages only if user exists
  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenMessage(user.uid, otherUserId, setMessages);
    return () => unsubscribe();
  }, [user, otherUserId]);

  const handleSend = async () => {
    if (!text.trim() || !user) return;
    await Send_message(user.uid, otherUserId, text);
    setText("");
  };

  if (!user) {
    return <p>Loading user...</p>; // or redirect to login
  }

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg) => (
          <p
            key={msg.id}
            className={msg.sender === user.uid ? "my-msg" : "other-msg"}
          >
            {msg.text}
          </p>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
