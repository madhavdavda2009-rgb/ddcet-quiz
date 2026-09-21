import React, { useState } from "react";
import { SUBJECTS } from "../data/questions";

/**
 * 21st.dev Bookmarked Component: Filter Grid [id: 23525]
 * 
 * Segmented filter chips with live counts, accessible selection,
 * and smooth reflowing card grid for subject practice.
 */
export default function SubjectFilterGrid({ onStartSubjectPractice }) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filterOptions = [
    { id: "ALL", label: "All Subjects", count: SUBJECTS.length },
    { id: "BE-01", label: "BE-01 Section", count: SUBJECTS.filter((s) => s.paper === "BE-01").length },
    { id: "BE-02", label: "BE-02 Section", count: SUBJECTS.filter((s) => s.paper === "BE-02").length }
  ];

  const filteredSubjects = SUBJECTS.filter((s) => {
    if (activeFilter === "ALL") return true;
    return s.paper === activeFilter;
  });

  return (
    <div className="filter-grid-wrapper">
      {/* Segmented Radio Filter Chips */}
      <div className="filter-chips-container" role="tablist" aria-label="Subject Filter">
        {filterOptions.map((opt) => {
          const isActive = activeFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`filter-chip ${isActive ? "active" : ""}`}
              onClick={() => setActiveFilter(opt.id)}
            >
              <span className="chip-label">{opt.label}</span>
              <span className="chip-count">{opt.count}</span>
            </button>
          );
        })}
      </div>

      {/* Reflowing Cards Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map((subj) => (
          <div key={subj.name} className="subject-card filter-grid-card">
            <div className="subject-header">
              <span className="subject-icon">{subj.icon}</span>
              <div className="subject-titles">
                <span className="paper-badge">{subj.paper}</span>
                <h4>{subj.name}</h4>
              </div>
            </div>

            <p className="subject-desc">{subj.description}</p>

            <div className="subject-meta-footer">
              <div className="subject-stats">
                <span><strong>{subj.totalQuestions}</strong> Questions</span>
                <span className="dot-sep">&bull;</span>
                <span><strong>{subj.totalMarks}</strong> Marks</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm subject-btn"
                onClick={() => onStartSubjectPractice(subj.name)}
              >
                Practice →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
