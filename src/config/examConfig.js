/**
 * DDCET Examination Configuration & Official ACPC Rules
 * 
 * Centralized configuration to prevent hard-coded values throughout the application.
 * Verify against official ACPC / GTU notifications before release.
 */

export const EXAM_CONFIG = {
  examName: "Gujarat DDCET Entrance Exam",
  targetAudience: "Diploma Engineering Students",
  totalQuestions: 100,
  maximumMarks: 200,
  durationMinutes: 150, // 2 Hours 30 Minutes
  durationSeconds: 9000,
  correctMarks: 2,
  wrongMarks: -0.5,
  unattemptedMarks: 0,
  
  // Section breakdown
  sections: [
    {
      id: "BE-01",
      name: "Basics of Science and Engineering",
      totalQuestions: 50,
      totalMarks: 100,
      subjects: ["Physics", "Chemistry", "Computer Practice", "Environmental Science"]
    },
    {
      id: "BE-02",
      name: "Aptitude Test",
      totalQuestions: 50,
      totalMarks: 100,
      subjects: ["Mathematics", "English"]
    }
  ],

  // Available previous-year papers and series
  papersList: [
    { id: "2024", year: "2024", series: "Official", title: "DDCET 2024 Paper", totalQuestions: 100 },
    { id: "2025", year: "2025", series: "Official", title: "DDCET 2025 Paper", totalQuestions: 100 },
    { id: "2026-A", year: "2026", series: "Series A", title: "DDCET 2026 (Series A)", totalQuestions: 100 },
    { id: "2026-B", year: "2026", series: "Series B", title: "DDCET 2026 (Series B)", totalQuestions: 100 },
    { id: "2026-C", year: "2026", series: "Series C", title: "DDCET 2026 (Series C)", totalQuestions: 100 },
    { id: "2026-D", year: "2026", series: "Series D", title: "DDCET 2026 (Series D)", totalQuestions: 100 }
  ]
};

/**
 * Format total seconds into HH:MM:SS string
 * @param {number} totalSeconds 
 * @returns {string} e.g. "02:29:45"
 */
export function formatDuration(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
