/**
 * DeleteCalculatorModal Component
 *
 * A modal dialog for confirming deletion of a calculator.
 * Requires the user to type the exact calculator name to proceed with deletion.
 *
 * @param {Object} props - Component props
 * @param {Object} props.safeCalculator - The calculator object being deleted
 * @param {string} props.deleteConfirmInput - The current user input in the confirmation field
 * @param {function(string): void} props.setDeleteConfirmInput - Updates the confirmation input state
 * @param {boolean} props.isRefreshing - Indicates if a delete operation is in progress
 * @param {function(boolean): void} props.setShowDeleteModal - Toggles visibility of the modal
 * @param {function(): Promise<void>} props.handleDeleteCalculator - Callback to delete the calculator
 *
 * @returns {JSX.Element} Modal overlay for delete confirmation
 */
export default function DeleteCalculatorModal({
  safeCalculator,
  deleteConfirmInput,
  setDeleteConfirmInput,
  isRefreshing,
  setShowDeleteModal,
  handleDeleteCalculator,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", // dark overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // ensure modal is on top
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 0 10px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <h3>Confirm Delete Calculator</h3>
        <p>
          Type the calculator name <strong>{safeCalculator.name}</strong> to confirm.
        </p>

        {/* Confirmation input field */}
        <input
          type="text"
          value={deleteConfirmInput}
          onChange={(e) => setDeleteConfirmInput(e.target.value)}
          placeholder="Calculator name"
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
          disabled={isRefreshing}
        />

        {/* Action buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Cancel button */}
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteConfirmInput("");
            }}
            disabled={isRefreshing}
          >
            Cancel
          </button>

          {/* Confirm delete button */}
          <button
            onClick={async () => {
              if (deleteConfirmInput.trim() === safeCalculator.name) {
                await handleDeleteCalculator();
                setShowDeleteModal(false);
                setDeleteConfirmInput("");
              } else {
                alert("Calculator name does not match.");
              }
            }}
            style={{ backgroundColor: "red", color: "white" }}
            disabled={isRefreshing}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
