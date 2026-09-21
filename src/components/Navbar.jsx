import React, { useState } from "react";

/**
 * Navbar Component with 21st.dev Twitter Azure aesthetic & Command Palette trigger
 */
export default function Navbar({
  onHomeClick,
  onHistoryClick,
  onPracticeClick,
  onPapersClick,
  onOpenCommandPalette,
  currentScreen,
  modeTitle,
  theme = "light",
  onToggleTheme
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (action) => {
    setIsMobileMenuOpen(false);
    if (action) action();
  };

  const isDark = theme === "dark";
  const toggleLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div
          className="brand-wrapper"
          onClick={() => handleNavClick(onHomeClick)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleNavClick(onHomeClick);
          }}
          aria-label="DDCET Practice Quiz Home"
        >
          <div className="brand-icon">D</div>
          <div className="brand-text">
            <h1>DDCET Practice Quiz</h1>
            <span className="college-badge">Diploma Entrance Portal</span>
          </div>
        </div>

        {/* Active Mode Indicator (when in Quiz screen) */}
        {modeTitle && currentScreen === "QUIZ" && (
          <div className="nav-mode-badge" title="Active Practice Session">
            🎯 {modeTitle}
          </div>
        )}

        {/* Right Action Container: Nav Links + Search Kbd + Theme Toggle */}
        <div className="navbar-right-group">
          {/* Desktop Navigation Links */}
          <nav className="desktop-nav-links" aria-label="Main Navigation">
            <button
              type="button"
              className={`nav-link-item ${currentScreen === "HOME" ? "active" : ""}`}
              onClick={() => handleNavClick(onHomeClick)}
            >
              Home
            </button>

            <button
              type="button"
              className="nav-link-item"
              onClick={() => handleNavClick(onPracticeClick)}
            >
              Practice
            </button>

            <button
              type="button"
              className="nav-link-item"
              onClick={() => handleNavClick(onPapersClick)}
            >
              Previous Papers
            </button>

            <button
              type="button"
              className={`nav-link-item ${currentScreen === "HISTORY" ? "active" : ""}`}
              onClick={() => handleNavClick(onHistoryClick)}
            >
              History & Analytics
            </button>
          </nav>

          {/* Quick Command Palette Launcher */}
          <button
            type="button"
            className="nav-search-btn"
            onClick={onOpenCommandPalette}
            title="Search commands & subjects (Ctrl+K)"
            aria-label="Search command palette"
          >
            <span className="search-icon">🔍</span>
            <span className="search-text">Search...</span>
            <kbd className="search-kbd">Ctrl K</kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={toggleLabel}
            title={toggleLabel}
          >
            <span className="theme-toggle-icon">{isDark ? "☀️" : "🌙"}</span>
            <span className="theme-toggle-text">{isDark ? "Light" : "Dark"}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="navigation" aria-label="Mobile Navigation">
          <button
            type="button"
            className="mobile-nav-item search-highlight"
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenCommandPalette) onOpenCommandPalette();
            }}
          >
            🔍 Search Palette (Ctrl+K)
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${currentScreen === "HOME" ? "active" : ""}`}
            onClick={() => handleNavClick(onHomeClick)}
          >
            🏠 Home Dashboard
          </button>

          <button
            type="button"
            className="mobile-nav-item"
            onClick={() => handleNavClick(onPracticeClick)}
          >
            ⚡ Subject & Quick Practice
          </button>

          <button
            type="button"
            className="mobile-nav-item"
            onClick={() => handleNavClick(onPapersClick)}
          >
            📄 Previous Papers (2024-2026)
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${currentScreen === "HISTORY" ? "active" : ""}`}
            onClick={() => handleNavClick(onHistoryClick)}
          >
            📊 History & Analytics
          </button>

          <div className="mobile-drawer-theme-toggle">
            <button
              type="button"
              className="btn btn-secondary btn-sm mobile-theme-btn"
              onClick={() => {
                onToggleTheme();
                setIsMobileMenuOpen(false);
              }}
              aria-label={toggleLabel}
            >
              {isDark ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
