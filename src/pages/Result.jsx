import React from "react";

/**
 * Result Page Component
 * 
 * Scorecard and performance analytics with mobile-first responsive layout.
 */
export default function Result({
  scoreReport,
  onReview,
  onRetry,
  onHome,
  modeTitle
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
    paperScores,
    subjectScores
  } = scoreReport;

  // Color indicator based on percentage score
  let scoreBadgeColor = "var(--primary)";
  if (Number(percentage) >= 70) scoreBadgeColor = "var(--success)";
  else if (Number(percentage) < 40) scoreBadgeColor = "var(--danger)";

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header">
          <span className="college-badge">Exam Performance Report • {modeTitle}</span>
          <h2>DDCET Practice Result</h2>
          <p className="result-header-sub">
            Comprehensive performance breakdown calculated under official DDCET rules (+2 correct, -0.5 wrong).
          </p>
        </div>

        {/* Hero Score Visualization */}
        <div className="score-hero-display">
          <div className="score-circle" style={{ background: scoreBadgeColor }}>
            <span className="score-circle-number">{finalScore}</span>
            <span className="score-circle-total">/ {maxPossibleMarks}</span>
            <span className="score-circle-pct">({percentage}%)</span>
          </div>

          {/* Grid of Key Score Metrics */}
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
              <div className="val" style={{ color: "var(--primary)" }}>{attempted}</div>
              <div className="lbl">Total Attempted</div>
            </div>
          </div>
        </div>

        {/* Section Paper Breakdown (BE-01 and BE-02) */}
        {paperScores && (
          <div className="result-section">
            <h3 className="section-title">📑 Paper-wise Performance</h3>
            <div className="paper-breakdown-grid">
              <div className="paper-card">
                <h4>Section 01: Paper BE-01 (Science & Engg)</h4>
                <p className="paper-card-sub">
                  Physics, Chemistry, Computer Practice, Environmental Science
                </p>
                <div className="paper-score-row">
                  <span>Score: <strong>{paperScores["BE-01"]?.score} / {paperScores["BE-01"]?.maxScore}</strong></span>
                  <span>Correct: <strong>{paperScores["BE-01"]?.correct}</strong> | Wrong: <strong>{paperScores["BE-01"]?.wrong}</strong></span>
                </div>
              </div>

              <div className="paper-card">
                <h4>Section 02: Paper BE-02 (Aptitude Test)</h4>
                <p className="paper-card-sub">
                  Mathematics, English Language / Soft Skills
                </p>
                <div className="paper-score-row">
                  <span>Score: <strong>{paperScores["BE-02"]?.score} / {paperScores["BE-02"]?.maxScore}</strong></span>
                  <span>Correct: <strong>{paperScores["BE-02"]?.correct}</strong> | Wrong: <strong>{paperScores["BE-02"]?.wrong}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subject-Wise Performance Progress Bars */}
        <div className="result-section">
          <h3 className="section-title">📊 Subject-wise Breakdown</h3>
          <div className="subject-performance-list">
            {Object.keys(subjectScores).map((subjectKey) => {
              const sub = subjectScores[subjectKey];
              return (
                <div key={subjectKey} className="subject-perf-item">
                  <div className="subject-perf-header">
                    <span>{sub.subject} ({sub.paper})</span>
                    <span>
                      Score: <strong>{sub.score} / {sub.maxScore}</strong> ({sub.percentage}%) • Correct: {sub.correct}/{sub.total}
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, Math.max(0, Number(sub.percentage)))}%`,
                        background: Number(sub.percentage) >= 50 ? "var(--success)" : "var(--warning)"
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg result-btn"
            onClick={onReview}
          >
            🔍 Review Answers & Explanations
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg result-btn"
            onClick={onRetry}
          >
            🔄 Retry Test (New Shuffled Qs)
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg result-btn"
            onClick={onHome}
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

