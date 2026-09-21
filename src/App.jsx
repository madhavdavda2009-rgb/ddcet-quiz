import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import ReviewAnswers from "./pages/ReviewAnswers";
import { questions as allQuestions } from "./data/questions";
import { calculateScore, generateDynamicQuestions } from "./utils/quizUtils";

/**
 * Main Application Component: DDCET Practice Quiz
 */
export default function App() {
  // Screen routing state: 'HOME' | 'INSTRUCTIONS' | 'QUIZ' | 'RESULT' | 'REVIEW'
  const [currentScreen, setCurrentScreen] = useState("HOME");

  // Active question set (full 100 or subject-filtered subset)
  const [activeQuestions, setActiveQuestions] = useState(() =>
    generateDynamicQuestions(allQuestions, { shuffleQuestions: true, shuffleOptions: true, preserveSections: true })
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // User Quiz responses & bookmark states
  // selectedAnswers: { [questionId]: "A" | "B" | "C" | "D" }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  // markedQuestions: { [questionId]: boolean }
  const [markedQuestions, setMarkedQuestions] = useState({});

  // Mode state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [modeTitle, setModeTitle] = useState("Full Mock Test");
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);

  // Timer state: 2 Hours 30 Minutes = 9000 seconds
  const [timeRemaining, setTimeRemaining] = useState(9000);

  // Calculated score report state
  const [scoreReport, setScoreReport] = useState(null);

  // ==========================================
  // REAL COUNTDOWN TIMER EFFECT
  // ==========================================
  useEffect(() => {
    // Only run timer in Mock Test mode while in Quiz screen
    if (currentScreen !== "QUIZ" || isPracticeMode) {
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          // Auto-submit when timer expires
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up interval on unmount or screen change
    return () => clearInterval(timerInterval);
  }, [currentScreen, isPracticeMode, activeQuestions, selectedAnswers]);

  // ==========================================
  // NAVIGATION & ACTION HANDLERS
  // ==========================================

  // Start Full 100 Question Mock Test (Generates new dynamic questions)
  const handleStartFullMock = () => {
    const dynamicSet = generateDynamicQuestions(allQuestions, {
      shuffleQuestions: true,
      shuffleOptions: true,
      preserveSections: true
    });
    setActiveQuestions(dynamicSet);
    setIsPracticeMode(false);
    setModeTitle("Full Mock Test (100 Qs)");
    setSelectedSubjectName(null);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(9000);
    setCurrentScreen("INSTRUCTIONS");
  };

  // Start Subject-wise Practice (Mode B - Generates new dynamic questions)
  const handleStartSubjectPractice = (subjectName) => {
    const filtered = allQuestions.filter((q) => q.subject === subjectName);
    const dynamicSet = generateDynamicQuestions(filtered, {
      shuffleQuestions: true,
      shuffleOptions: true,
      preserveSections: false
    });
    setActiveQuestions(dynamicSet);
    setIsPracticeMode(true);
    setModeTitle(`Practice: ${subjectName}`);
    setSelectedSubjectName(subjectName);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentScreen("QUIZ");
  };

  // Start Quiz from Instructions page
  const handleProceedToQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setTimeRemaining(9000); // 2 hours 30 min = 9000s
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

  // Clear answer for the current question
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

  // Direct question navigation from grid
  const handleSelectQuestion = (index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentIndex(index);
    }
  };

  // Submit test and calculate final scores
  const handleSubmitQuiz = () => {
    const report = calculateScore(activeQuestions, selectedAnswers);
    setScoreReport(report);
    setCurrentScreen("RESULT");
  };

  // Retry test with fresh dynamic questions
  const handleRetryTest = () => {
    let dynamicSet = [];
    if (isPracticeMode && selectedSubjectName) {
      const filtered = allQuestions.filter((q) => q.subject === selectedSubjectName);
      dynamicSet = generateDynamicQuestions(filtered, {
        shuffleQuestions: true,
        shuffleOptions: true,
        preserveSections: false
      });
    } else {
      dynamicSet = generateDynamicQuestions(allQuestions, {
        shuffleQuestions: true,
        shuffleOptions: true,
        preserveSections: true
      });
    }

    setActiveQuestions(dynamicSet);
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(9000);
    setScoreReport(null);
    setCurrentScreen("QUIZ");
  };

  // Return to Home Dashboard
  const handleGoHome = () => {
    setSelectedAnswers({});
    setMarkedQuestions({});
    setCurrentIndex(0);
    setTimeRemaining(9000);
    setScoreReport(null);
    setCurrentScreen("HOME");
  };

  return (
    <div className="app-container">
      {/* Top Sticky Header */}
      <Navbar
        onHomeClick={handleGoHome}
        currentScreen={currentScreen}
        mode={modeTitle}
        subjectName={selectedSubjectName}
      />

      {/* Main Dynamic Viewport */}
      <main className="main-content">
        {/* Conditional Rendering of Application Screens */}
        {currentScreen === "HOME" && (
          <Home
            onStartFullMock={handleStartFullMock}
            onStartSubjectPractice={handleStartSubjectPractice}
            onShowInstructions={() => setCurrentScreen("INSTRUCTIONS")}
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
            modeTitle={modeTitle}
          />
        )}

        {currentScreen === "REVIEW" && (
          <ReviewAnswers
            questions={activeQuestions}
            selectedAnswers={selectedAnswers}
            onBackToResult={() => setCurrentScreen("RESULT")}
            onBackToHome={handleGoHome}
          />
        )}
      </main>
    </div>
  );
}
