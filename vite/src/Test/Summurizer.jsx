import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import "./Summarizer.css";

export default function Summarizer() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setSubmitted(true);

      const response = await fetch("http://127.0.0.1:5000/imageUploader", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setData(result.message);

      const split = result.message
        .split(/\n+/)
        .filter((line) => line.trim() !== "");
      setFlashcards(split);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    let y = margin;
    doc.setFontSize(14);
    doc.text("My Notes:", margin, y);
    y += 10;

    const lines = doc.splitTextToSize(data, 180);
    lines.forEach((line) => {
      if (y > pageHeight - 10) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 8;
    });

    doc.save("MyNotes.pdf");
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleReset = () => {
    setFile(null);
    setData("");
    setFlashcards([]);
    setCurrentIndex(0);
    setSubmitted(false);
  };

  // 👉 Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextCard(); // swipe left → next
      else prevCard(); // swipe right → prev
    }
  };

  return (
    <div id="summarizer-wrapper" className={submitted ? "fullscreen-mode" : ""}>
      {!submitted && (
        <>
          <h1 className="sr-main-title">Image-to-Flashcard Summarizer</h1>
          <div className="sr-file-upload-area">
            <label htmlFor="sr-file-input" className="sr-file-label">
              {file ? `Selected: ${file.name}` : "📁 Click to Upload Image"}
            </label>
            <input
              type="file"
              id="sr-file-input"
              className="sr-file-input"
              accept="image/*"
              onChange={handleUpload}
            />
          </div>

          <button
            className="sr-upload-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Summarize"}
          </button>
        </>
      )}

      {loading && (
        <div className="sr-loader-box">
          <div className="sr-loader-circle" />
          <p className="sr-loader-text">Summarizing your image... 🧠</p>
        </div>
      )}

      {!loading && data && (
        <div className="sr-output-box">
          <h2 className="sr-heading">Your Notes</h2>

          {/* Mobile Flashcards */}
          {isMobile ? (
            <div
              className="sr-flashcard-area"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                key={currentIndex} // Important for re-rendering animation
                className="sr-flashcard sr-flip"
              >
                <ReactMarkdown>{flashcards[currentIndex]}</ReactMarkdown>
              </div>
              <div className="sr-nav-buttons">
                {/* <button
                  className="sr-nav-btn"
                  onClick={prevCard}
                  aria-label="Previous card"
                >
                  ⬅️
                </button>
                <span>
                  {currentIndex + 1} / {flashcards.length}
                </span>
                <button
                  className="sr-nav-btn"
                  onClick={nextCard}
                  aria-label="Next card"
                >
                  ➡️
                </button> */}
              </div>
            </div>
          ) : (
            <div className="sr-notes-box sr-fade">
              <ReactMarkdown>{data}</ReactMarkdown>
            </div>
          )}

          <div className="sr-action-buttons">
            <button className="sr-action-btn" onClick={handleDownload}>
              Download PDF
            </button>
            <button className="sr-action-btn" onClick={handleReset}>
              Summarize Another File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
