import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [unread, setUnread] = useState({}); // { userId: count }

  const addUnread = (userId) => {
    setUnread((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
  };

  const clearUnread = (userId) => {
    setUnread((prev) => {
      const updated = { ...prev };
      delete updated[userId];
      return updated;
    });
  };

  return (
    <ChatContext.Provider value={{ unread, addUnread, clearUnread }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
