import React, { useState, useEffect } from "react";
import {
  getAttemptHistory,
  calculateAnalytics,
  clearAttemptHistory,
  isLocalStorageAvailable
} from "../utils/historyUtils";
import { formatDuration } from "../config/examConfig";

/**
 * History Page Component - Modern Analytics Dashboard Redesign
 */
export default function History({ onStartMock, onStartPaper, onStartSubjectPractice, onBackHome }) {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const isAvail = isLocalStorageAvailable();
    setStorageAvailable(isAvail);
    if (isAvail) {
      setHistory(getAttemptHistory());
      setAnalytics(calculateAnalytics());
    }
  }, []);

  const handleConfirmClearHistory = () => {
    clearAttemptHistory();
    setHistory([]);
    setAnalytics(calculateAnalytics());
    setShowClearConfirm(false);
  };

  const totalQuestionsAttempted = history.reduce((acc, curr) => acc + (curr.attempted || 0), 0);

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <div className="history-header-left">
          <span className="college-badge">📊 Anonymous Performance History</span>
          <h2>Practice Analytics & History</h2>
          <p className="history-subtitle">
            Track your score progression, accuracy, and dynamic topic recommendations.
          </p>
        </div>

        <div className="history-header-right">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBackHome}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Storage Warning */}
      {!storageAvailable && (
        <div className="alert-box alert-warning">
          ⚠️ <strong>Notice:</strong> Local storage is disabled in this browser. Your attempt history will not persist upon closing this window.
        </div>
      )}

      {storageAvailable && (
        <div className="storage-info-note">
          🔒 <strong>Privacy Note:</strong> Your performance history is stored locally on this browser/device and is not synchronized across external servers.
        </div>
      )}

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="history-empty-card">
          <div className="empty-icon">📈</div>
          <h3>No practice attempts yet</h3>
          <p>
            Complete your first full mock test or subject practice to unlock personalized performance analytics, accuracy trends, and weak topic recommendations.
          </p>
          <div className="empty-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={onStartMock}
            >
              🚀 Take First Full Mock Test
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Top High-level Performance Metrics */}
          {analytics && (
            <div className="analytics-metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Total Attempts</span>
                <span className="metric-value">{analytics.attemptCount}</span>
                <span className="metric-sub">Completed Tests</span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Best Score</span>
                <span className="metric-value" style={{ color: "var(--success)" }}>
                  {analytics.bestScore}
                </span>
                <span className="metric-sub">Peak ({analytics.bestPercentage}%)</span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Average Accuracy</span>
                <span className="metric-value" style={{ color: "var(--primary)" }}>
                  {analytics.averageAccuracy}%
                </span>
                <span className="metric-sub">Across All Attempts</span>
              </div>

              <div className="metric-card">
                <span className="metric-label">Questions Attempted</span>
                <span className="metric-value">{totalQuestionsAttempted}</span>
                <span className="metric-sub">Total Practice MCQs</span>
              </div>
            </div>
          )}

          {/* Dynamic Personalized Recommendations */}
          {analytics && analytics.recommendations && analytics.recommendations.length > 0 && (
            <div className="recommendations-card">
              <h3 className="section-title">💡 Dynamic Recommendations</h3>
              <div className="recommendation-list">
                {analytics.recommendations.map((rec, idx) => (
                  <div key={idx} className="recommendation-item">
                    <div className="rec-icon">🎯</div>
                    <div className="rec-content">
                      <h4>Topic Insight: {rec.subject}</h4>
                      <p>{rec.text}</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm rec-btn"
                      onClick={() => {
                        if (rec.type === "WEAK_SUBJECT" && onStartSubjectPractice && rec.subject) {
                          onStartSubjectPractice(rec.subject);
                        } else {
                          onStartMock();
                        }
                      }}
                    >
                      {rec.action} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Topics Breakdown */}
          {analytics && analytics.weakSubjects && analytics.weakSubjects.length > 0 && (
            <div className="weak-topics-card">
              <h3 className="section-title">🎯 Weak Topics Requiring Practice</h3>
              <p className="section-subtitle" style={{ marginBottom: "1rem" }}>
                Objective performance data shows lower accuracy in these specific subjects:
              </p>
              <div className="weak-subjects-list">
                {analytics.weakSubjects.map((ws, idx) => (
                  <div key={idx} className="weak-subject-pill">
                    <span className="ws-name">{ws.subject}</span>
                    <span className="ws-stat">
                      Accuracy: <strong>{ws.accuracy}%</strong> ({ws.correct}/{ws.attempted} Qs)
                    </span>
                    {onStartSubjectPractice ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: "0.2rem 0.6rem", fontSize: "0.75rem" }}
                        onClick={() => onStartSubjectPractice(ws.subject)}
                      >
                        Practice {ws.subject} →
                      </button>
                    ) : (
                      <span className="ws-tag">Recommended Practice</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Attempts History Log */}
          <div className="history-log-card">
            <div className="history-log-header">
              <h3 className="section-title">📜 Recent Attempt History Log</h3>
              <button
                type="button"
                className="btn btn-destructive btn-sm"
                onClick={() => setShowClearConfirm(true)}
                title="Clear all saved local history"
              >
                🗑️ Clear History
              </button>
            </div>

            <div className="attempt-table-wrapper">
              <table className="attempt-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Paper / Mode</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Breakdown</th>
                    <th>Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record.attemptId}>
                      <td>
                        <span className="log-date">{record.formattedDate}</span>
                      </td>
                      <td>
                        <span className="log-mode">{record.modeTitle}</span>
                        {record.paper && <span className="log-paper-tag">{record.paper}</span>}
                      </td>
                      <td>
                        <span className="log-score">
                          <strong>{record.score}</strong> / {record.maxPossibleMarks}
                        </span>
                        <span className="log-pct">({record.percentage}%)</span>
                      </td>
                      <td>
                        <span
                          className="log-accuracy-badge"
                          style={{
                            background: record.accuracy >= 70 ? "var(--success-light)" : "var(--warning-light)",
                            color: record.accuracy >= 70 ? "var(--success)" : "var(--warning)"
                          }}
                        >
                          {record.accuracy}%
                        </span>
                      </td>
                      <td>
                        <span className="log-breakdown">
                          ✅ {record.correct} | ❌ {record.wrong} | ⚪ {record.unattempted}
                        </span>
                      </td>
                      <td>
                        <span className="log-time">{formatDuration(record.timeUsedSeconds)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Clear Attempt History?</h3>
            <p className="modal-description">
              Are you sure you want to delete all saved test attempts from this browser? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary modal-btn"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-destructive modal-btn"
                onClick={handleConfirmClearHistory}
              >
                Yes, Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
