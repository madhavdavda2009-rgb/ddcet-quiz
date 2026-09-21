import React from "react";

/**
 * Instructions Page Component
 * 
 * Demonstrates:
 * - Functional Component
 * - Props passing
 * - Semantic HTML
 * - Event handling
 */
export default function Instructions({ onStartTest, onBackHome }) {
  return (
    <div className="instructions-container">
      <div className="instructions-header">
        <h2>📋 Examination Instructions & Guidelines</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.35rem" }}>
          Please read the following instructions carefully before commencing the examination.
        </p>
      </div>

      <div className="instructions-list">
        <div className="instruction-item">
          <div className="instruction-num">1</div>
          <div className="instruction-text">
            <strong>Total Questions & Marks:</strong> The examination contains <strong>100 Multiple Choice Questions (MCQs)</strong> carrying a total of <strong>200 Marks</strong>.
          </div>
        </div>

        <div className="instruction-item">
          <div className="instruction-num">2</div>
          <div className="instruction-text">
            <strong>Paper Distribution:</strong>
            <ul style={{ marginLeft: "1.25rem", marginTop: "0.25rem", listStyleType: "disc" }}>
              <li><strong>Section 01 (BE-01):</strong> Physics (Q1-30), Chemistry (Q31-40), Computer Practice (Q41-45), Environmental Science (Q46-50).</li>
              <li><strong>Section 02 (BE-02):</strong> Mathematics (Q51-75), English / Soft Skills (Q76-100).</li>
            </ul>
          </div>
        </div>

        <div className="instruction-item">
          <div className="instruction-num">3</div>
          <div className="instruction-text">
            <strong>Scoring Pattern & Negative Marking:</strong> Each correct response awards <strong>+2 marks</strong>. An incorrect response incurs a negative marking penalty of <strong>-0.5 marks</strong>. Unattempted questions carry <strong>0 marks</strong>.
          </div>
        </div>

        <div className="instruction-item">
          <div className="instruction-num">4</div>
          <div className="instruction-text">
            <strong>Timer & Auto-Submit:</strong> Total allotted duration is <strong>2 Hours 30 Minutes (9000 seconds)</strong>. The timer runs continuously in the top bar. The test will <strong>automatically submit</strong> when the timer hits <code>00:00:00</code>.
          </div>
        </div>

        <div className="instruction-item">
          <div className="instruction-num">5</div>
          <div className="instruction-text">
            <strong>Navigation & Palette:</strong> You may navigate sequentially using <em>Previous</em> / <em>Next</em>, or jump directly to any question by clicking its number in the <strong>Question Navigator</strong> on the right.
          </div>
        </div>

        <div className="instruction-item">
          <div className="instruction-num">6</div>
          <div className="instruction-text">
            <strong>Mark for Review & Clear Answer:</strong> You can bookmark questions for later reconsideration using <em>Mark for Review</em>. To deselect an answer, click <em>Clear Answer</em>.
          </div>
        </div>
      </div>

      {/* Palette Legend Card */}
      <div className="legend-card">
        <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "0.5rem" }}>
          Question Navigator Color Codes:
        </h4>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "var(--success)", color: "#fff" }}>✓</span>
            <span>Answered</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "#ffffff", border: "1px solid var(--border-strong)", color: "var(--text-muted)" }}>•</span>
            <span>Unattempted</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "var(--purple-light)", color: "var(--purple)", border: "1px solid var(--purple-border)" }}>★</span>
            <span>Marked for Review</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: "var(--purple)", color: "#fff" }}>✓</span>
            <span>Answered & Marked</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackHome}
        >
          ← Back to Dashboard
        </button>

        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onStartTest}
        >
          I am Ready, Start Test ➔
        </button>
      </div>
    </div>
  );
}
