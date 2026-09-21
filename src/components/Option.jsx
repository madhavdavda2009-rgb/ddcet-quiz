import React from "react";

/**
 * Option Component
 * 
 * Demonstrates:
 * - Functional component
 * - Props passing (letter, text, isSelected, onClick, feedback)
 * - Event handling (onClick)
 * - Conditional styling (selected / feedback state)
 */
export default function Option({
  letter,
  text,
  isSelected,
  onSelect,
  disabled = false,
  feedbackState = null // 'correct' | 'wrong' | null
}) {
  let feedbackClass = "";
  if (feedbackState === "correct") feedbackClass = "feedback-correct";
  if (feedbackState === "wrong") feedbackClass = "feedback-wrong";

  return (
    <button
      type="button"
      className={`option-button ${isSelected ? "selected" : ""} ${feedbackClass}`}
      onClick={() => onSelect(letter)}
      disabled={disabled}
      aria-pressed={isSelected}
    >
      <span className="option-letter">{letter}</span>
      <span className="option-text">{text}</span>
    </button>
  );
}
