import React from "react";

/**
 * SubmitModal Component
 * 
 * Demonstrates:
 * - Conditional Rendering
 * - Props passing
 * - Event handling (Confirm / Cancel)
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h3 id="modal-title" className="modal-title">
          Are you sure you want to submit?
        </h3>
        
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Please review your attempt summary before final submission. Once submitted, your scores will be calculated.
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
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel & Return
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={onConfirm}
          >
            Yes, Submit Test
          </button>
        </div>
      </div>
    </div>
  );
}
