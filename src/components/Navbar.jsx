import React from "react";

/**
 * Navbar Component
 * 
 * Demonstrates:
 * - Functional Component
 * - Props destructuring
 * - Conditional Rendering
 * - Event Handling
 */
export default function Navbar({ onHomeClick, currentScreen, mode, subjectName }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper" onClick={onHomeClick} style={{ cursor: "pointer" }}>
          <div className="brand-icon">D</div>
          <div className="brand-text">
            <h1>DDCET Practice Quiz</h1>
            <span className="college-badge">Student Practice Application / College Project</span>
          </div>
        </div>

        <div className="nav-actions">
          {currentScreen !== "HOME" && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onHomeClick}
              title="Return to Home Dashboard"
            >
              ← Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
