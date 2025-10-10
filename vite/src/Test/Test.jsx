import React, { useState } from "react";
import "./test.css";

export default function Test() {
  // Form fields
  const [sallabus, setsallabus] = useState("");
  const [chatpter, setchapter] = useState("");
  const [topic, settopic] = useState("");
  const [suntopic, setsubtopic] = useState("");

  // Quiz state
  const [questions, setQuestions] = useState([]); // array of question objects returned from API
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // user selected answers, same length as questions
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch questions from backend
  const formHandling = async () => {
    setError(null);

    // basic validation
    if (!sallabus.trim() || !chatpter.trim() || !topic.trim() || !suntopic.trim()) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("https://aimate-7rdt.onrender.com/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sallabus,
          chapter: chatpter,
          topic,
          subtopic: suntopic,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status} ${text}`);
      }

      const data = await response.json();

      // handle different possible shapes defensively
      const questionArray = Array.isArray(data.answer)
        ? data.answer
        : Array.isArray(data?.answer?.answer)
        ? data.answer.answer
        : Array.isArray(data?.answer?.questions)
        ? data.answer.questions
        : Array.isArray(data?.answer)
        ? data.answer
        : data?.answer || [];

      if (!Array.isArray(questionArray) || questionArray.length === 0) {
        throw new Error("No questions were returned by the server.");
      }

      // initialize answers array with nulls
      setQuestions(questionArray);
      setAnswers(new Array(questionArray.length).fill(null));
      setCurrentIndex(0);
      setSubmitted(false);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  // handle user choosing an option for current question
  const handleChoose = (choiceKey) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = choiceKey;
      return copy;
    });

    // Advance to next question after short delay so user sees selection
    const next = currentIndex + 1;
    if (next < questions.length) {
      setTimeout(() => setCurrentIndex(next), 400);
    } else {
      // reached the end
      setTimeout(() => {
        setSubmitted(true);
      }, 400);
    }
  };

  // compute results
  const computeResults = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      const userChoice = answers[idx];
      const correctAnswer = q.correct_answer ?? q.correctAnswer ?? q.correct_answer_label ?? q.correct_answer?.toString();
      // normalize to string like "A","B","C","D"
      if (userChoice && correctAnswer && userChoice.toString().toUpperCase() === correctAnswer.toString().toUpperCase()) {
        correct += 1;
      }
    });
    const total = questions.length;
    const percent = Math.round((correct / total) * 100);
    return { correct, total, percent };
  };

  const { correct, total, percent } = computeResults();

  const handleRestart = () => {
    // Clear quiz state back to form view
    setQuestions([]);
    setAnswers([]);
    setCurrentIndex(0);
    setSubmitted(false);
    setError(null);
    // Keep form inputs if you want — or clear them:
    // setsallabus(""); setchapter(""); settopic(""); setsubtopic("");
  };

  // Render helpers
  const renderForm = () => (
  <div className="test-form-card">
  <h2>Create a quick test</h2>
  {error && <div className="error">{error}</div>}

  <label className="label-with-icon" htmlFor="sallabus">
    <span className="icon" aria-hidden="true">📚</span> Syllabus
  </label>
  <input
    id="sallabus"
    type="text"
    value={sallabus}
    onChange={(e) => setsallabus(e.target.value)}
    placeholder="e.g. A-Level, SAT"
  />

  <label className="label-with-icon" htmlFor="chapter">
    <span className="icon" aria-hidden="true">📖</span> Chapter
  </label>
  <input
    id="chapter"
    type="text"
    value={chatpter}
    onChange={(e) => setchapter(e.target.value)}
    placeholder="Chapter name or number"
  />

  <label className="label-with-icon" htmlFor="topic">
    <span className="icon" aria-hidden="true">🧠</span> Topic
  </label>
  <input
    id="topic"
    type="text"
    value={topic}
    onChange={(e) => settopic(e.target.value)}
    placeholder="Topic e.g. Calculus"
  />

  <label className="label-with-icon" htmlFor="subtopic">
    <span className="icon" aria-hidden="true">🔍</span> Subtopic
  </label>
  <input
    id="subtopic"
    type="text"
    value={suntopic}
    onChange={(e) => setsubtopic(e.target.value)}
    placeholder="Subtopic e.g. Derivatives"
  />

  <div className="form-actions">
    <button className="btn primary" onClick={formHandling} disabled={loading}>
      {loading ? "Generating…" : "Generate 5-question test"}
    </button>
  </div>

  <p className="note">The test is generated by AI and displayed directly (not saved).</p>
</div>


  );

  const renderQuestion = () => {
    const q = questions[currentIndex];
    // normalize options object — expect keys A,B,C,D
    const options = q.options || {};
    // some LLM outputs may use different property names like 'choices' — handle if necessary
    const choicesEntries = Object.entries(options);

    return (
      <div className="question-card">
        <div className="question-header">
          <div className="progress">
            Question {currentIndex + 1} / {questions.length}
          </div>
          <div className="difficulty">{q.difficulty ?? q.level ?? ""}</div>
        </div>

        <h3 className="question-text">{q.question}</h3>

        <div className="options-grid">
          {choicesEntries.map(([key, value]) => {
            const isSelected = answers[currentIndex] === key;
            return (
              <button
                key={key}
                className={`option-btn ${isSelected ? "selected" : ""}`}
                onClick={() => handleChoose(key)}
                aria-pressed={isSelected}
              >
                <span className="option-key">{key}</span>
                <span className="option-text">{value}</span>
              </button>
            );
          })}
        </div>

        <div className="question-footer">
          <div className="hint">Click an option to continue →</div>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="summary-card">
      <h2>Test Results</h2>
      <div className="score">
        <div className="score-number">{correct} / {total}</div>
        <div className="score-percent">{percent}%</div>
      </div>

      <div className="summary-list">
        {questions.map((q, idx) => {
          const userChoice = answers[idx];
          const correctAnswer = q.correct_answer ?? q.correctAnswer ?? q.correct_answer_label ?? q.correct_answer;
          const isCorrect = userChoice && correctAnswer && userChoice.toString().toUpperCase() === correctAnswer.toString().toUpperCase();
          return (
            <div key={idx} className={`summary-item ${isCorrect ? "correct" : "wrong"}`}>
              <div className="summary-q">
                <strong>Q{idx + 1}:</strong> {q.question}
              </div>
              <div className="summary-choices">
                <div className={`user-choice ${isCorrect ? "ok" : "bad"}`}>
                  Your answer: {userChoice ?? "—"}
                </div>
                <div className="correct-choice">Correct: {correctAnswer}</div>
                <div className="explain">{q.explanation ?? q.explain ?? ""}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary-actions">
        <button className="btn" onClick={() => {
          // allow retrying the same questions: reset answers and currentIndex
          setAnswers(new Array(questions.length).fill(null));
          setCurrentIndex(0);
          setSubmitted(false);
        }}>Retry Test</button>

        <button className="btn outline" onClick={handleRestart}>New Test</button>
      </div>
    </div>
  );

  return (
    <div className="test-page">
      <div className="container">
        {!questions.length && !loading && renderForm()}
        {loading && (
          <div className="loading-card">
            <div className="spinner" />
            <div>Generating test — please wait...</div>
          </div>
        )}

        {questions.length > 0 && !submitted && !loading && renderQuestion()}

        {submitted && renderSummary()}
      </div>
    </div>
  );
}
