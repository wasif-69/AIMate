import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

export default function Signin() {
  const [info, setInfo] = useState(null);
  const [userState, setUserState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUserState(currentUser);
      if (currentUser) {
        const info = await getInfo(currentUser.uid);
        setInfo(info);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");
    const date = formData.get("date");
    const student = formData.get("Student");
    const school = formData.get("school");
    const model = formData.get("model");

    try {
      await registerNewUser(email, password, date, student, school, model);
      console.log("User registered successfully!");
      navigate("/"); // redirect to homepage after registration
    } catch (err) {
      console.error("Error registering user:", err);
    }
  };

  const registerNewUser = async (email, password, date, studentName, institute, modelInfo) => {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredentials.user;

    await setDoc(doc(db, "Student", user.uid), {
      userID: user.uid,
      email,
      date,
      Student: studentName,
      ins: institute,
      model: modelInfo,
    });

    return user;
  };

  const getInfo = async (uid) => {
    const data = await getDoc(doc(db, "Student", uid));
    return data.exists() ? data.data() : null;
  };

  return (
    <div className="signin-container">
      {userState === null ? (
        <form className="signin-form" onSubmit={handleForm}>
          <h2>Register Your Account</h2>

          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <input type="date" name="date" placeholder="Date of Birth" required />
          <input type="text" name="Student" placeholder="Full Name" required />
          <input type="text" name="school" placeholder="School / Institute" required />
          <textarea name="model" rows="4" placeholder="Tell us about yourself..." required></textarea>

          <button type="submit" className="btn btn-filled">Register</button>
        </form>
      ) : (
        <div className="welcome-card">
          <h2>please wait......</h2>
        </div>
      )}
    </div>
  );
}
