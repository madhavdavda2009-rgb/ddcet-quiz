import React from "react";
import Option from "./Option";
import { getOptionLetter } from "../utils/quizUtils";
import { READING_PASSAGE } from "../data/questions";

/**
 * QuestionCard Component
 * 
 * Demonstrates:
 * - Props passing
 * - Array.map() for rendering dynamic options list
 * - Conditional rendering (Passage display, instant practice feedback)
 * - Event handling
 */
export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption,
  isPracticeMode = false
}) {
  if (!question) return null;

  const isAnswered = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== "";
  const isCorrect = isAnswered && selectedAnswer.toUpperCase() === question.correctAnswer.toUpperCase();

  return (
    <div className="question-card">
      <div className="question-header-line">
        <div className="question-index-title">
          Question {currentIndex + 1} of {totalQuestions}
        </div>
        <div className="marks-badge">
          +{question.marks || 2} Marks / -0.5 Negative
        </div>
      </div>

      {/* Conditional Rendering: Show Reading Passage if English Comprehension Question */}
      {question.hasPassage && (
        <div className="passage-box">
          <span className="passage-title">📖 Reading Comprehension Passage (Q.76 to Q.80):</span>
          <p>{READING_PASSAGE.text}</p>
        </div>
      )}

      <div className="question-text">
        {question.question}
      </div>

      {/* Array.map() rendering options dynamically */}
      <div className="options-list">
        {question.options.map((optionText, index) => {
          const letter = getOptionLetter(index);
          const isSelected = selectedAnswer === letter;
          
          let feedbackState = null;
          if (isPracticeMode && isAnswered) {
            if (letter === question.correctAnswer) {
              feedbackState = "correct";
            } else if (isSelected && !isCorrect) {
              feedbackState = "wrong";
            }
          }

          return (
            <Option
              key={index}
              letter={letter}
              text={optionText}
              isSelected={isSelected}
              onSelect={onSelectOption}
              feedbackState={feedbackState}
            />
          );
        })}
      </div>

      {/* Practice Mode: Instant explanation / feedback badge */}
      {isPracticeMode && isAnswered && (
        <div style={{
          marginTop: "0.5rem",
          padding: "0.85rem 1rem",
          borderRadius: "var(--radius-md)",
          background: isCorrect ? "var(--success-light)" : "var(--danger-light)",
          border: `1px solid ${isCorrect ? "var(--success-border)" : "var(--danger-border)"}`,
          color: isCorrect ? "var(--success)" : "var(--danger)",
          fontWeight: "600",
          fontSize: "0.95rem"
        }}>
          {isCorrect ? (
            <span>✅ Correct! The right option is ({question.correctAnswer}).</span>
          ) : (
            <span>❌ Incorrect. You selected ({selectedAnswer}), but the correct option is ({question.correctAnswer}).</span>
          )}
        </div>
      )}
    </div>
  );
}
