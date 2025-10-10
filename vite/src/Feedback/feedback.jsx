import { useState, useEffect } from "react";
import { db } from "../Firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./feedback.css";
import mark from "../assets/personality image/mark.png";
import distrub_mark from "../assets/personality image/Page 2.png";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [isDisturb, setIsDisturb] = useState(false); // toggle state

  // Randomly move Mark's picture every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 80) + 10; // between 10% - 90%
      const randomLeft = Math.floor(Math.random() * 80) + 10;
      setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setStatus("⚠️ Please write some feedback first.");
      return;
    }

    try {
      await addDoc(collection(db, "Feedback"), {
        feedback,
        createdAt: serverTimestamp(),
      });
      setFeedback("");
      setStatus("✅ Feedback submitted successfully!");
    } catch (error) {
      console.error("Error saving feedback:", error);
      setStatus("❌ Failed to submit feedback.");
    }
  };

  return (
    <section className="feedback-section">
      <div className="quote-box">
        <h2 className="quote">
          "The biggest risk is not taking any risk. In a world that’s changing
          really quickly, the only strategy that is guaranteed to fail is not
          taking risks."
        </h2>
        <p className="author">— Mark Zuckerberg</p>
      </div>

      {/* Mark Zuckerberg image floating */}
      <img
        src={isDisturb ? distrub_mark : mark} // toggle between images
        alt="Mark Zuckerberg"
        className="zuck-img"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)",
          position: "absolute", // ensure floating works
        }}
        onClick={() => setIsDisturb(!isDisturb)} // toggle on click
      />

      {/* Feedback Form */}
      <form onSubmit={handleSubmit} className="feedback-form">
        <textarea
          placeholder="Write your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button type="submit">Submit Feedback</button>
      </form>

      {status && <p className="status">{status}</p>}
    </section>
  );
}
