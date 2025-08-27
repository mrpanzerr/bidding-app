import { useState } from "react";
import styles from "../../styles/nameInputModal.module.css";

/**
 * NameInputModal Component
 *
 * A reusable modal for renaming a project.
 * Shows an input field and Save/Cancel buttons.
 *
 * @param {Object} props
 * @param {string} [props.originalName=""] - Current project name (for delete confirmation)
 * @param {string} props.value - Current input text value
 * @param {(value: string) => void} props.setValue - Updates input value on user typing
 * @param {() => Promise<void>} props.onSave - Function to call when user confirms save
 * @param {() => void} props.onCancel - Function to call when user cancels/closes modal
 * @param {string} props.modalType - Either `"rename"` or `"delete"` to determine behavior
 * @param {string} [props.label="Name Project:"] - Label above the input field
 * 
 * @returns {JSX.Element}
 */
function NameInputModal({
  originalName,
  value,
  setValue,
  onSave,
  onCancel,
  modalType,
  label = "Name Project:",
}) {
  const [loading, setLoading] = useState(false);

  const handleRenameSave = async () => {
    setLoading(true);
    try {
      await onSave();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSave = async () => {
    setLoading(true);

    if (value.trim() !== originalName.trim()) {
      alert("Names must match to delete");
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
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                modalType === "delete"
                  ? handleDeleteSave()
                  : handleRenameSave();
              }
            }}
            placeholder="Enter name"
            style={{ marginTop: 5, padding: 5 }}
            disabled={loading}
          />
        </label>

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

export default NameInputModal;
