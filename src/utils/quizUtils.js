/**
 * DDCET Practice Quiz Pure Utilities
 * 
 * Functions for question shuffling, scoring, time formatting, and answer mapping.
 */

import { EXAM_CONFIG } from "../config/examConfig";

/**
 * Standard Fisher-Yates shuffle algorithm (pure, returns new array)
 * @param {Array} array 
 * @returns {Array} Shuffled copy
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Helper to map option index (0..3) to letter ("A".."D")
 * @param {number} index 
 * @returns {string}
 */
export function getOptionLetter(index) {
  return String.fromCharCode(65 + index); // 0 -> 'A', 1 -> 'B', etc.
}

/**
 * Helper to map letter ("A".."D") to option index (0..3)
 * @param {string} letter 
 * @returns {number}
 */
export function getOptionIndex(letter) {
  if (!letter) return 0;
  return letter.toUpperCase().charCodeAt(0) - 65;
}

/**
 * Generates dynamic or fixed question sets.
 * When shuffleQuestions=false and shuffleOptions=false (Previous Year Paper Mode),
 * exact original sequence and option order are preserved.
 * 
 * @param {Array} questionsList 
 * @param {Object} options
 * @returns {Array}
 */
export function generateDynamicQuestions(questionsList, {
  shuffleQuestions = true,
  shuffleOptions = true,
  preserveSections = true
} = {}) {
  if (!questionsList || questionsList.length === 0) return [];

  // Step 1: Sequence ordering
  let orderedQuestions = [];

  if (shuffleQuestions) {
    if (preserveSections) {
      const subjectGroups = new Map();
      questionsList.forEach((q) => {
        if (!subjectGroups.has(q.subject)) {
          subjectGroups.set(q.subject, []);
        }
        subjectGroups.get(q.subject).push(q);
      });

      subjectGroups.forEach((groupQuestions) => {
        const passageQuestions = groupQuestions.filter((q) => q.hasPassage);
        const nonPassageQuestions = groupQuestions.filter((q) => !q.hasPassage);
        const shuffledNonPassage = shuffleArray(nonPassageQuestions);

        if (passageQuestions.length > 0) {
          const insertIdx = Math.floor(Math.random() * (shuffledNonPassage.length + 1));
          shuffledNonPassage.splice(insertIdx, 0, ...passageQuestions);
        }

        orderedQuestions.push(...shuffledNonPassage);
      });
    } else {
      const passageQuestions = questionsList.filter((q) => q.hasPassage);
      const nonPassageQuestions = questionsList.filter((q) => !q.hasPassage);
      const shuffledNonPassage = shuffleArray(nonPassageQuestions);

      if (passageQuestions.length > 0) {
        const insertIdx = Math.floor(Math.random() * (shuffledNonPassage.length + 1));
        shuffledNonPassage.splice(insertIdx, 0, ...passageQuestions);
      }
      orderedQuestions = shuffledNonPassage;
    }
  } else {
    // Preserve original paper sequence strictly
    orderedQuestions = [...questionsList];
  }

  // Step 2: Option choices (A, B, C, D)
  return orderedQuestions.map((q) => {
    if (!shuffleOptions || !q.options || q.options.length === 0) {
      return { ...q };
    }

    const originalCorrectIdx = getOptionIndex(q.correctAnswer);
    const correctOptionText = q.options[originalCorrectIdx] ?? q.options[0];

    const mappedOptions = q.options.map((optText) => ({
      text: optText,
      isCorrect: optText === correctOptionText
    }));

    const shuffledMappedOptions = shuffleArray(mappedOptions);
    const newCorrectIdx = shuffledMappedOptions.findIndex((opt) => opt.isCorrect);
    const newCorrectLetter = getOptionLetter(newCorrectIdx >= 0 ? newCorrectIdx : 0);

    return {
      ...q,
      options: shuffledMappedOptions.map((opt) => opt.text),
      correctAnswer: newCorrectLetter
    };
  });
}

/**
 * Calculates detailed score report adhering to EXAM_CONFIG rules (+2 correct, -0.5 wrong, 0 unattempted).
 * 
 * @param {Array} questionsList 
 * @param {Object} selectedAnswers 
 * @returns {Object} Comprehensive calculation report
 */
