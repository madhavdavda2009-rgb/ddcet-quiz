/**
 * DDCET Practice Quiz Scoring and Helper Utilities
 * 
 * Pure JavaScript utility functions without side effects.
 */

/**
 * Standard Fisher-Yates shuffle algorithm (pure, returns new array)
 * @param {Array} array 
 * @returns {Array} Shuffled shallow copy
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
 * Generates a dynamic set of questions with randomized order and randomized option choices.
 * Preserves reading passage groupings and DDCET subject modules.
 * 
 * @param {Array} questionsList - Array of question objects
 * @param {Object} options
 * @param {boolean} [options.shuffleQuestions=true] - Whether to randomize question sequence
 * @param {boolean} [options.shuffleOptions=true] - Whether to randomize option choices (A, B, C, D)
 * @param {boolean} [options.preserveSections=true] - Whether to preserve DDCET subject order while randomizing within each subject
 * @returns {Array} Freshly randomized question objects with remapped correct answer keys
 */
export function generateDynamicQuestions(questionsList, {
  shuffleQuestions = true,
  shuffleOptions = true,
  preserveSections = true
} = {}) {
  if (!questionsList || questionsList.length === 0) return [];

  // Step 1: Shuffle questions
  let orderedQuestions = [];

  if (shuffleQuestions) {
    if (preserveSections) {
      // Group by subject in their original appearance order
      const subjectGroups = new Map();
      questionsList.forEach((q) => {
        if (!subjectGroups.has(q.subject)) {
          subjectGroups.set(q.subject, []);
        }
        subjectGroups.get(q.subject).push(q);
      });

      // Shuffle within each subject group while keeping passage questions contiguous
      subjectGroups.forEach((groupQuestions) => {
        const passageQuestions = groupQuestions.filter((q) => q.hasPassage);
        const nonPassageQuestions = groupQuestions.filter((q) => !q.hasPassage);

        const shuffledNonPassage = shuffleArray(nonPassageQuestions);

        if (passageQuestions.length > 0) {
          // Keep reading passage questions contiguous and insert at random valid position
          const insertIdx = Math.floor(Math.random() * (shuffledNonPassage.length + 1));
          shuffledNonPassage.splice(insertIdx, 0, ...passageQuestions);
        }

        orderedQuestions.push(...shuffledNonPassage);
      });
    } else {
      // Global shuffle
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
    orderedQuestions = [...questionsList];
  }

  // Step 2: Shuffle option choices (A, B, C, D) for each question and re-map correctAnswer
  return orderedQuestions.map((q) => {
    if (!shuffleOptions || !q.options || q.options.length === 0) {
      return { ...q };
    }

    // Capture original correct option text
    const originalCorrectIdx = getOptionIndex(q.correctAnswer);
    const correctOptionText = q.options[originalCorrectIdx] ?? q.options[0];

    // Create option objects with text
    const mappedOptions = q.options.map((optText) => ({
      text: optText,
      isCorrect: optText === correctOptionText
    }));

    // Shuffle options
    const shuffledMappedOptions = shuffleArray(mappedOptions);

    // Find new position of correct answer
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
 * Calculates detailed score and breakdowns based on DDCET examination rules.
 * 
 * Rules:
 * - Correct: +2 Marks
 * - Wrong: -0.5 Marks
 * - Unattempted: 0 Marks
 * - Max Marks: totalQuestions * 2
 * 
 * @param {Array} questionsList - Array of question objects
 * @param {Object} selectedAnswers - Map of questionId to chosen option letter ("A" | "B" | "C" | "D")
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

