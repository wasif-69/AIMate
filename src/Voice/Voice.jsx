import React, { useState, useRef } from "react";
import { Mic, Loader2, Volume2 } from "lucide-react";
import "./voice.css";

export default function VoiceRecorder({ personality }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState(""); // AI text reply
  const [speaking, setSpeaking] = useState(false);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true);
        setMessage(""); // reset previous reply
        setSpeaking(false);

        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");
        formData.append("personality", personality);

        const res = await fetch("https://aimateserver.onrender.com/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("Upload Response:", data);

        if (data.filename) {
          setMessage(data.message); // show AI’s text reply
          const audioUrl = `https://aimateserver.onrender.com/${data.filename}`;
          setAudioUrl(audioUrl);

          const audio = new Audio(audioUrl);
          setSpeaking(true);
          audio.play();

          audio.onended = () => {
            setSpeaking(false);
            setLoading(false);
          };
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
    <div className="voice-page">
      {/* Stickers */}
      <span className="sticker sticker1">🤖</span>
      <span className="sticker sticker2">🎧</span>
      <span className="sticker sticker3">✨</span>

      <div className="voice-card">
        <h2 className="voice-title">🎤 Talk to AI</h2>
        <p className="personality-text">
          Talking to: <strong>{personality}</strong>
        </p>

        {/* Mic Button */}
        <button
          className={`mic-btn ${recording ? "recording" : ""}`}
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? <span className="pulse"></span> : <Mic size={40} strokeWidth={2.5} />}
        </button>

        {/* AI is Processing */}
        {loading && !speaking && (
          <div className="ai-avatar">
            <Loader2 className="spin" size={30} />
            <p>AI is thinking...</p>
          </div>
        )}

        {/* AI is Speaking */}
        {speaking && (
          <div className="ai-speaking">
            <Volume2 size={28} className="bounce" />
            <p>AI is speaking...</p>
          </div>
        )}

        {/* AI Text Reply */}
        {message && !loading && (
          <div className="ai-message">
            <p>{message}</p>
          </div>
        )}

        {/* Playback Controls */}
        {audioUrl && !loading && (
          <div className="playback">
            <audio controls src={audioUrl}></audio>
          </div>
        )}
      </div>
    </div>
  );
}
