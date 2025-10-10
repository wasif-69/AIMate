import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import "./alluser.css";

export default function ChatList({ onSelectUser }) {
  const currentUserId = auth.currentUser?.uid;
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsRef = collection(db, "Student", currentUserId, "Chats");
        const chatsSnapshot = await getDocs(chatsRef);

        const chatList = await Promise.all(
          chatsSnapshot.docs.map(async (chatDoc) => {
            const chatData = chatDoc.data();

            // Fetch other user's profile
            const otherUserRef = doc(db, "Student", chatData.with);
            const otherUserSnap = await getDoc(otherUserRef);
            const otherUser = otherUserSnap.exists()
              ? otherUserSnap.data()
              : { Student: "Unknown", email: "N/A" };

            // Fetch last message from Chat subcollection
            const messagesRef = collection(db, "Chats", chatDoc.id, "Messages");
            const lastMessageQuery = query(
              messagesRef,
              orderBy("time", "desc"),
              limit(1)
            );
            const lastMessageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage =
              lastMessageSnapshot.docs[0]?.data()?.message || "";

            return {
              id: chatDoc.id,
              with: chatData.with,
              user: otherUser,
              lastMessage,
            };
          })
        );

        setChats(chatList);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [currentUserId]);

  return (
    <div className="chat-list-section">
      <h2 className="title">Chats</h2>
      {chats.length === 0 ? (
        <p className="empty">No chats yet</p>
      ) : (
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="chat-card"
              onClick={() => onSelectUser(chat.with)}
            >
              
              <div className="chat-card-header">
                <h3>{chat.user.Student}</h3>
                <p className="email">{chat.user.email}</p>
              </div>
              <p className="last-message">
                {chat.lastMessage || "No messages yet"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