export function calculateScore(questionsList, selectedAnswers = {}) {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;

  const correctWeight = EXAM_CONFIG.correctMarks; // +2
  const wrongPenalty = Math.abs(EXAM_CONFIG.wrongMarks); // 0.5

  const paperScores = {
    "BE-01": { name: "Basics of Science & Engineering", total: 0, attempted: 0, correct: 0, wrong: 0, positive: 0, negative: 0, score: 0, maxScore: 0, percentage: "0.0", accuracy: "0.0" },
    "BE-02": { name: "Aptitude Test (Maths & English)", total: 0, attempted: 0, correct: 0, wrong: 0, positive: 0, negative: 0, score: 0, maxScore: 0, percentage: "0.0", accuracy: "0.0" }
  };

  const subjectScores = {};

  questionsList.forEach((q) => {
    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = {
        subject: q.subject,
        paper: q.paper || "BE-01",
        total: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        unattempted: 0,
        positive: 0,
        negative: 0,
        score: 0,
        maxScore: 0,
        percentage: "0.0",
        accuracy: "0.0"
      };
    }

    const currentPaper = paperScores[q.paper] || paperScores["BE-01"];
    const currentSubject = subjectScores[q.subject];

    const qMarks = q.marks || correctWeight;
    const qNeg = Math.abs(q.negativeMarks || wrongPenalty);

    currentPaper.total += 1;
    currentPaper.maxScore += qMarks;
    currentSubject.total += 1;
    currentSubject.maxScore += qMarks;

    const answer = selectedAnswers[q.id];

    if (answer === undefined || answer === null || answer === "") {
      unattempted += 1;
      currentSubject.unattempted += 1;
    } else {
      currentPaper.attempted += 1;
      currentSubject.attempted += 1;

      if (answer.toUpperCase() === q.correctAnswer.toUpperCase()) {
        correct += 1;
        currentPaper.correct += 1;
        currentPaper.positive += qMarks;
        currentSubject.correct += 1;
        currentSubject.positive += qMarks;
      } else {
        wrong += 1;
        currentPaper.wrong += 1;
        currentPaper.negative += qNeg;
        currentSubject.wrong += 1;
        currentSubject.negative += qNeg;
      }
    }
  });

  // Compute stats for paper breakdown
  Object.keys(paperScores).forEach((key) => {
    const p = paperScores[key];
    p.score = Math.max(0, parseFloat((p.positive - p.negative).toFixed(2)));
    p.percentage = p.maxScore > 0 ? ((p.score / p.maxScore) * 100).toFixed(1) : "0.0";
    p.accuracy = p.attempted > 0 ? ((p.correct / p.attempted) * 100).toFixed(1) : "0.0";
  });

  // Compute stats for subject breakdown
  Object.keys(subjectScores).forEach((key) => {
    const s = subjectScores[key];
    s.score = Math.max(0, parseFloat((s.positive - s.negative).toFixed(2)));
    s.percentage = s.maxScore > 0 ? ((s.score / s.maxScore) * 100).toFixed(1) : "0.0";
    s.accuracy = s.attempted > 0 ? ((s.correct / s.attempted) * 100).toFixed(1) : "0.0";
  });

  const attempted = correct + wrong;
  const positiveMarks = Object.values(paperScores).reduce((acc, p) => acc + p.positive, 0);
  const negativeMarks = Object.values(paperScores).reduce((acc, p) => acc + p.negative, 0);
  const rawFinalScore = parseFloat((positiveMarks - negativeMarks).toFixed(2));
  const finalScore = Math.max(0, rawFinalScore);
  const maxPossibleMarks = questionsList.reduce((acc, q) => acc + (q.marks || correctWeight), 0);
  const percentage = maxPossibleMarks > 0 ? ((finalScore / maxPossibleMarks) * 100).toFixed(1) : "0.0";
  const accuracy = attempted > 0 ? ((correct / attempted) * 100).toFixed(1) : "0.0";

  return {
    totalQuestions: questionsList.length,
    attempted,
    unattempted,
    correct,
    wrong,
    positiveMarks,
    negativeMarks,
    finalScore,
    rawFinalScore,
    maxPossibleMarks,
    percentage,
    accuracy,
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
  if (!totalSeconds || totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

