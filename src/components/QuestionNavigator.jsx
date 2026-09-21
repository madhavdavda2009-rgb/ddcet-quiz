import React, { useState } from "react";

/**
 * QuestionNavigator Component
 * 
 * Demonstrates:
 * - useState for internal filter tab state
 * - Array.map() for dynamic palette buttons
 * - Array.filter() for subject filtering
 * - Conditional styling / class names based on question state
 * - Event handling for jumping directly to any question
 */
export default function QuestionNavigator({
  questions,
  currentIndex,
  selectedAnswers,
  markedQuestions,
  onSelectQuestion
}) {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("ALL");

  // Calculate live statistics
  let answeredCount = 0;
  let markedCount = 0;
  let markedAndAnsweredCount = 0;

  questions.forEach((q) => {
    const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== null && selectedAnswers[q.id] !== "";
    const isMarked = !!markedQuestions[q.id];

    if (isAnswered && isMarked) markedAndAnsweredCount++;
    else if (isAnswered) answeredCount++;
    else if (isMarked) markedCount++;
  });

  const unattemptedCount = questions.length - (answeredCount + markedAndAnsweredCount);

  // Extract unique subjects for filtering
  const subjects = ["ALL", ...new Set(questions.map((q) => q.subject))];

  return (
    <div className="navigator-panel">
      <div className="navigator-header">
        <h3>Question Navigator</h3>
      </div>

      {/* Legend / Stats Summary */}
      <div className="navigator-stats-summary">
        <div className="nav-stat-row">
          <span className="legend-dot" style={{ background: "var(--success)", color: "#fff" }}>✓</span>
          <span>Answered: {answeredCount + markedAndAnsweredCount}</span>
        </div>
        <div className="nav-stat-row">
          <span className="legend-dot" style={{ background: "#fff", border: "1px solid var(--border-strong)", color: "var(--text-muted)" }}>•</span>
          <span>Unanswered: {unattemptedCount}</span>
        </div>
        <div className="nav-stat-row">
          <span className="legend-dot" style={{ background: "var(--purple-light)", color: "var(--purple)", border: "1px solid var(--purple-border)" }}>★</span>
          <span>Review: {markedCount + markedAndAnsweredCount}</span>
        </div>
        <div className="nav-stat-row">
          <span className="legend-dot" style={{ outline: "2px solid var(--primary)", background: "#fff", color: "var(--primary)" }}>◎</span>
          <span>Current: Q.{currentIndex + 1}</span>
        </div>
      </div>

      {/* Subject Filter Tabs (Useful for navigating 100 questions easily) */}
      {subjects.length > 2 && (
        <div className="filter-tabs">
          {subjects.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`filter-tab-btn ${selectedSubjectFilter === sub ? "active" : ""}`}
              onClick={() => setSelectedSubjectFilter(sub)}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Array.map() for rendering question buttons */}
      <div className="question-grid">
        {questions.map((q, idx) => {
          // If subject filter is applied, dim or skip
          if (selectedSubjectFilter !== "ALL" && q.subject !== selectedSubjectFilter) {
            return null;
          }

          const isCurrent = idx === currentIndex;
          const isAnswered = selectedAnswers[q.id] !== undefined && selectedAnswers[q.id] !== null && selectedAnswers[q.id] !== "";
          const isMarked = !!markedQuestions[q.id];

          let stateClass = "";
          if (isMarked && isAnswered) {
            stateClass = "marked-answered";
          } else if (isMarked) {
            stateClass = "marked";
          } else if (isAnswered) {
            stateClass = "answered";
          }

          if (isCurrent) {
            stateClass += " current";
          }

          return (
            <button
              key={q.id}
              type="button"
              className={`grid-btn ${stateClass}`}
              onClick={() => onSelectQuestion(idx)}
              title={`Question ${idx + 1} (${q.subject})`}
              aria-label={`Go to Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
