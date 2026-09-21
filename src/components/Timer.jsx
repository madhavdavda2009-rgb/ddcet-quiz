import React from "react";
import { formatTime } from "../utils/quizUtils";

/**
 * Timer Component
 * 
 * Demonstrates:
 * - Props passing (timeRemaining)
 * - Conditional CSS classes (warning threshold)
 * - Reusable UI element
 */
export default function Timer({ timeRemaining }) {
  // Warn user when less than 5 minutes (300s) remain
  const isWarning = timeRemaining <= 300;

  return (
    <div className={`timer-container ${isWarning ? "timer-warning" : ""}`} role="timer" aria-live="polite">
      <span>⏱️ Time Remaining:</span>
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}
