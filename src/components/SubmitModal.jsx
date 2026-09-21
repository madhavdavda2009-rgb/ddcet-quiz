import React from "react";
import HoldToConfirmButton from "./HoldToConfirmButton";

/**
 * SubmitModal Component with 21st.dev Hold to Confirm submit protection
 * 
 * Submission confirmation modal with attempt summary metrics and hold-to-confirm button.
 */
export default function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  attemptedCount,
  unattemptedCount,
  markedCount,
  totalCount
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 id="modal-title" className="modal-title">
          Are you sure you want to submit?
        </h3>
        
        <p className="modal-description">
          Please review your attempt summary before final submission. Hold the submit button to confirm your submission.
        </p>

        <div className="modal-summary-grid">
          <div className="modal-summary-item">
            <h4 style={{ color: "var(--success)" }}>{attemptedCount}</h4>
            <span>Attempted</span>
          </div>
          <div className="modal-summary-item">
            <h4 style={{ color: "var(--text-muted)" }}>{unattemptedCount}</h4>
            <span>Unattempted</span>
          </div>
          <div className="modal-summary-item">
            <h4 style={{ color: "var(--purple)" }}>{markedCount}</h4>
            <span>In Review</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={onClose}
          >
            Cancel & Return
          </button>
          <HoldToConfirmButton
            onConfirm={onConfirm}
            label="Hold to Confirm Submit ➔"
            confirmingLabel="Submitting Test..."
            holdDurationMs={800}
            className="btn btn-success modal-btn"
          />
        </div>
      </div>
    </div>
  );
}
