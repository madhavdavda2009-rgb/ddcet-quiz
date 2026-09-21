import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import CommandPalette from "./components/CommandPalette";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import ReviewAnswers from "./pages/ReviewAnswers";
import History from "./pages/History";
import { questions as masterQuestions, getPaperQuestions } from "./data/questions";
import { calculateScore, generateDynamicQuestions } from "./utils/quizUtils";
import { validateQuestions } from "./utils/validationUtils";
import { saveAttemptRecord } from "./utils/historyUtils";
import { EXAM_CONFIG } from "./config/examConfig";

/**
 * Main Application Component: DDCET Practice Quiz
 */
export default function App() {
  // Validate question dataset on startup
  useEffect(() => {
    validateQuestions(masterQuestions);
  }, []);

  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("ddcet-theme");
      return saved === "dark" ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  });

  // Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Theme persistence & DOM attribute sync effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("ddcet-theme", theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Application Screen state: 'HOME' | 'INSTRUCTIONS' | 'QUIZ' | 'RESULT' | 'REVIEW' | 'HISTORY'
  const [currentScreen, setCurrentScreen] = useState("HOME");

  // Active question set
  const [activeQuestions, setActiveQuestions] = useState(() =>
    generateDynamicQuestions(masterQuestions, { shuffleQuestions: true, shuffleOptions: true, preserveSections: true })
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // User Quiz responses & bookmark states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});

  // Mode & Configuration state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [modeTitle, setModeTitle] = useState("Full Mock Test");
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [selectedPaperMeta, setSelectedPaperMeta] = useState(null);

  // Timer state (seconds)
  const [initialDuration, setInitialDuration] = useState(EXAM_CONFIG.durationSeconds);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_CONFIG.durationSeconds);

  // Calculated score report state
  const [scoreReport, setScoreReport] = useState(null);
  const [timeUsedSeconds, setTimeUsedSeconds] = useState(0);

  // Ref to prevent duplicate submissions
  const isSubmittingRef = useRef(false);

  // ==========================================
  // COUNTDOWN TIMER EFFECT
  // ==========================================
  useEffect(() => {
    if (currentScreen !== "QUIZ" || isPracticeMode) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          if (!isSubmittingRef.current) {
            handleAutoSubmitQuiz();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentScreen, isPracticeMode]);

  // ==========================================
  // ACTION HANDLERS & NAVIGATION
  // ==========================================

  // Start Full 100 Question Mock Test
  const handleStartFullMock = () => {
    isSubmittingRef.current = false;
    const dynamicSet = generateDynamicQuestions(masterQuestions, {
      shuffleQuestions: true,
      shuffleOptions: true,
      preserveSections: true
    });
    setActiveQuestions(dynamicSet);
    setIsPracticeMode(false);
    setModeTitle("Full Mock Test (100 Qs)");
    setSelectedSubjectName(null);
    setSelectedPaperMeta(null);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setInitialDuration(EXAM_CONFIG.durationSeconds);
    setTimeRemaining(EXAM_CONFIG.durationSeconds);
    setCurrentScreen("INSTRUCTIONS");
  };

  // Start Previous Year Paper or Series
  const handleStartPaper = (paperId, asPracticeMode = false) => {
    isSubmittingRef.current = false;
    const paperInfo = EXAM_CONFIG.papersList.find((p) => p.id === paperId) || EXAM_CONFIG.papersList[0];
    const paperQuestions = getPaperQuestions(paperId);

    const fixedSet = generateDynamicQuestions(paperQuestions, {
      shuffleQuestions: false,
      shuffleOptions: false,
      preserveSections: true
    });

    setActiveQuestions(fixedSet);
    setIsPracticeMode(asPracticeMode);
    setModeTitle(`${paperInfo.title} (${asPracticeMode ? "Practice Mode" : "Exam Mode"})`);
    setSelectedSubjectName(null);
    setSelectedPaperMeta(paperInfo);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);

    const duration = asPracticeMode ? 0 : EXAM_CONFIG.durationSeconds;
    setInitialDuration(duration);
    setTimeRemaining(duration);

    if (asPracticeMode) {
      setCurrentScreen("QUIZ");
    } else {
      setCurrentScreen("INSTRUCTIONS");
    }
  };

  // Start Subject-wise Practice Mode
  const handleStartSubjectPractice = (subjectName) => {
    isSubmittingRef.current = false;
    const filtered = masterQuestions.filter((q) => q.subject === subjectName);
    const dynamicSet = generateDynamicQuestions(filtered, {
      shuffleQuestions: true,
      shuffleOptions: true,
      preserveSections: false
    });

    setActiveQuestions(dynamicSet);
    setIsPracticeMode(true);
    setModeTitle(`Practice: ${subjectName}`);
    setSelectedSubjectName(subjectName);
    setSelectedPaperMeta(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setInitialDuration(0);
    setTimeRemaining(0);
    setCurrentScreen("QUIZ");
  };

  // Start Quick Random Practice (10, 20, 30 Qs)
  const handleStartQuickPractice = (count) => {
    isSubmittingRef.current = false;
    const shuffledAll = generateDynamicQuestions(masterQuestions, {
      shuffleQuestions: true,
      shuffleOptions: true,
      preserveSections: false
    });
    const subset = shuffledAll.slice(0, count);

    const durationSeconds = count * 90; // 1.5 mins per question

    setActiveQuestions(subset);
    setIsPracticeMode(false);
    setModeTitle(`Quick Practice (${count} Qs)`);
    setSelectedSubjectName(null);
    setSelectedPaperMeta(null);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setInitialDuration(durationSeconds);
    setTimeRemaining(durationSeconds);
    setCurrentScreen("INSTRUCTIONS");
  };

  // Start Quiz from Instructions page
  const handleProceedToQuiz = () => {
    setCurrentIndex(0);
    setCurrentScreen("QUIZ");
  };

  // Option selection
  const handleSelectOption = (letter) => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: letter
    }));
  };

  // Clear answer for current question
  const handleClearAnswer = () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQ.id];
      return updated;
    });
  };

  // Toggle Mark for Review
  const handleToggleMark = () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  // Previous Question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Next Question
  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Direct Question palette navigation
  const handleSelectQuestion = (index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentIndex(index);
    }
  };

  // Submit test and calculate final scores
  const handleSubmitQuiz = () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const report = calculateScore(activeQuestions, selectedAnswers);
    const elapsed = isPracticeMode ? 0 : Math.max(0, initialDuration - timeRemaining);

    setScoreReport(report);
    setTimeUsedSeconds(elapsed);

    // Save attempt record to anonymous localStorage history
    saveAttemptRecord({
      modeTitle,
      paper: selectedPaperMeta ? selectedPaperMeta.title : "Mock Practice",
      year: selectedPaperMeta ? selectedPaperMeta.year : "2024",
      series: selectedPaperMeta ? selectedPaperMeta.series : "Official",
      finalScore: report.finalScore,
      maxPossibleMarks: report.maxPossibleMarks,
      percentage: report.percentage,
      correct: report.correct,
      wrong: report.wrong,
      unattempted: report.unattempted,
      attempted: report.attempted,
      totalQuestions: report.totalQuestions,
      timeUsedSeconds: elapsed,
      subjectScores: report.subjectScores
    });

    setCurrentScreen("RESULT");
  };

  const handleAutoSubmitQuiz = () => {
    handleSubmitQuiz();
  };

  // Retry test with fresh question state
  const handleRetryTest = () => {
    isSubmittingRef.current = false;
    let dynamicSet = [];

    if (selectedPaperMeta) {
      const paperQuestions = getPaperQuestions(selectedPaperMeta.id);
      dynamicSet = generateDynamicQuestions(paperQuestions, {
        shuffleQuestions: false,
        shuffleOptions: false,
        preserveSections: true
      });
    } else if (isPracticeMode && selectedSubjectName) {
      const filtered = masterQuestions.filter((q) => q.subject === selectedSubjectName);
      dynamicSet = generateDynamicQuestions(filtered, {
        shuffleQuestions: true,
        shuffleOptions: true,
        preserveSections: false
      });
    } else {
      dynamicSet = generateDynamicQuestions(masterQuestions, {
        shuffleQuestions: true,
        shuffleOptions: true,
        preserveSections: true
      });
    }

    setActiveQuestions(dynamicSet);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(initialDuration);
    setScoreReport(null);
    setCurrentScreen("QUIZ");
  };

  // Navigation callbacks
  const handleGoHome = () => {
    isSubmittingRef.current = false;
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(EXAM_CONFIG.durationSeconds);
    setScoreReport(null);
    setCurrentScreen("HOME");
  };

  const handleGoHistory = () => {
    setCurrentScreen("HISTORY");
  };

  const handleGoPractice = () => {
    if (currentScreen !== "HOME") setCurrentScreen("HOME");
    setTimeout(() => {
      const practiceSec = document.getElementById("practice-section");
      if (practiceSec) practiceSec.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleGoPapers = () => {
    if (currentScreen !== "HOME") setCurrentScreen("HOME");
    setTimeout(() => {
      const papersSec = document.getElementById("papers-section");
      if (papersSec) papersSec.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="app-container">
      {/* 21st.dev Bookmarked Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onStartFullMock={handleStartFullMock}
        onStartPaper={handleStartPaper}
        onStartSubjectPractice={handleStartSubjectPractice}
        onStartQuickPractice={handleStartQuickPractice}
        onViewHistory={handleGoHistory}
        onShowInstructions={() => setCurrentScreen("INSTRUCTIONS")}
        onToggleTheme={handleToggleTheme}
        theme={theme}
      />

      {/* Navbar with complete nav links, command palette trigger & theme toggle */}
      <Navbar
        onHomeClick={handleGoHome}
        onHistoryClick={handleGoHistory}
        onPracticeClick={handleGoPractice}
        onPapersClick={handleGoPapers}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        currentScreen={currentScreen}
        modeTitle={modeTitle}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Viewport */}
      <main className="main-content">
        {currentScreen === "HOME" && (
          <Home
            onStartFullMock={handleStartFullMock}
            onStartPaper={handleStartPaper}
            onStartSubjectPractice={handleStartSubjectPractice}
            onStartQuickPractice={handleStartQuickPractice}
            onShowInstructions={() => setCurrentScreen("INSTRUCTIONS")}
            onViewHistory={handleGoHistory}
          />
        )}

        {currentScreen === "INSTRUCTIONS" && (
          <Instructions
            onStartTest={handleProceedToQuiz}
            onBackHome={handleGoHome}
          />
        )}

        {currentScreen === "QUIZ" && (
          <Quiz
            questions={activeQuestions}
            currentIndex={currentIndex}
            selectedAnswers={selectedAnswers}
            markedQuestions={markedQuestions}
            timeRemaining={timeRemaining}
            isPracticeMode={isPracticeMode}
            modeTitle={modeTitle}
            onSelectOption={handleSelectOption}
            onClearAnswer={handleClearAnswer}
            onToggleMark={handleToggleMark}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSelectQuestion={handleSelectQuestion}
            onSubmitTest={handleSubmitQuiz}
          />
        )}

        {currentScreen === "RESULT" && scoreReport && (
          <Result
            scoreReport={scoreReport}
            onReview={() => setCurrentScreen("REVIEW")}
            onRetry={handleRetryTest}
            onHome={handleGoHome}
            onViewHistory={handleGoHistory}
            modeTitle={modeTitle}
            timeUsedSeconds={timeUsedSeconds}
          />
        )}

        {currentScreen === "REVIEW" && (
          <ReviewAnswers
            questions={activeQuestions}
            selectedAnswers={selectedAnswers}
            markedQuestions={markedQuestions}
            onBackToResult={() => setCurrentScreen("RESULT")}
            onBackToHome={handleGoHome}
          />
        )}

        {currentScreen === "HISTORY" && (
          <History
            onStartMock={handleStartFullMock}
            onStartPaper={handleStartPaper}
            onStartSubjectPractice={handleStartSubjectPractice}
            onBackHome={handleGoHome}
          />
        )}
      </main>
    </div>
  );
}
