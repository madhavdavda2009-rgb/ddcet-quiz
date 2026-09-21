import React, { useState } from "react";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";
import NavigationButtons from "../components/NavigationButtons";
import SubmitModal from "../components/SubmitModal";

/**
 * Quiz Page Component
 * 
 * Main exam/practice view with question card, navigation buttons, question palette,
 * timer, and submit confirmation modal.
 */
export default function Quiz({
  questions,
  currentIndex,
  selectedAnswers,
  markedQuestions,
  timeRemaining,
  isPracticeMode,
  modeTitle,
  onSelectOption,
  onClearAnswer,
  onToggleMark,
  onNext,
  onPrevious,
  onSelectQuestion,
  onSubmitTest
}) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : null;
  const isMarked = currentQuestion ? !!markedQuestions[currentQuestion.id] : false;

  // Attempt counts for modal summary
  let attemptedCount = 0;
  let markedCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id]) attemptedCount++;
    if (markedQuestions[q.id]) markedCount++;
  });
  const unattemptedCount = questions.length - attemptedCount;

  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setIsSubmitModalOpen(false);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    onSubmitTest();
  };

  return (
    <div className="quiz-container">
      {/* Top Header Bar */}
      <div className="quiz-header-bar">
        <div className="quiz-header-left">
          <div className="quiz-badge-group">
            <span className="tag-badge tag-paper">{currentQuestion?.paper || "DDCET"}</span>
            <span className="tag-badge tag-subject">{currentQuestion?.subject || "Practice"}</span>
            <span className="tag-progress">
              Q. {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        <div className="quiz-header-right">
          {/* Mobile Quick-access Palette Button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm mobile-palette-btn"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Open question navigator palette"
          >
            📋 Palette ({currentIndex + 1}/{questions.length})
          </button>

          {/* Real Countdown Timer (Shown in Exam Modes) */}
          {!isPracticeMode && (
            <Timer timeRemaining={timeRemaining} />
          )}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="quiz-layout">
        {/* Left Column: Question Card and Action Controls */}
        <div className="quiz-main-column">
          <QuestionCard
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onSelectOption={onSelectOption}
            isPracticeMode={isPracticeMode}
          />

          <div className="quiz-navigation-wrapper">
            <NavigationButtons
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              onPrevious={onPrevious}
              onNext={onNext}
              onClearAnswer={onClearAnswer}
              onToggleMark={onToggleMark}
              isMarked={isMarked}
              onSubmitClick={handleOpenSubmitModal}
              isAnswerSelected={!!selectedAnswer}
            />
          </div>
        </div>

        {/* Right Column: Question Navigator */}
        <div className="quiz-side-column">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentIndex}
            selectedAnswers={selectedAnswers}
            markedQuestions={markedQuestions}
            onSelectQuestion={onSelectQuestion}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
          />
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      <SubmitModal
        isOpen={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        onConfirm={handleConfirmSubmit}
        attemptedCount={attemptedCount}
        unattemptedCount={unattemptedCount}
        markedCount={markedCount}
        totalCount={questions.length}
      />
    </div>
  );
}
