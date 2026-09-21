import React, { useState } from "react";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";
import NavigationButtons from "../components/NavigationButtons";
import SubmitModal from "../components/SubmitModal";

/**
 * Quiz Page Component
 * 
 * Demonstrates:
 * - Functional Component
 * - useState for modal management
 * - Multiple reusable child components (Timer, QuestionCard, QuestionNavigator, NavigationButtons)
 * - Props passing
 * - Conditional Rendering (SubmitModal, Timer display based on mode)
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

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? selectedAnswers[currentQuestion.id] : null;
  const isMarked = currentQuestion ? !!markedQuestions[currentQuestion.id] : false;

  // Counts for modal confirmation
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
        <div className="quiz-badge-group">
          <span className="tag-badge tag-paper">{currentQuestion?.paper || "DDCET"}</span>
          <span className="tag-badge tag-subject">{currentQuestion?.subject || "Practice"}</span>
          <span className="tag-progress">
            Q. {currentIndex + 1} / {questions.length} ({modeTitle})
          </span>
        </div>

        {/* Real Countdown Timer (Full Mock Test Mode) */}
        {!isPracticeMode && (
          <Timer timeRemaining={timeRemaining} />
        )}
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

          <div style={{ marginTop: "1.25rem" }}>
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
