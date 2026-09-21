import React, { useState, useEffect } from "react";
import { EXAM_CONFIG, formatDuration } from "../config/examConfig";
import { calculateAnalytics, getAttemptHistory } from "../utils/historyUtils";
import SubjectFilterGrid from "../components/SubjectFilterGrid";
import LogoMarquee from "../components/LogoMarquee";

/**
 * Home Page Component - 21st.dev Bookmark & Vertex Template Inspired Redesign
 */
export default function Home({
  onStartFullMock,
  onStartPaper,
  onStartSubjectPractice,
  onStartQuickPractice,
  onShowInstructions,
  onViewHistory
}) {
  const [analytics, setAnalytics] = useState(null);
  const [recentAttempt, setRecentAttempt] = useState(null);
  const [selectedPaperId, setSelectedPaperId] = useState("2024");
  const [paperMode, setPaperMode] = useState("EXAM");

  useEffect(() => {
    const history = getAttemptHistory();
    if (history.length > 0) {
      setRecentAttempt(history[0]);
    }
    setAnalytics(calculateAnalytics());
  }, []);

  const handlePaperSubmit = (e) => {
    e.preventDefault();
    onStartPaper(selectedPaperId, paperMode === "PRACTICE");
  };

  return (
    <div className="home-container">
      {/* Hero Dashboard Section (Vertex Landing Template Style) */}
      <section className="home-hero">
        <div className="hero-header">
          <span className="college-badge hero-badge">
            🎓 Gujarat DDCET Diploma Entrance Exam Portal
          </span>
          <h2 className="hero-title">Master DDCET Practice & Mock Exams</h2>
          <p className="hero-subtitle">
            Practice authentic previous-year questions, simulate 100-question timed exams, and analyze detailed solutions.
          </p>
        </div>

        {/* Quick Meta Highlights */}
        <div className="exam-meta-grid">
          <div className="meta-pill">
            <span className="meta-label">Total Questions</span>
            <span className="meta-value">{EXAM_CONFIG.totalQuestions} MCQs</span>
            <span className="meta-sub">BE-01 (50) + BE-02 (50)</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Maximum Marks</span>
            <span className="meta-value">{EXAM_CONFIG.maximumMarks} Marks</span>
            <span className="meta-sub">+{EXAM_CONFIG.correctMarks} Correct / {EXAM_CONFIG.wrongMarks} Wrong</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Duration</span>
            <span className="meta-value">{EXAM_CONFIG.durationMinutes} Mins</span>
            <span className="meta-sub">2 Hours 30 Minutes</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Paper Sections</span>
            <span className="meta-value">2 Sections</span>
            <span className="meta-sub">Science, Engg & Aptitude</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg hero-btn"
            onClick={onStartFullMock}
          >
            🚀 Start Full 100Q Mock Test
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg hero-btn"
            onClick={onViewHistory}
          >
            📊 View History & Analytics
          </button>

          <button
            type="button"
            className="btn btn-tertiary btn-lg hero-btn"
            onClick={onShowInstructions}
          >
            📋 Exam Guidelines
          </button>
        </div>
      </section>

      {/* 21st.dev Bookmarked Logo Marquee Strip */}
      <section className="marquee-section">
        <LogoMarquee />
      </section>

      {/* Section 1 — Start Practicing (Quick Access Cards) */}
      <section className="home-section" id="practice-section">
        <div className="section-header-box">
          <h3 className="section-title">🚀 Start Practicing</h3>
          <p className="section-subtitle">
            Choose your preferred practice mode to prepare for the examination.
          </p>
        </div>

        <div className="start-practice-grid">
          <div className="practice-mode-card highlight">
            <div className="pm-icon">📝</div>
            <div className="pm-info">
              <h4>Full Mock Test</h4>
              <p>Simulate the official 100-question exam under real timer conditions.</p>
              <span className="pm-tag">100 Qs • 150 Mins</span>
            </div>
            <button
              type="button"
              className="btn btn-primary pm-btn"
              onClick={onStartFullMock}
            >
              Start Mock Test →
            </button>
          </div>

          <div className="practice-mode-card">
            <div className="pm-icon">⚡</div>
            <div className="pm-info">
              <h4>Quick Practice</h4>
              <p>Short random question sets for rapid revision sessions.</p>
              <span className="pm-tag">10, 20, or 30 Qs</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary pm-btn"
              onClick={() => onStartQuickPractice(10)}
            >
              Quick 10 Qs →
            </button>
          </div>

          <div className="practice-mode-card">
            <div className="pm-icon">📚</div>
            <div className="pm-info">
              <h4>Subject Practice</h4>
              <p>Focus on individual subjects with instant answer solutions.</p>
              <span className="pm-tag">Physics, Maths, English & more</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary pm-btn"
              onClick={() => onStartSubjectPractice("Physics")}
            >
              Choose Subject →
            </button>
          </div>

          <div className="practice-mode-card">
            <div className="pm-icon">📄</div>
            <div className="pm-info">
              <h4>Previous Papers</h4>
              <p>Practice authentic GTU question papers and series archives.</p>
              <span className="pm-tag">2024, 2025, 2026 Series A-D</span>
            </div>
            <button
              type="button"
              className="btn btn-secondary pm-btn"
              onClick={() => {
                const paperSec = document.getElementById("papers-section");
                if (paperSec) paperSec.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Browse Papers →
            </button>
          </div>
        </div>
      </section>

      {/* Section 2 — 21st.dev Bookmarked Subject Filter Grid */}
      <section className="home-section">
        <div className="section-header-box">
          <h3 className="section-title">📚 Subject Practice Modules</h3>
          <p className="section-subtitle">
            Filter and practice specific subjects with custom question sets and answer explanations.
          </p>
        </div>

        <SubjectFilterGrid onStartSubjectPractice={onStartSubjectPractice} />
      </section>

      {/* Section 3 — Previous Papers Archive */}
      <section className="home-section" id="papers-section">
        <div className="section-header-box">
          <h3 className="section-title">📄 Previous Year Papers & Series</h3>
          <p className="section-subtitle">
            Practice authentic question papers with original question sequence and answer keys.
          </p>
        </div>

        <form onSubmit={handlePaperSubmit} className="paper-selection-card">
          <div className="paper-select-grid">
            <div className="form-group">
              <label htmlFor="paper-select" className="form-label">Select Year / Series Paper:</label>
              <select
                id="paper-select"
                className="form-control"
                value={selectedPaperId}
                onChange={(e) => setSelectedPaperId(e.target.value)}
              >
                {EXAM_CONFIG.papersList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.totalQuestions} Questions)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Mode:</label>
              <div className="mode-toggle-group">
                <button
                  type="button"
                  className={`btn btn-sm ${paperMode === "EXAM" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setPaperMode("EXAM")}
                >
                  ⏱️ Exam Mode (Timed)
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${paperMode === "PRACTICE" ? "btn-primary" : "btn-secondary"}`}
                  onClick={() => setPaperMode("PRACTICE")}
                >
                  💡 Practice Mode (Instant Solutions)
                </button>
              </div>
            </div>
          </div>

          <div className="paper-submit-box">
            <button type="submit" className="btn btn-success btn-lg">
              ▶️ Start {EXAM_CONFIG.papersList.find((p) => p.id === selectedPaperId)?.title}
            </button>
          </div>
        </form>
      </section>

      {/* Section 4 — Recent Activity / Continue */}
      <section className="home-section">
        <div className="section-header-box">
          <h3 className="section-title">⏱️ Recent Activity</h3>
          <p className="section-subtitle">Your latest practice performance summary.</p>
        </div>

        {recentAttempt ? (
          <div className="recent-activity-card">
            <div className="recent-act-info">
              <span className="recent-act-tag">{recentAttempt.paper || "Mock Test"}</span>
              <h4>{recentAttempt.modeTitle}</h4>
              <p className="recent-act-date">Attempted on {recentAttempt.formattedDate}</p>
            </div>

            <div className="recent-act-stats">
              <div className="recent-stat">
                <span className="stat-num">{recentAttempt.score} / {recentAttempt.maxPossibleMarks}</span>
                <span className="stat-lbl">Score ({recentAttempt.percentage}%)</span>
              </div>

              <div className="recent-stat">
                <span className="stat-num" style={{ color: "var(--success)" }}>{recentAttempt.accuracy}%</span>
                <span className="stat-lbl">Accuracy</span>
              </div>

              <div className="recent-stat">
                <span className="stat-num">{formatDuration(recentAttempt.timeUsedSeconds)}</span>
                <span className="stat-lbl">Time Spent</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onViewHistory}
            >
              View History →
            </button>
          </div>
        ) : (
          <div className="bookmark-empty-state">
            <div className="empty-icon-sm">📈</div>
            <h4>No recent practice activity</h4>
            <p>Complete your first practice test to track your performance and accuracy here.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onStartFullMock}
            >
              Take First Practice Test
            </button>
          </div>
        )}
      </section>

      {/* Section 5 — Recommended Practice */}
      {analytics && analytics.recommendations && analytics.recommendations.length > 0 && (
        <section className="home-section">
          <div className="section-header-box">
            <h3 className="section-title">💡 Recommended for You</h3>
            <p className="section-subtitle">Personalized practice insights based on your recent attempt accuracy.</p>
          </div>

          <div className="recommendation-banner">
            <div className="rec-banner-inner">
              <div className="rec-banner-text">
                <span className="rec-badge">Topic Insight</span>
                <h4>{analytics.recommendations[0].subject}</h4>
                <p>{analytics.recommendations[0].text}</p>
              </div>
              <button
                type="button"
                className="btn btn-primary rec-banner-btn"
                onClick={() => onStartSubjectPractice(analytics.recommendations[0].subject || "Physics")}
              >
                {analytics.recommendations[0].action} →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="home-footer">
        <p><strong>DDCET Practice Quiz</strong> — Diploma Engineering Student Practice Application.</p>
        <p style={{ marginTop: "0.25rem" }}>Developed in accordance with GTU / ACPC examination guidelines.</p>
      </footer>
    </div>
  );
}
