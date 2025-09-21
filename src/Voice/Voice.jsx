import React, { useState, useRef } from "react";
import { Mic, Loader2, Volume2, RefreshCcw } from "lucide-react";
import "./voice.css";

export default function VoiceRecorder({ personality }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        setLoading(true);
        setMessage("");
        setSpeaking(false);

        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");
        formData.append("personality", personality);

        try {
          const res = await fetch("https://aimateserver.onrender.com/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();

          if (data.filename) {
            setMessage(data.message);
            const audioUrl = `https://aimateserver.onrender.com/${data.filename}`;
            setAudioUrl(audioUrl);

            const audio = new Audio(audioUrl);
            setSpeaking(true);
            audio.play();

            audio.onended = () => {
              setSpeaking(false);
              setLoading(false);
            };

            audio.onerror = () => {
              console.error("Audio playback failed.");
              setSpeaking(false);
              setLoading(false);
            };
          } else {
            throw new Error("No audio file returned");
          }
        } catch (err) {
          console.error("Error:", err);
          setMessage("⚠️ Something went wrong. Please try again.");
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing mic:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const reset = () => {
    setRecording(false);
    setLoading(false);
    setAudioUrl(null);
    setMessage("");
    setSpeaking(false);
  };

  return (
    <div className="voice-container">
      {/* Stickers */}
      <span className="sticker sticker1">🤖</span>
      <span className="sticker sticker2">🎧</span>
      <span className="sticker sticker3">✨</span>

      <div className="voice-card">
        <h2 className="title">🎤 Talk to AI</h2>
        <p className="subtitle">
          Talking to: <strong>{personality}</strong>
        </p>

        {/* Mic Button */}
        <button
          className={`mic-button ${recording ? "recording" : ""}`}
          onClick={recording ? stopRecording : startRecording}
          disabled={loading || speaking}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {recording ? <span className="pulse" /> : <Mic size={40} strokeWidth={2.5} />}
        </button>

        {/* AI Processing */}
        {loading && !speaking && (
          <div className="status" role="status">
            <Loader2 className="spin" size={28} />
            <p>AI is thinking...</p>
          </div>
        )}

        {/* AI Speaking */}
        {speaking && (
          <div className="status speaking" role="status">
            <Volume2 size={28} className="bounce" />
            <p>AI is speaking...</p>
          </div>
        )}

        {/* AI Message */}
        {message && !loading && (
          <div className="ai-message">
            <p>{message}</p>
          </div>
        )}

        {/* Audio Playback */}
        {audioUrl && !loading && (
          <div className="audio-player">
            <audio controls src={audioUrl}></audio>
          </div>
        )}

        {/* Reset Button */}
        {(message || audioUrl) && (
          <button className="reset-button" onClick={reset}>
            <RefreshCcw size={18} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
