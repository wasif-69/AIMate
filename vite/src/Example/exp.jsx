import { useState } from "react";
import UserList from "../Code/allUser";
import ChatList from "../Code/ChatLIST";
import ChatWindow from "./window";
import "./exp.css";

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [view, setView] = useState("chats");

  const handleSelectUser = (uid, name) => {
    setSelectedUser(uid);
    setSelectedUserName(name);
    setShowSidebar(false);
  };

  return (
    <div className="chat-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? "visible" : "hidden"}`}>
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

      {/* Overlay for mobile */}
      {showSidebar && (
        <div className="overlay" onClick={() => setShowSidebar(false)}></div>
      )}

      {/* Chat Window */}
      <main className="chat-main">
        {selectedUser ? (
          <ChatWindow
            otherUserId={selectedUser}
            otherUserName={selectedUserName}
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
