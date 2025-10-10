import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../Firebase/firebaseConfig";
import "./code.css";

export default function UserList({ onSelectUser }) {
  const currentUserId = auth.currentUser?.uid;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const ref = collection(db, "Student");
        const snapshot = await getDocs(ref);
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-grid">
      {users
        .filter((user) => user.id !== currentUserId)
        .map((user) => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => onSelectUser(user.userID)}
          >
            <h3>{user.Student}</h3>
            <p className="institute">{user.ins}</p>
            <p className="email">{user.email}</p>
          </div>
        ))}
    </div>
  );
}
