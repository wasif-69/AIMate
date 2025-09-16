import { useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
            const otherUserRef = doc(db, "Student", chatData.with);
            const otherUserSnap = await getDoc(otherUserRef);
            const otherUser = otherUserSnap.exists()
              ? otherUserSnap.data()
              : { Student: "Unknown" };

            return { id: chatDoc.id, with: chatData.with, user: otherUser };
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
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="chat-card"
          onClick={() => onSelectUser(chat.with)}
        >
          <h3>{chat.user.Student}</h3>
        </div>
      ))}
    </div>
  );
}
