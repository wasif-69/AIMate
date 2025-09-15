import React, { useState, useRef } from "react";
import { Mic, Loader2 } from "lucide-react"; // simple icons
import "./voice.css";

export default function VoiceRecorder({personality}) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true); // show delivery animation
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");

        const res = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
          personality:personality
        });

        const data = await res.json();
        console.log("Upload Response:", data);

        if (data.filename) {
          const audioUrl = `http://127.0.0.1:5000/uploads/${data.filename}`;
          setAudioUrl(audioUrl);

          const audio = new Audio(audioUrl);
          audio.play();

          audio.onended = () => setLoading(false);
        } else {
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="voice-wrapper">
      <h3 className="voice-title">🎤 Talk to AI</h3>

      {/* Mic button */}
      <button
        className={`mic-btn ${recording ? "recording" : ""}`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? (
          <span className="pulse"></span>
        ) : (
          <Mic size={32} strokeWidth={2.5} />
        )}
      </button>

      {/* AI Response Animation */}
      {loading && (
        <div className="ai-avatar">
          <Loader2 className="spin" size={28} />
          <p>AI is replying...</p>
        </div>
      )}

      {/* Playback */}
      {audioUrl && !loading && (
        <div className="playback">
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
