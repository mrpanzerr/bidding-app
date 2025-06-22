// Import React's useState hook to manage component state (like loading)
import { useState } from "react";

// Import CSS module for styling the modal
import styles from "../styles/nameInputModal.module.css";

/**
 * NameInputModal Component
 * 
 * This is a reusable modal component used for:
 * - Renaming a project (user types a new name)
 * - Deleting a project (user types the existing name to confirm)
 * 
 * Props (values passed into the component):
 * - originalName: The current name of the project (used to confirm deletion)
 * - value: The text the user is typing into the input
 * - setValue: Function that updates the input as the user types
 * - onSave: Function called when the user confirms (save or delete)
 * - onCancel: Function called when the user clicks "Cancel"
 * - modalType: A string ("rename" or "delete") that determines behavior
 * - label: The label displayed above the input field
 */
function NameInputModal({
  originalName = "",
  value,
  setValue,
  onSave,
  onCancel,
  modalType,
  label = "Name Project:",
}) {
  // Internal state to track whether we're currently saving
  const [loading, setLoading] = useState(false);

  /**
   * Called when the user is renaming a project and clicks Save
   * - Shows loading indicator
   * - Calls onSave (a function from the parent component)
   * - Hides loading after it's done
   */
  const handleRenameSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Called when the user is deleting a project and clicks Save
   * - Requires the user to type the exact project name to confirm
   * - If input doesn't match originalName, shows alert and exits
   */
  const handleDeleteSave = async () => {
    setLoading(true);

    if (value !== originalName) {
      alert("Names must match to delete"); // Simple user safety check
      setLoading(false);
      return;
    }

    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop covers the screen with a semi-transparent dark background
    <div className={styles.backdrop}>
      {/* The white modal box itself */}
      <div
        className={styles.modalBox}
        style={{
          opacity: loading ? 0.6 : 1,              // Dim the modal while saving
          pointerEvents: loading ? "none" : "auto" // Prevent clicks while saving
        }}
      >
        {/* Label and input field */}
        <label className={styles.label}>
          {label}
          <input
            type="text"
            value={value}                          // What the user has typed
            onChange={(e) => setValue(e.target.value)} // Update input as user types
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                // Decide what to save based on modalType
                modalType === "delete"
                  ? handleDeleteSave()
                  : handleRenameSave();
              }
            }}
            placeholder="Enter name"
            style={{ marginTop: "5px", padding: "5px" }}
            disabled={loading} // Disable input while saving
          />
        </label>

        {/* Buttons for Save and Cancel */}
        <div className={styles.buttonRow}>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (loading) return;

              modalType === "delete"
                ? handleDeleteSave()
                : handleRenameSave();
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Export the component so it can be used in other files
export default NameInputModal;
