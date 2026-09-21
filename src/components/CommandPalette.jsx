import React, { useState, useEffect, useRef } from "react";

/**
 * 21st.dev Bookmarked Component: Command Palette [id: 23522]
 * 
 * A keyboard-driven command palette (Ctrl+K / Cmd+K) with live search,
 * grouped quick actions, arrow key navigation, and responsive overlay.
 */
export default function CommandPalette({
  isOpen,
  onClose,
  onStartFullMock,
  onStartPaper,
  onStartSubjectPractice,
  onStartQuickPractice,
  onViewHistory,
  onShowInstructions,
  onToggleTheme,
  theme
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  const commandItems = [
    {
      id: "full-mock",
      category: "Mock Tests",
      icon: "🚀",
      title: "Full 100Q Mock Test",
      subtitle: "BE-01 & BE-02 (150 mins timed)",
      action: () => {
        onStartFullMock();
        onClose();
      }
    },
    {
      id: "quick-10",
      category: "Mock Tests",
      icon: "⚡",
      title: "Quick 10 Questions Practice",
      subtitle: "15 mins rapid review",
      action: () => {
        onStartQuickPractice(10);
        onClose();
      }
    },
    {
      id: "quick-20",
      category: "Mock Tests",
      icon: "⚡",
      title: "Quick 20 Questions Practice",
      subtitle: "30 mins rapid review",
      action: () => {
        onStartQuickPractice(20);
        onClose();
      }
    },
    {
      id: "paper-2024",
      category: "Previous Papers",
      icon: "📄",
      title: "2024 DDCET Solved Question Paper",
      subtitle: "Official Gujarat DDCET paper",
      action: () => {
        onStartPaper("2024", false);
        onClose();
      }
    },
    {
      id: "paper-2023",
      category: "Previous Papers",
      icon: "📄",
      title: "2023 DDCET Solved Question Paper",
      subtitle: "Official GTU Diploma paper",
      action: () => {
        onStartPaper("2023", false);
        onClose();
      }
    },
    {
      id: "paper-2022",
      category: "Previous Papers",
      icon: "📄",
      title: "2022 DDCET Practice Paper Series",
      subtitle: "Curated model paper",
      action: () => {
        onStartPaper("2022", false);
        onClose();
      }
    },
    {
      id: "subject-math",
      category: "Subject Practice",
      icon: "📐",
      title: "Basic Mathematics Practice",
      subtitle: "Matrices, Differentiation, Integration, Trigonometry",
      action: () => {
        onStartSubjectPractice("Basic Mathematics");
        onClose();
      }
    },
    {
      id: "subject-physics",
      category: "Subject Practice",
      icon: "⚡",
      title: "Applied Physics & Chemistry Practice",
      subtitle: "Units, Mechanics, Electrochemistry, Semiconductors",
      action: () => {
        onStartSubjectPractice("Applied Physics & Chemistry");
        onClose();
      }
    },
    {
      id: "subject-computer",
      category: "Subject Practice",
      icon: "💻",
      title: "Computer & IT Engineering Practice",
      subtitle: "C Programming, Data Structures, Networking, Databases",
      action: () => {
        onStartSubjectPractice("Computer & IT Engineering");
        onClose();
      }
    },
    {
      id: "subject-mechanical",
      category: "Subject Practice",
      icon: "⚙️",
      title: "Mechanical & Automobile Engineering",
      subtitle: "Thermodynamics, IC Engines, Manufacturing",
      action: () => {
        onStartSubjectPractice("Mechanical & Automobile Engg");
        onClose();
      }
    },
    {
      id: "subject-electrical",
      category: "Subject Practice",
      icon: "🔌",
      title: "Electrical & Electronics Engineering",
      subtitle: "Circuits, Machines, Control Systems, Digital Electronics",
      action: () => {
        onStartSubjectPractice("Electrical & Electronics Engg");
        onClose();
      }
    },
    {
      id: "subject-civil",
      category: "Subject Practice",
      icon: "🏗️",
      title: "Civil & Environmental Engineering",
      subtitle: "Surveying, Concrete Tech, Fluid Mechanics",
      action: () => {
        onStartSubjectPractice("Civil & Environmental Engg");
        onClose();
      }
    },
    {
      id: "subject-aptitude",
      category: "Subject Practice",
      icon: "🧠",
      title: "General Aptitude & English Practice",
      subtitle: "Logical Reasoning, Quantitative Aptitude, Grammar",
      action: () => {
        onStartSubjectPractice("General Aptitude & English");
        onClose();
      }
    },
    {
      id: "nav-history",
      category: "Navigation",
      icon: "📊",
      title: "View History & Performance Analytics",
      subtitle: "Past test attempts, subject breakdown, score trends",
      action: () => {
        onViewHistory();
        onClose();
      }
    },
    {
      id: "nav-instructions",
      category: "Navigation",
      icon: "📋",
      title: "Exam Marking Scheme & Instructions",
      subtitle: "Negative marking rules (+1 / -0.25) & guidelines",
      action: () => {
        onShowInstructions();
        onClose();
      }
    },
    {
      id: "theme-toggle",
      category: "Preferences",
      icon: theme === "dark" ? "☀️" : "🌙",
      title: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode (Twitter Azure)`,
      subtitle: "Toggle color theme appearance",
      action: () => {
        onToggleTheme();
        onClose();
      }
    }
  ];

  // Filter commands by query
  const filteredItems = commandItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Handle keyboard navigation inside search overlay
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="command-palette-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="command-palette-card"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="cp-search-header">
          <span className="cp-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="cp-search-input"
            placeholder="Type a command or search subjects, papers, mock tests... (ESC to exit)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <kbd className="cp-kbd-esc">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="cp-results-list">
          {filteredItems.length === 0 ? (
            <div className="cp-no-results">
              <span>🔍 No matching commands found for "{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`cp-item ${isSelected ? "selected" : ""}`}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="cp-item-icon">{item.icon}</span>
                  <div className="cp-item-content">
                    <span className="cp-item-title">{item.title}</span>
                    <span className="cp-item-sub">{item.subtitle}</span>
                  </div>
                  <span className="cp-item-category">{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="cp-footer">
          <span>
            <kbd className="cp-kbd">↑</kbd> <kbd className="cp-kbd">↓</kbd> to navigate &bull;{" "}
            <kbd className="cp-kbd">↵</kbd> to select &bull; <kbd className="cp-kbd">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
