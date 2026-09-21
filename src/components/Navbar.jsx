import React from "react";

/**
 * Navbar Component
 * 
 * Sticky top navigation bar with clean branding and responsive home action.
 */
export default function Navbar({ onHomeClick, currentScreen, mode, subjectName }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div
          className="brand-wrapper"
          onClick={onHomeClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onHomeClick();
          }}
          aria-label="DDCET Quiz Home"
        >
          <div className="brand-icon">D</div>
          <div className="brand-text">
            <h1>DDCET Quiz</h1>
            <span className="college-badge">Practice Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          {currentScreen !== "HOME" && (
            <button
              type="button"
              className="btn btn-secondary btn-sm nav-home-btn"
              onClick={onHomeClick}
              title="Return to Home Dashboard"
            >
              🏠 <span className="nav-home-text">Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

