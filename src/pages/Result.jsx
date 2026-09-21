import React from "react";
import { formatDuration } from "../config/examConfig";

/**
 * Result Page Component - Performance Dashboard Redesign
 */
export default function Result({
  scoreReport,
  onReview,
  onRetry,
  onHome,
  onViewHistory,
  modeTitle,
  timeUsedSeconds = 0
}) {
  const {
    totalQuestions,
    attempted,
    unattempted,
    correct,
    wrong,
    positiveMarks,
    negativeMarks,
    finalScore,
    maxPossibleMarks,
    percentage,
    accuracy,
    paperScores,
    subjectScores
  } = scoreReport;

  // Determine performance color
  let scoreBadgeColor = "var(--primary)";
  if (Number(percentage) >= 70) scoreBadgeColor = "var(--success)";
  else if (Number(percentage) < 40) scoreBadgeColor = "var(--danger)";

  return (
    <div className="result-container">
      <div className="result-card">
        {/* Top Header */}
        <div className="result-header">
          <span className="college-badge">Exam Performance Dashboard • {modeTitle}</span>
          <h2>Test Completed!</h2>
          <p className="result-header-sub">
            Calculated under official DDCET exam rules (+2 correct, -0.5 wrong).
          </p>
        </div>

        {/* Hero Score Ring & Primary Metrics */}
        <div className="score-hero-display">
          <div className="score-circle" style={{ background: scoreBadgeColor }}>
            <span className="score-circle-number">{finalScore}</span>
            <span className="score-circle-total">/ {maxPossibleMarks}</span>
            <span className="score-circle-pct">({percentage}%)</span>
          </div>

          <div className="score-stats-grid">
            <div className="score-stat-card">
              <div className="val" style={{ color: "var(--success)" }}>{correct}</div>
              <div className="lbl">Correct (+{positiveMarks})</div>
            </div>

            <div className="score-stat-card">
              <div className="val" style={{ color: "var(--danger)" }}>{wrong}</div>
              <div className="lbl">Wrong (-{negativeMarks})</div>
            </div>

            <div className="score-stat-card">
              <div className="val" style={{ color: "var(--text-muted)" }}>{unattempted}</div>
              <div className="lbl">Unattempted (0)</div>
            </div>

            <div className="score-stat-card">
              <div className="val" style={{ color: "var(--primary)" }}>{accuracy}%</div>
              <div className="lbl">Accuracy</div>
            </div>

            <div className="score-stat-card">
              <div className="val">{attempted}</div>
              <div className="lbl">Attempted</div>
            </div>

            <div className="score-stat-card">
              <div className="val">{formatDuration(timeUsedSeconds)}</div>
              <div className="lbl">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Paper-wise Performance */}
        {paperScores && (
          <div className="result-section">
            <h3 className="section-title">📑 Paper Breakdown</h3>
            <div className="paper-breakdown-grid">
              {Object.keys(paperScores).map((paperKey) => {
                const paper = paperScores[paperKey];
                return (
                  <div key={paperKey} className="paper-card">
                    <h4>{paperKey}: {paper.name}</h4>
                    <div className="paper-score-row">
                      <span>Score: <strong>{paper.score} / {paper.maxScore}</strong> ({paper.percentage}%)</span>
                      <span>Correct: <strong>{paper.correct}</strong> | Wrong: <strong>{paper.wrong}</strong> | Accuracy: <strong>{paper.accuracy}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subject-Wise Performance Progress Bars */}
        <div className="result-section">
          <h3 className="section-title">📊 Subject Performance</h3>
          <div className="subject-performance-list">
            {Object.keys(subjectScores).map((subjectKey) => {
              const sub = subjectScores[subjectKey];
              return (
                <div key={subjectKey} className="subject-perf-item">
                  <div className="subject-perf-header">
                    <span><strong>{sub.subject}</strong> ({sub.paper})</span>
                    <span>
                      Score: <strong>{sub.score} / {sub.maxScore}</strong> ({sub.percentage}%) • Accuracy: <strong>{sub.accuracy}%</strong> ({sub.correct}/{sub.total} Qs)
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(0, Number(sub.accuracy)))}%`,
                        background: Number(sub.accuracy) >= 60 ? "var(--success)" : "var(--warning)"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Primary Action Buttons */}
        <div className="result-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg result-btn"
            onClick={onReview}
          >
            🔍 Review Answers & Solutions
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg result-btn"
            onClick={onViewHistory}
          >
            📊 View Full History
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg result-btn"
            onClick={onRetry}
          >
            🔄 Retry Test
          </button>

          <button
            type="button"
            className="btn btn-tertiary btn-lg result-btn"
            onClick={onHome}
          >
            🏠 Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
