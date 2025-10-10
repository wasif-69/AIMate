import React, { useState } from "react";
import WorldMap from "./map";
import { addModelToData } from "../Firebase/model";
import { auth } from "../Firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { savemessage } from "../Firebase/SAVEMessage";
import { addfavorate } from "../Firebase/favorate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./collegematch.css";

export default function Collegematch() {
  const [form, setForm] = useState({
    Class: "",
    Grades: "",
    scholarship: 0,
    comment: "",
    standardize: false,
    language: false,
    standardize_score: "",
    test: "",
    proficiency: "",
    language_score: "",
    extracurricular: "",
    Interested_fields: "",
  });

  const [worldmap, setMap] = useState(false);
  const [countriesList, setCountriesList] = useState([]);
  const [dataForm, setData] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingChats, setLoadingChats] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("🚀 Submitting form...");
    setLoadingSubmit(true);
    try {
      await APICaller(form, countriesList);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const APICaller = async (form, countries) => {
    try {
      const res = await fetch("https://aimate-7rdt.onrender.com/uniFinder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, countries }),
      });

      const data = await res.json();
      if (data.status === "PASS") {
        setData(data.message);
        toast.success("🎉 Recommendations loaded!");
      } else {
        toast.error("❌ Failed to load recommendations.");
      }
    } catch (err) {
      toast.error("⚠️ Server error. Please try again later.");
      console.error(err);
    }
  };

  const chatModel = async (name) => {
    setLoadingChats((prev) => ({ ...prev, [name]: true }));
    try {
      const modelId = await addModelToData(
        auth.currentUser.uid,
        name,
        "counselor",
        `To get into ${name}`,
        "professional"
      );

      const response = await fetch("https://aimate-7rdt.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: name, ID: "none" }),
      });

      const data = await response.json();
      if (data.message) {
        await savemessage(auth.currentUser.uid, modelId, "AI", data.message);
      }

      navigate(`/chat/${modelId}`);
    } catch (e) {
      toast.error("🤖 Chatbot failed to load.");
      console.error(e);
    } finally {
      setLoadingChats((prev) => ({ ...prev, [name]: false }));
    }
  };

  const addFavorite = async (uni, rank, rate, deadline, scho, loc, web) => {
    try {
      await addfavorate(
        auth.currentUser.uid,
        uni,
        rank,
        rate,
        deadline,
        scho,
        loc,
        web
      );
      toast.success("❤️ College added to favorites!");
    } catch (e) {
      toast.error("⚠️ Failed to add favorite.");
      console.log(e);
    }
  };

  return (
    <div className="college-match-container">
      <ToastContainer position="top-center" autoClose={3000} />

      {dataForm?.recommendations?.length > 0 ? (
        <div className="recommendation-list">
          {dataForm.recommendations.map((rec, index) => (
            <div className="recommendation-card" key={index}>
              <h2>
                🎓 {rec.university} (Rank: {rec.qs_ranking})
              </h2>
              <p>
                <strong>Acceptance Rate:</strong> {rec.acceptance_rate} 📈
              </p>
              <p>
                <strong>Deadline:</strong> {rec.application_deadline} ⏰
              </p>
              <p>
                <strong>Location:</strong> {rec.location} 🌍
              </p>
              <p>
                <strong>Scholarship:</strong> {rec.scholarship} 🎓
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={rec.official_website}
                  target="_blank"
                  rel="noreferrer"
                >
                  🌐 Visit Site
                </a>
              </p>
              <div className="button-group">
                <button
                  onClick={() => chatModel(rec.university)}
                  disabled={loadingChats[rec.university]}
                >
                  {loadingChats[rec.university] ? "💬 Loading Chat..." : "💬 Chat"}
                </button>
                <button
                  onClick={() =>
                    addFavorite(
                      rec.university,
                      rec.qs_ranking,
                      rec.acceptance_rate,
                      rec.application_deadline,
                      rec.scholarship,
                      rec.location,
                      rec.official_website
                    )
                  }
                >
                  ❤️ Favorite
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form className="college-form" onSubmit={handleSubmit}>
          <h1>🎓 College Suggester</h1>

          <input
            type="text"
            name="Class"
            placeholder="Current Class 📚"
            value={form.Class}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Grades"
            placeholder="Grades / Percentage 📊"
            value={form.Grades}
            onChange={handleChange}
            required
          />

          <label>
            <input
              type="checkbox"
              name="standardize"
              checked={form.standardize}
              onChange={handleChange}
            />{" "}
            Standardized Test 📑
          </label>

          {form.standardize && (
            <div>
              <label>
                <input
                  type="radio"
                  name="test"
                  value="SAT"
                  checked={form.test === "SAT"}
                  onChange={handleChange}
                  required
                />{" "}
                SAT
              </label>
              <label>
                <input
                  type="radio"
                  name="test"
                  value="ACT"
                  checked={form.test === "ACT"}
                  onChange={handleChange}
                />{" "}
                ACT
              </label>
              <label>
                <input
                  type="radio"
                  name="test"
                  value="OTHER"
                  checked={form.test === "OTHER"}
                  onChange={handleChange}
                />{" "}
                OTHER
              </label>
              <input
                type="text"
                name="standardize_score"
                placeholder="Test Score ✍️"
                value={form.standardize_score}
                onChange={handleChange}
                required={form.standardize}
              />
            </div>
          )}

          <label>
            <input
              type="checkbox"
              name="language"
              checked={form.language}
              onChange={handleChange}
            />{" "}
            Language Proficiency Test 🗣️
          </label>

          {form.language && (
            <div>
              <label>
                <input
                  type="radio"
                  name="proficiency"
                  value="IELTS"
                  checked={form.proficiency === "IELTS"}
                  onChange={handleChange}
                  required
                />{" "}
                IELTS
              </label>
              <label>
                <input
                  type="radio"
                  name="proficiency"
                  value="TOFEL"
                  checked={form.proficiency === "TOFEL"}
                  onChange={handleChange}
                />{" "}
                TOFEL
              </label>
              <label>
                <input
                  type="radio"
                  name="proficiency"
                  value="German"
                  checked={form.proficiency === "German"}
                  onChange={handleChange}
                />{" "}
                German
              </label>
              <label>
                <input
                  type="radio"
                  name="proficiency"
                  value="Others"
                  checked={form.proficiency === "Others"}
                  onChange={handleChange}
                />{" "}
                Others
              </label>
              <input
                type="text"
                name="language_score"
                placeholder="Language Score ✍️"
                value={form.language_score}
                onChange={handleChange}
                required={form.language}
              />
            </div>
          )}

          <textarea
            name="extracurricular"
            placeholder="List extracurriculars 🏅"
            value={form.extracurricular}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Interested_fields"
            placeholder="Interested Majors / Fields 🎯"
            value={form.Interested_fields}
            onChange={handleChange}
          />

          <label>
            Scholarship: {form.scholarship}%
            <input
              type="range"
              name="scholarship"
              min="0"
              max="100"
              step="10"
              value={form.scholarship}
              onChange={handleChange}
            />
          </label>

          <textarea
            name="comment"
            placeholder="Any additional info ✍️"
            value={form.comment}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              onClick={() => setMap(!worldmap)}
            />{" "}
            Select Countries 🌍
          </label>

          {worldmap && (
            <WorldMap
              counterieslist={countriesList}
              setcounterieslist={setCountriesList}
            />
          )}

          <button type="submit" disabled={loadingSubmit}>
            {loadingSubmit ? "⏳ Loading..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
