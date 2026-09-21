import React from "react";

/**
 * NavigationButtons Component
 * 
 * Demonstrates:
 * - Functional Component
 * - Props passing
 * - Event handling (Previous, Next, Clear, Mark for Review, Submit)
 * - Conditional state & label rendering
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
      <div className="toolbar-left">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrevious}
          disabled={isFirst}
          title="Go to previous question"
        >
          ← Previous
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onNext}
          disabled={isLast}
          title="Go to next question"
        >
          Next →
        </button>

        {isAnswerSelected && (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onClearAnswer}
            title="Clear selected option for this question"
          >
            ✕ Clear Answer
          </button>
        )}
      </div>

      <div className="toolbar-right">
        <button
          type="button"
          className="btn btn-warning"
          onClick={onToggleMark}
          title="Mark question for review later"
        >
          {isMarked ? "★ Unmark Review" : "☆ Mark for Review"}
        </button>

        <button
          type="button"
          className="btn btn-success"
          onClick={onSubmitClick}
          title="Submit the entire test"
        >
          Submit Test ➔
        </button>
      </div>
    </div>
  );
}
