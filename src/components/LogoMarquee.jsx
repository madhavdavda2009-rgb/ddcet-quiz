import React from "react";

/**
 * 21st.dev Bookmarked Component: Logo Marquee [id: 23537]
 * 
 * Continuous scrolling strip displaying DDCET exam subjects, GTU diploma
 * branches, and key test topics with hover-pause support.
 */
export default function LogoMarquee() {
  const marqueeItems = [
    { icon: "⚡", title: "Physics & Mechanics", tag: "BE-01" },
    { icon: "🧪", title: "Chemistry & Materials", tag: "BE-01" },
    { icon: "💻", title: "Computer Practice & C Prog", tag: "BE-01" },
    { icon: "🌱", title: "Environmental Science", tag: "BE-01" },
    { icon: "📐", title: "Basic Mathematics & Calculus", tag: "BE-02" },
    { icon: "📖", title: "English & Grammar", tag: "BE-02" },
    { icon: "⚙️", title: "Mechanical Engineering", tag: "Diploma" },
    { icon: "🔌", title: "Electrical Engineering", tag: "Diploma" },
    { icon: "🏗️", title: "Civil Engineering", tag: "Diploma" },
    { icon: "🧠", title: "Quantitative Aptitude", tag: "BE-02" }
  ];

  // Double the items array for seamless loop
  const duplicatedItems = [...marqueeItems, ...marqueeItems];

  return (
    <div className="logo-marquee-container" aria-label="DDCET Subjects Marquee">
      <div className="logo-marquee-track">
        {duplicatedItems.map((item, index) => (
          <div key={`${item.title}-${index}`} className="marquee-badge-item">
            <span className="marquee-icon">{item.icon}</span>
            <span className="marquee-title">{item.title}</span>
            <span className="marquee-tag">{item.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
