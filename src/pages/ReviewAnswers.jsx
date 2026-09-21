import React, { useState } from "react";
import { getOptionLetter } from "../utils/quizUtils";
import { READING_PASSAGE } from "../data/questions";

/**
 * ReviewAnswers Component
 * 
 * Displays detailed question-by-question review with official keys,
 * filterable by attempt status and optimized for mobile screens.
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
      <div className="review-header-bar">
        <div>
          <h2 className="review-title">
            🔍 Detailed Answer Review
          </h2>
          <p className="review-subtitle">
            Review every question with your choice vs official exam key.
          </p>
        </div>

        <div className="review-nav-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBackToResult}
          >
            ← Scorecard
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

      {/* Filter Options Bar */}
      <div className="review-filter-bar">
        <button
          type="button"
          className={`btn btn-sm ${filterType === "ALL" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilterType("ALL")}
        >
          All ({questions.length})
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
          ⚪ Unattempted
        </button>
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="review-empty-state">
          <h3>No questions found in this category.</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Try selecting a different filter above.
          </p>
        </div>
      )}

      {/* Array.map() rendering each reviewed question card */}
      <div className="review-list">
        {filteredQuestions.map((q, displayIdx) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined && selected !== null && selected !== "";
          const isCorrect = isAnswered && selected.toUpperCase() === q.correctAnswer.toUpperCase();

          let cardBorderClass = "unattempted-border";
          let badgeElement = (
            <span className="review-status-badge review-status-unattempted">
              ⚪ Unattempted (0 Marks)
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
              <div className="review-card-header">
                <div className="review-badge-group">
                  <span className="tag-badge tag-paper">{q.paper}</span>
                  <span className="tag-badge tag-subject">{q.subject}</span>
                  <span className="review-q-num">Q. {displayIdx + 1}</span>
                </div>
                {badgeElement}
              </div>

              {/* Reading Comprehension Passage */}
              {q.hasPassage && (
                <div className="passage-box" style={{ fontSize: "0.85rem" }}>
                  <span className="passage-title">📖 Reading Comprehension Passage:</span>
                  <p>{READING_PASSAGE.text}</p>
                </div>
              )}

              <div className="question-text" style={{ fontSize: "1.05rem" }}>
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
                    statusTag = (
                      <span className="review-opt-tag review-opt-tag-correct">
                        Official Key
                      </span>
                    );
                  } else if (isUserSelection && !isCorrect) {
                    styleClass = "feedback-wrong";
                    statusTag = (
                      <span className="review-opt-tag review-opt-tag-wrong">
                        Your Choice
                      </span>
                    );
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`option-button ${styleClass}`}
                      style={{ cursor: "default", pointerEvents: "none" }}
                    >
                      <span className="option-letter">{letter}</span>
                      <span className="option-text">{optText}</span>
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
      <div className="review-bottom-actions">
        <button
          type="button"
          className="btn btn-secondary btn-lg review-bottom-btn"
          onClick={onBackToResult}
        >
          ← Return to Scorecard
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg review-bottom-btn"
          onClick={onBackToHome}
        >
          🏠 Return to Dashboard
        </button>
      </div>
    </div>
  );
}

