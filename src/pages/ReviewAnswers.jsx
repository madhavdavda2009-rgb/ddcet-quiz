import React, { useState } from "react";
import { getOptionLetter } from "../utils/quizUtils";
import { READING_PASSAGE } from "../data/questions";

/**
 * ReviewAnswers Component
 * 
 * Demonstrates:
 * - Functional Component
 * - useState for filtering review questions (All, Correct, Incorrect, Unattempted)
 * - Array.filter() and Array.map()
 * - Conditional Rendering for question borders and status badges
 * - Props passing
 */
export default function ReviewAnswers({
  questions,
  selectedAnswers,
  onBackToResult,
  onBackToHome
}) {
  const [filterType, setFilterType] = useState("ALL"); // 'ALL' | 'CORRECT' | 'WRONG' | 'UNATTEMPTED'

  // Filter questions based on student attempt status
  const filteredQuestions = questions.filter((q) => {
    const selected = selectedAnswers[q.id];
    const isAnswered = selected !== undefined && selected !== null && selected !== "";
    const isCorrect = isAnswered && selected.toUpperCase() === q.correctAnswer.toUpperCase();

    if (filterType === "CORRECT") return isCorrect;
    if (filterType === "WRONG") return isAnswered && !isCorrect;
    if (filterType === "UNATTEMPTED") return !isAnswered;
    return true; // "ALL"
  });

  return (
    <div className="review-container">
      {/* Review Header */}
      <div className="quiz-header-bar" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: "700" }}>
            🔍 Detailed Answer Review
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            Review every question with chosen answer vs official key.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBackToResult}
          >
            ← Back to Scorecard
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onBackToHome}
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        background: "#ffffff",
        padding: "0.75rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)"
      }}>
        <button
          type="button"
          className={`btn btn-sm ${filterType === "ALL" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterType("ALL")}
        >
          All Questions ({questions.length})
        </button>

        <button
          type="button"
          className={`btn btn-sm ${filterType === "CORRECT" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterType("CORRECT")}
        >
          ✅ Correct Only
        </button>

        <button
          type="button"
          className={`btn btn-sm ${filterType === "WRONG" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterType("WRONG")}
        >
          ❌ Incorrect Only
        </button>

        <button
          type="button"
          className={`btn btn-sm ${filterType === "UNATTEMPTED" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterType("UNATTEMPTED")}
        >
          ⚪ Unattempted Only
        </button>
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div style={{
          background: "#ffffff",
          padding: "3rem",
          textAlign: "center",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)"
        }}>
          <h3>No questions found in this category.</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Try selecting a different filter above.
          </p>
        </div>
      )}

      {/* Array.map() rendering each reviewed question card */}
      <div className="review-list">
        {filteredQuestions.map((q) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined && selected !== null && selected !== "";
          const isCorrect = isAnswered && selected.toUpperCase() === q.correctAnswer.toUpperCase();

          let cardBorderClass = "unattempted-border";
          let badgeElement = (
            <span className="review-status-badge review-status-unattempted">
              ⚪ Not Attempted (0 Marks)
            </span>
          );

          if (isAnswered) {
            if (isCorrect) {
              cardBorderClass = "correct-border";
              badgeElement = (
                <span className="review-status-badge review-status-correct">
                  ✅ Correct (+2.0 Marks)
                </span>
              );
            } else {
              cardBorderClass = "wrong-border";
              badgeElement = (
                <span className="review-status-badge review-status-wrong">
                  ❌ Incorrect (-0.5 Marks)
                </span>
              );
            }
          }

          return (
            <div key={q.id} className={`review-card ${cardBorderClass}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span className="tag-badge tag-paper" style={{ marginRight: "0.4rem" }}>{q.paper}</span>
                  <span className="tag-badge tag-subject">{q.subject}</span>
                  <span style={{ marginLeft: "0.5rem", fontWeight: "700" }}>Question {q.id}</span>
                </div>
                {badgeElement}
              </div>

              {/* Conditional passage */}
              {q.hasPassage && (
                <div className="passage-box" style={{ fontSize: "0.85rem" }}>
                  <span className="passage-title">📖 Reading Comprehension Passage (Q.76 to Q.80):</span>
                  <p>{READING_PASSAGE.text}</p>
                </div>
              )}

              <div style={{ fontSize: "1.05rem", fontWeight: "600" }}>
                {q.question}
              </div>

              {/* Options list showing user selection vs correct answer */}
              <div className="options-list" style={{ gap: "0.5rem" }}>
                {q.options.map((optText, optIdx) => {
                  const letter = getOptionLetter(optIdx);
                  const isUserSelection = selected === letter;
                  const isCorrectAnswer = q.correctAnswer === letter;

                  let styleClass = "";
                  let statusTag = null;

                  if (isCorrectAnswer) {
                    styleClass = "feedback-correct";
                    statusTag = <span style={{ marginLeft: "auto", fontSize: "0.8rem", fontWeight: "700", color: "var(--success)" }}>Official Key</span>;
                  } else if (isUserSelection && !isCorrect) {
                    styleClass = "feedback-wrong";
                    statusTag = <span style={{ marginLeft: "auto", fontSize: "0.8rem", fontWeight: "700", color: "var(--danger)" }}>Your Choice</span>;
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`option-button ${styleClass}`}
                      style={{ cursor: "default", pointerEvents: "none" }}
                    >
                      <span className="option-letter">{letter}</span>
                      <span>{optText}</span>
                      {statusTag}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={onBackToResult}
        >
          ← Return to Scorecard
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onBackToHome}
        >
          🏠 Return to Home Dashboard
        </button>
      </div>
    </div>
  );
}
