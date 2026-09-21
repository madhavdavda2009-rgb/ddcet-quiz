import React, { useState, useRef, useEffect } from "react";

/**
 * 21st.dev Bookmarked Component: Hold to Confirm [id: 23527]
 * 
 * A press-and-hold button that fills a sweep progress animation and
 * fires `onConfirm` only when held down for the full duration (e.g. 1000ms).
 */
export default function HoldToConfirmButton({
  onConfirm,
  label = "Hold to Submit Test ➔",
  confirmingLabel = "Submitting...",
  holdDurationMs = 1000,
  className = "btn btn-success"
}) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  const startHold = () => {
    setIsHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        setIsHolding(false);
        setProgress(100);
        onConfirm();
      } else {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const cancelHold = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsHolding(false);
    setProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      className={`hold-to-confirm-btn ${className} ${isHolding ? "holding" : ""}`}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      aria-label={label}
    >
      {/* Background sweep progress fill */}
      <span
        className="hold-progress-bar"
        style={{ width: `${progress}%` }}
      />
      <span className="hold-btn-label">
        {isHolding ? (
          <>
            <span>⏳ Hold...</span>
            <span className="hold-percent">{Math.round(progress)}%</span>
          </>
        ) : (
          label
        )}
      </span>
    </button>
  );
}
