/**
 * DDCET Practice Quiz Scoring and Helper Utilities
 * 
 * College Project Viva Ready:
 * Pure JavaScript utility functions without side effects.
 */

/**
 * Calculates detailed score and breakdowns based on DDCET examination rules.
 * 
 * Rules:
 * - Correct: +2 Marks
 * - Wrong: -0.5 Marks
 * - Unattempted: 0 Marks
 * - Max Marks: totalQuestions * 2
 * 
 * @param {Array} questionsList - Array of question objects
 * @param {Object} selectedAnswers - Map of questionId (or index) to chosen option letter ("A" | "B" | "C" | "D")
 * @returns {Object} Comprehensive calculation report
 */
export function calculateScore(questionsList, selectedAnswers = {}) {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  // Track breakdown by Paper (BE-01, BE-02)
  const paperScores = {
    "BE-01": { total: 0, attempted: 0, correct: 0, wrong: 0, positive: 0, negative: 0, score: 0, maxScore: 0 },
    "BE-02": { total: 0, attempted: 0, correct: 0, wrong: 0, positive: 0, negative: 0, score: 0, maxScore: 0 }
  };

  // Track breakdown by Subject
  const subjectScores = {};

  questionsList.forEach((q) => {
    // Initialize subject accumulator if not present
    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = {
        subject: q.subject,
        paper: q.paper,
        total: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        positive: 0,
        negative: 0,
        score: 0,
        maxScore: 0
      };
    }

    const currentPaper = paperScores[q.paper] || paperScores["BE-01"];
    const currentSubject = subjectScores[q.subject];

    currentPaper.total += 1;
    currentPaper.maxScore += q.marks || 2;
    currentSubject.total += 1;
    currentSubject.maxScore += q.marks || 2;

    const answer = selectedAnswers[q.id];

    if (answer === undefined || answer === null || answer === "") {
      unattempted += 1;
    } else {
      currentPaper.attempted += 1;
      currentSubject.attempted += 1;

      if (answer.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correct += 1;
        currentPaper.correct += 1;
        currentPaper.positive += 2;
        currentSubject.correct += 1;
        currentSubject.positive += 2;
      } else {
        wrong += 1;
        currentPaper.wrong += 1;
        currentPaper.negative += 0.5;
        currentSubject.wrong += 1;
        currentSubject.negative += 0.5;
      }
    }
  });

  // Calculate net scores for paper and subjects
  Object.keys(paperScores).forEach((key) => {
    const p = paperScores[key];
    p.score = Math.max(0, p.positive - p.negative);
    p.percentage = p.maxScore > 0 ? ((p.score / p.maxScore) * 100).toFixed(1) : "0.0";
  });

  Object.keys(subjectScores).forEach((key) => {
    const s = subjectScores[key];
    s.score = Math.max(0, s.positive - s.negative);
    s.percentage = s.maxScore > 0 ? ((s.score / s.maxScore) * 100).toFixed(1) : "0.0";
  });

  const positiveMarks = correct * 2;
  const negativeMarks = wrong * 0.5;
  const rawFinalScore = positiveMarks - negativeMarks;
  const finalScore = Math.max(0, rawFinalScore); // Prevent negative total score
  const maxPossibleMarks = questionsList.length * 2;
  const percentage = maxPossibleMarks > 0 ? ((finalScore / maxPossibleMarks) * 100).toFixed(1) : "0.0";

  return {
    totalQuestions: questionsList.length,
    attempted: correct + wrong,
    unattempted,
    correct,
    wrong,
    positiveMarks,
    negativeMarks,
    finalScore,
    rawFinalScore,
    maxPossibleMarks,
    percentage,
    paperScores,
    subjectScores
  };
}

/**
 * Format total seconds into HH:MM:SS string
 * @param {number} totalSeconds 
 * @returns {string} e.g. "02:29:45"
 */
export function formatTime(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Helper to map option index (0..3) to letter ("A".."D")
 * @param {number} index 
 * @returns {string}
 */
export function getOptionLetter(index) {
  return String.fromCharCode(65 + index); // 0 -> 'A', 1 -> 'B', etc.
}
