import { useState } from "react";
import styles from "../../styles/nameInputModal.module.css";

/**
 * Delete Modal component
 *
 * A reusable modal for deleting a project.
 * Shows a button to confirm deletion.
 * 
 * @param {Object} props
 * @param {() => Promise<void>} props.onSave - Function to call when user confirms deletion
 * @param {() => void} props.onCancel - Function to call when user cancels/closes modal
 * @param {string} [props.label="Delete Project:"] - Label above the confirmation button
 */
function DeleteModal({ onSave, onCancel, label = "Delete Project:" }) {
  const [loading, setLoading] = useState(false);

  const handleDeleteSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className={styles.backdrop}>
      <div
        className={styles.modalBox}
        style={{
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <label className={styles.label}>
          {label}
          </label>

        <div className={styles.buttonRow}>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (loading) return;

              handleDeleteSave();
            }}
            disabled={loading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            {loading ? "  Deleting..." : "Delete"}
          </button>
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
