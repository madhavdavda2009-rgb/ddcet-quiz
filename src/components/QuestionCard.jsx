import React from "react";
import Option from "./Option";
import { getOptionLetter } from "../utils/quizUtils";
import { READING_PASSAGE } from "../data/questions";

/**
 * Reusable Structured Explanation Component
 * Renders distinct solution sections (Concept, Formula, Given, Substitution, Calculation, Final Answer, Reasoning)
 * Only displays sections that actually exist in data — no empty headings.
 */
export function StructuredExplanation({ question }) {
  if (!question || !question.explanation) return null;

  const rawText = question.explanation;

  // Check if explanation has explicit section headings embedded
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Group lines into sections if prefixed (e.g. "Formula:", "Given:", "Concept:")
  const sections = [];
  let currentSec = { heading: null, content: [] };

  lines.forEach((line) => {
    const headingMatch = line.match(/^(Concept|Formula|Given|Substitution|Calculation|Final Answer|Therefore|Reasoning|Option Elimination|Why other options do not apply):?/i);
    if (headingMatch) {
      if (currentSec.content.length > 0 || currentSec.heading) {
        sections.push(currentSec);
      }
      currentSec = {
        heading: headingMatch[1],
        content: [line.replace(headingMatch[0], "").trim()].filter(Boolean)
      };
    } else {
      currentSec.content.push(line);
    }
  });
  if (currentSec.content.length > 0 || currentSec.heading) {
    sections.push(currentSec);
  }

  return (
    <div className="explanation-body">
      <h4 className="explanation-heading">💡 Educational Solution & Reasoning</h4>

      {sections.length > 0 && sections.some((s) => s.heading) ? (
        <div className="structured-explanation-sections">
          {sections.map((sec, idx) => (
            <div key={idx} className="explanation-section-block">
              {sec.heading && <h5 className="explanation-section-title">{sec.heading}</h5>}
              {sec.content.map((cLine, cIdx) => (
                <p key={cIdx} className="explanation-line">{cLine}</p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="explanation-content">
          {lines.map((line, i) => (
            <p key={i} className="explanation-line">{line}</p>
          ))}
        </div>
      )}

      {/* Option-by-option explanation breakdown if available */}
      {question.optionExplanations && (
        <div className="option-breakdown-box">
          <h5 className="explanation-section-title">Option Breakdown</h5>
          <ul className="option-breakdown-list">
            {Object.keys(question.optionExplanations).map((optKey) => (
              <li key={optKey}>
                <strong>Option ({optKey}):</strong> {question.optionExplanations[optKey]}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="explanation-disclaimer">
        ℹ️ Educational explanation for student practice. Not an official ACPC publication.
      </div>
    </div>
  );
}

/**
 * QuestionCard Component
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
        <div className="question-meta-tags">
          <span className="tag-badge tag-paper">{question.paper || "BE-01"}</span>
          <span className="tag-badge tag-subject">{question.subject || "General"}</span>
          <span className="marks-badge">+{question.marks || 2} / -{Math.abs(question.negativeMarks || 0.5)}</span>
        </div>
      </div>

      {/* Reading Comprehension Passage */}
      {question.hasPassage && (
        <div className="passage-box">
          <span className="passage-title">📖 Reading Comprehension Passage:</span>
          <p>{READING_PASSAGE.text}</p>
        </div>
      )}

      <div className="question-text">
        {question.question}
      </div>

      {/* Dynamic Options List */}
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

      {/* Practice Mode Instant Explanation Box */}
      {isPracticeMode && isAnswered && (
        <div className="practice-explanation-card">
          <div
            className="practice-status-banner"
            style={{
              background: isCorrect ? "var(--success-light)" : "var(--danger-light)",
              borderColor: isCorrect ? "var(--success-border)" : "var(--danger-border)",
              color: isCorrect ? "var(--success)" : "var(--danger)"
            }}
          >
            {isCorrect ? (
              <span>✅ <strong>Correct Answer!</strong> Option ({question.correctAnswer}) is right.</span>
            ) : (
              <span>❌ <strong>Incorrect Choice.</strong> You selected ({selectedAnswer}). Correct option is ({question.correctAnswer}).</span>
            )}
          </div>

          <StructuredExplanation question={question} />
        </div>
      )}
    </div>
  );
}
