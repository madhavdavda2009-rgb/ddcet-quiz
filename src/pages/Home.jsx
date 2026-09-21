import React from "react";
import { SUBJECTS } from "../data/questions";

/**
 * Home Page Component
 * 
 * Demonstrates:
 * - Functional Component
 * - Props passing (callbacks for starting mock or subject practice)
 * - Array.map() for rendering subject cards
 * - Event handling
 */
export default function Home({ onStartFullMock, onStartSubjectPractice, onShowInstructions }) {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-header">
          <span className="college-badge" style={{ alignSelf: "flex-start" }}>
            🎓 Gujarat DDCET Engineering Entrance Exam 2024-25 Preparation
          </span>
          <h2 className="hero-title">DDCET Practice Quiz Portal</h2>
          <p className="hero-subtitle">
            Comprehensive mock test and subject-wise practice application built strictly according to official Gujarat DDCET examination papers and syllabus.
          </p>
        </div>

        {/* Exam Pattern Meta Highlights */}
        <div className="exam-meta-grid">
          <div className="meta-pill">
            <span className="meta-label">Total Questions</span>
            <span className="meta-value">100 MCQs</span>
            <span className="meta-sub">BE-01 (50) + BE-02 (50)</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Total Marks</span>
            <span className="meta-value">200 Marks</span>
            <span className="meta-sub">+2 Correct / -0.5 Wrong</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Exam Duration</span>
            <span className="meta-value">2h 30m</span>
            <span className="meta-sub">150 Minutes (9000s)</span>
          </div>

          <div className="meta-pill">
            <span className="meta-label">Paper Sections</span>
            <span className="meta-value">2 Papers</span>
            <span className="meta-sub">Science, Engg & Aptitude</span>
          </div>
        </div>

        {/* Main CTA Actions */}
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStartFullMock}
          >
            🚀 Start Full Mock Test (100 Qs)
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onShowInstructions}
          >
            📋 View Exam Instructions
          </button>
        </div>
      </section>

      {/* Mode B: Subject-wise Practice Section */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 className="section-title">📚 Practice by Subject (Instant Feedback Mode)</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Focus on individual subjects with instant answer evaluation to strengthen specific topics.
            </p>
          </div>
        </div>

        {/* Array.map() rendering subject cards */}
        <div className="subjects-grid">
          {SUBJECTS.map((sub) => (
            <div key={sub.name} className="subject-card">
              <div>
                <div className="subject-card-header">
                  <div className="subject-icon">{sub.icon}</div>
                  <div className="subject-info">
                    <h3>{sub.name}</h3>
                    <span className="paper-tag">{sub.paper} • {sub.questionRange}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
                  {sub.description}
                </p>
              </div>

              <div>
                <div className="subject-stats">
                  <span><strong>{sub.totalQuestions}</strong> Questions</span>
                  <span><strong>{sub.totalMarks}</strong> Marks</span>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", marginTop: "0.75rem" }}
                  onClick={() => onStartSubjectPractice(sub.name)}
                >
                  Practice {sub.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Syllabus & Exam Pattern Structure Breakdown */}
      <section className="info-card">
        <h3 className="section-title">🏛️ Official DDCET Pattern & Structure</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.925rem" }}>
          The Gujarat Diploma to Degree Common Entrance Test (DDCET) comprises two compulsory sections:
        </p>

        <div className="pattern-grid">
          <div className="pattern-box">
            <h4>Section 01: Paper BE-01 (100 Marks)</h4>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Basics of Science and Engineering (50 Questions)
            </p>
            <ul className="pattern-list">
              <li><span>Physics (Q.1 - Q.30)</span><strong>30 Qs / 60 Marks</strong></li>
              <li><span>Chemistry (Q.31 - Q.40)</span><strong>10 Qs / 20 Marks</strong></li>
              <li><span>Computer Practice (Q.41 - Q.45)</span><strong>5 Qs / 10 Marks</strong></li>
              <li><span>Environmental Science (Q.46 - Q.50)</span><strong>5 Qs / 10 Marks</strong></li>
            </ul>
          </div>

          <div className="pattern-box">
            <h4>Section 02: Paper BE-02 (100 Marks)</h4>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              Aptitude Test (Mathematics & Soft Skills) (50 Questions)
            </p>
            <ul className="pattern-list">
              <li><span>Mathematics (Q.51 - Q.75)</span><strong>25 Qs / 50 Marks</strong></li>
              <li><span>English Language / Soft Skills (Q.76 - Q.100)</span><strong>25 Qs / 50 Marks</strong></li>
            </ul>
          </div>
        </div>
      </section>

      {/* College Project Disclaimer Banner */}
      <footer style={{
        textAlign: "center",
        padding: "1.5rem",
        background: "#ffffff",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        color: "var(--text-muted)",
        fontSize: "0.85rem"
      }}>
        <p><strong>Note:</strong> This is a Student Practice Application / College Project designed for educational preparation purposes.</p>
        <p style={{ marginTop: "0.25rem" }}>This application is not officially affiliated with ACPC or GTU.</p>
      </footer>
    </div>
  );
}
