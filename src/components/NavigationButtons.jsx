import React from "react";

/**
 * NavigationButtons Component
 * 
 * Provides responsive controls for question pagination, answer clearing,
 * review bookmarking, and test submission.
 */
export default function NavigationButtons({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onClearAnswer,
  onToggleMark,
  isMarked,
  onSubmitClick,
  isAnswerSelected
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  return (
    <div className="quiz-actions-toolbar">
      {/* Primary Navigation Controls */}
      <div className="toolbar-nav-group">
        <button
          type="button"
          className="btn btn-secondary nav-btn prev-btn"
          onClick={onPrevious}
          disabled={isFirst}
          title="Go to previous question"
          aria-label="Previous question"
        >
          ← Previous
        </button>

        <button
          type="button"
          className="btn btn-primary nav-btn next-btn"
          onClick={onNext}
          disabled={isLast}
          title="Go to next question"
          aria-label="Next question"
        >
          Next →
        </button>
      </div>

      {/* Review & Clear Controls */}
      <div className="toolbar-aux-group">
        <button
          type="button"
          className={`btn ${isMarked ? "btn-warning-active" : "btn-warning"} mark-btn`}
          onClick={onToggleMark}
          title="Mark question for review later"
          aria-pressed={isMarked}
        >
          {isMarked ? "★ Marked" : "☆ Mark Review"}
        </button>

        {isAnswerSelected && (
          <button
            type="button"
            className="btn btn-danger clear-btn"
            onClick={onClearAnswer}
            title="Clear selected option for this question"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Submit Action */}
      <div className="toolbar-submit-group">
        <button
          type="button"
          className="btn btn-success submit-btn"
          onClick={onSubmitClick}
          title="Submit the entire test"
        >
          Submit Test ➔
        </button>
      </div>
    </div>
  );
}

