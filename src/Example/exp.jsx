// ChatLayout.jsx
import { useState } from "react";
import UserList from "../Code/allUser";
import ChatList from "../Code/ChatLIST";
import ChatWindow from "./window"; // we'll create this
import "./exp.css";


export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [view, setView] = useState("chats"); // "chats" or "users"

  const handleSelectUser = (uid) => {
    setSelectedUser(uid);
    setShowSidebar(false);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "visible" : "hidden"}`}>
        {/* Sidebar header */}
        <div className="sidebar-header">
          {view === "users" && (
            <button className="back-btn" onClick={() => setView("chats")}>
              ⬅ Back
            </button>
          )}
          <h2>{view === "chats" ? "Chats" : "Users"}</h2>
        </div>

        {view === "chats" ? (
          <>
            <ChatList onSelectUser={handleSelectUser} />
            <button className="switch-btn" onClick={() => setView("users")}>
              ➕ New Chat
            </button>
          </>
        ) : (
          <UserList onSelectUser={handleSelectUser} />
        )}
      </aside>

      {/* Chat Window */}
      <main className="chat-main">
        {selectedUser ? (
          <ChatWindow
            otherUserId={selectedUser}
            onBack={() => setShowSidebar(true)}
          />
        ) : (
          <div className="empty-chat">
            <h3>Select a user to start chatting 💬</h3>
          </div>
        )}
      </main>
    </div>
  );
}