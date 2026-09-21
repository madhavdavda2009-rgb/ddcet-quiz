/**
 * Anonymous History & Dynamic Recommendations Storage Utility
 * 
 * Manages anonymous test attempts in browser localStorage without login.
 * Handles localStorage unavailability gracefully without crashing.
 */

const HISTORY_STORAGE_KEY = "ddcet_quiz_anonymous_history";
const PROFILE_ID_KEY = "ddcet_quiz_anonymous_profile_id";

/**
 * Checks if localStorage is functional
 */
export function isLocalStorageAvailable() {
  try {
    const testKey = "__ddcet_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Gets existing profile ID or generates a new anonymous UUID.
 */
export function getOrCreateAnonymousProfileId() {
  if (!isLocalStorageAvailable()) return "anon-session-id";
  try {
    let profileId = localStorage.getItem(PROFILE_ID_KEY);
    if (!profileId) {
      if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        profileId = crypto.randomUUID();
      } else {
        profileId = "anon-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 9);
      }
      localStorage.setItem(PROFILE_ID_KEY, profileId);
    }
    return profileId;
  } catch (e) {
    return "anon-fallback-id";
  }
}

/**
 * Fetch all saved attempt history records
 * @returns {Array} Array of attempt records
 */
export function getAttemptHistory() {
  if (!isLocalStorageAvailable()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[History Utility] Failed to load history from localStorage:", e);
    return [];
  }
}

/**
 * Saves a completed quiz attempt into anonymous localStorage history
 * 
 * @param {Object} attemptData 
 * @returns {boolean} Success status
 */
export function saveAttemptRecord(attemptData) {
  if (!isLocalStorageAvailable()) {
    console.warn("[History Utility] localStorage unavailable. Attempt will not persist.");
    return false;
  }

  try {
    const history = getAttemptHistory();
    const profileId = getOrCreateAnonymousProfileId();

    // Extract weak topics (accuracy < 50% in subjects/topics with at least 2 questions attempted)
    const weakTopics = [];
    if (attemptData.subjectScores) {
      Object.keys(attemptData.subjectScores).forEach((subName) => {
        const sub = attemptData.subjectScores[subName];
        const subAccuracy = sub.attempted > 0 ? (sub.correct / sub.attempted) * 100 : 0;
        if (sub.attempted > 0 && subAccuracy < 50) {
          weakTopics.push({
            subject: subName,
            paper: sub.paper,
            accuracy: Math.round(subAccuracy),
            correct: sub.correct,
            attempted: sub.attempted
          });
        }
      });
    }

    const newRecord = {
      attemptId: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `att-${Date.now()}`,
      profileId,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      modeTitle: attemptData.modeTitle || "Mock Test",
      paper: attemptData.paper || "Full Paper",
      year: attemptData.year || "2024",
      series: attemptData.series || "Official",
      score: attemptData.finalScore,
      maxPossibleMarks: attemptData.maxPossibleMarks,
      percentage: Number(attemptData.percentage),
      correct: attemptData.correct,
      wrong: attemptData.wrong,
      unattempted: attemptData.unattempted,
      attempted: attemptData.attempted,
      totalQuestions: attemptData.totalQuestions,
      accuracy: attemptData.attempted > 0 ? Math.round((attemptData.correct / attemptData.attempted) * 100) : 0,
      timeUsedSeconds: attemptData.timeUsedSeconds || 0,
      subjectScores: attemptData.subjectScores || {},
      weakTopics
    };

    // Prepend new attempt (newest first)
    const updatedHistory = [newRecord, ...history].slice(0, 50); // keep last 50 attempts
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
    return true;
  } catch (e) {
    console.error("[History Utility] Failed to save attempt record:", e);
    return false;
  }
}

/**
 * Clears all local history records
 */
export function clearAttemptHistory() {
  if (!isLocalStorageAvailable()) return false;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Calculates aggregate stats and dynamic recommendations across attempts
 */
export function calculateAnalytics() {
  const history = getAttemptHistory();
  if (history.length === 0) {
    return {
      attemptCount: 0,
      bestScore: 0,
      bestPercentage: 0,
      averageAccuracy: 0,
      recentAttempts: [],
      weakSubjects: [],
      recommendations: []
    };
  }

  const attemptCount = history.length;
  let maxScore = 0;
  let maxPct = 0;
  let totalAccuracySum = 0;

  // Aggregate subject stats
  const subjectAggregates = {};

  history.forEach((record) => {
    if (record.score > maxScore) maxScore = record.score;
    if (record.percentage > maxPct) maxPct = record.percentage;
    totalAccuracySum += record.accuracy;

    if (record.subjectScores) {
      Object.keys(record.subjectScores).forEach((subName) => {
        const sub = record.subjectScores[subName];
        if (!subjectAggregates[subName]) {
          subjectAggregates[subName] = { correct: 0, attempted: 0, total: 0 };
        }
        subjectAggregates[subName].correct += sub.correct || 0;
        subjectAggregates[subName].attempted += sub.attempted || 0;
        subjectAggregates[subName].total += sub.total || 0;
      });
    }
  });

  const averageAccuracy = Math.round(totalAccuracySum / attemptCount);

  // Determine weak subjects across history (accuracy < 60% and at least 5 Qs attempted)
  const weakSubjects = [];
  Object.keys(subjectAggregates).forEach((subName) => {
    const agg = subjectAggregates[subName];
    if (agg.attempted >= 5) {
      const acc = Math.round((agg.correct / agg.attempted) * 100);
      if (acc < 60) {
        weakSubjects.push({
          subject: subName,
          accuracy: acc,
          correct: agg.correct,
          attempted: agg.attempted
        });
      }
    }
  });

  // Sort weak subjects by lowest accuracy
  weakSubjects.sort((a, b) => a.accuracy - b.accuracy);

  // Generate dynamic objective recommendations
  const recommendations = [];
  if (weakSubjects.length > 0) {
    weakSubjects.forEach((ws) => {
      recommendations.push({
        type: "WEAK_SUBJECT",
        subject: ws.subject,
        text: `Your recent accuracy in ${ws.subject} is ${ws.accuracy}%, which is lower than your overall average (${averageAccuracy}%).`,
        action: `Practice ${ws.subject}`
      });
    });
  } else if (averageAccuracy < 70) {
    recommendations.push({
      type: "GENERAL_PRACTICE",
      subject: "All Subjects",
      text: `Your overall practice accuracy is ${averageAccuracy}%. Taking full mock tests under exam conditions will build time management skills.`,
      action: "Start Full Mock Test"
    });
  } else {
    recommendations.push({
      type: "EXCELLENT_PROGRESS",
      subject: "Mock Tests",
      text: `Great performance! Your overall accuracy is ${averageAccuracy}%. Keep practicing previous year series papers to maintain speed and precision.`,
      action: "Practice 2026 Series Papers"
    });
  }

  return {
    attemptCount,
    bestScore: maxScore,
    bestPercentage: maxPct,
    averageAccuracy,
    recentAttempts: history.slice(0, 10),
    weakSubjects,
    recommendations
  };
}
