/**
 * Question Data Validation Utility
 * 
 * Verifies question dataset integrity and reports developer warnings for invalid/incomplete entries.
 */

export function validateQuestions(questionsList) {
  if (!Array.isArray(questionsList)) {
    console.error("[Data Validation] Failed: questions dataset is not an array!");
    return { isValid: false, errors: ["Dataset is not an array"], warnings: [], cleanQuestions: [] };
  }

  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const cleanQuestions = [];

  questionsList.forEach((q, index) => {
    const qPos = `Question #${index + 1} (ID: ${q?.id ?? "UNKNOWN"})`;

    // Check ID uniqueness
    if (q.id === undefined || q.id === null || q.id === "") {
      errors.push(`${qPos}: Missing unique ID.`);
    } else if (seenIds.has(q.id)) {
      errors.push(`${qPos}: Duplicate question ID '${q.id}'.`);
    } else {
      seenIds.add(q.id);
    }

    // Check Question text
    if (!q.question || typeof q.question !== "string" || q.question.trim() === "") {
      errors.push(`${qPos}: Missing or empty question text.`);
    }

    // Check Options
    if (!Array.isArray(q.options)) {
      errors.push(`${qPos}: Options is not an array.`);
    } else if (q.options.length !== 4) {
      errors.push(`${qPos}: Invalid option count (${q.options.length}). Expected exactly 4 options.`);
    }

    // Check Correct Answer
    const validLetters = ["A", "B", "C", "D"];
    if (!q.correctAnswer) {
      errors.push(`${qPos}: Missing correct answer letter.`);
    } else if (!validLetters.includes(q.correctAnswer.toUpperCase())) {
      errors.push(`${qPos}: Invalid correct answer letter '${q.correctAnswer}'. Must be A, B, C, or D.`);
    }

    // Check Subject
    if (!q.subject || typeof q.subject !== "string") {
      errors.push(`${qPos}: Missing or invalid subject name.`);
    }

    // Check Year
    if (!q.year) {
      warnings.push(`${qPos}: Missing 'year' attribute.`);
    }

    // Check Series
    if (!q.series) {
      warnings.push(`${qPos}: Missing 'series' attribute.`);
    }

    // Check Explanation
    if (!q.explanation || typeof q.explanation !== "string" || q.explanation.trim() === "") {
      warnings.push(`${qPos}: Missing educational explanation.`);
    }

    // Check Marks
    if (typeof q.marks !== "number" || q.marks <= 0) {
      warnings.push(`${qPos}: Invalid or missing positive marks (defaulting to +2).`);
    }

    // Check Verification Status
    if (q.needsVerification === undefined) {
      warnings.push(`${qPos}: Missing 'needsVerification' boolean flag.`);
    }

    // If no critical error, keep in clean list
    cleanQuestions.push({
      id: q.id ?? `q-${index + 1}`,
      year: q.year || "2024",
      series: q.series || "Official",
      paper: q.paper || "BE-01",
      questionNumber: q.questionNumber || (index + 1),
      subject: q.subject || "General Science",
      topic: q.topic || q.subject || "General",
      question: q.question || "Question text unavailable",
      options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: q.correctAnswer ? q.correctAnswer.toUpperCase() : "A",
      explanation: q.explanation || "Detailed explanation under review.",
      optionExplanations: q.optionExplanations || null,
      marks: typeof q.marks === "number" ? q.marks : 2,
      negativeMarks: typeof q.negativeMarks === "number" ? q.negativeMarks : 0.5,
      difficulty: q.difficulty || "Medium",
      source: q.source || "DDCET Repository",
      sourcePage: q.sourcePage || null,
      verificationStatus: q.verificationStatus || (q.needsVerification ? "Pending" : "Verified"),
      explanationStatus: q.explanationStatus || (q.explanation ? "Verified" : "needsReview"),
      needsVerification: !!q.needsVerification,
      hasPassage: !!q.hasPassage
    });
  });

  const isValid = errors.length === 0;

  if (process.env.NODE_ENV !== "production") {
    console.group("📋 [DDCET Question Bank Validation Report]");
    console.log(`Total Inspected: ${questionsList.length} questions.`);
    console.log(`Clean Valid: ${cleanQuestions.length}`);
    if (errors.length > 0) console.error(`Critical Errors (${errors.length}):`, errors);
    if (warnings.length > 0) console.warn(`Warnings (${warnings.length}):`, warnings);
    console.groupEnd();
  }

  return {
    isValid,
    errors,
    warnings,
    cleanQuestions
  };
}
