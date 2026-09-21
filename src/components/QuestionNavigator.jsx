import React, { useState } from "react";

/**
 * QuestionNavigator Component
 * 
 * Renders the question palette grid, filter tabs, live stats,
 * and supports responsive desktop sidebar and mobile slide-in drawer.
 */
export default function QuestionNavigator({
  questions,
  currentIndex,
  selectedAnswers,
  markedQuestions,
  onSelectQuestion,
  isMobileDrawerOpen = false,
  onCloseMobile
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

  const handleQuestionClick = (idx) => {
    onSelectQuestion(idx);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="navigator-panel-inner">
      <div className="navigator-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Question Palette</h3>
          {onCloseMobile && (
            <button
              type="button"
              className="btn btn-secondary btn-sm mobile-close-drawer-btn"
              onClick={onCloseMobile}
              aria-label="Close question palette"
            >
              ✕ Close
            </button>
          )}
        </div>
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

      {/* Subject Filter Tabs */}
      {subjects.length > 2 && (
        <div className="filter-tabs-container">
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
        </div>
      )}

      {/* Question Grid */}
      <div className="question-grid">
        {questions.map((q, idx) => {
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
              onClick={() => handleQuestionClick(idx)}
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

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="navigator-panel desktop-navigator" aria-label="Question Navigator">
        {content}
      </aside>

      {/* Mobile Modal / Drawer */}
      {isMobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={onCloseMobile} role="dialog" aria-modal="true">
          <div className="mobile-drawer-card" onClick={(e) => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

