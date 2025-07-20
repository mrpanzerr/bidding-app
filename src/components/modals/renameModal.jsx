// Import the reusable modal component used for text input (like renaming a project)
import NameInputModal from "./nameInputModal";

/**
 * RenameModal Component
 *
 * Displays a modal popup allowing the user to rename an existing project.
 * Wraps the reusable NameInputModal component for input and action handling.
 *
 * @param {Object} props
 * @param {string} props.newName - Current input value for the new project name.
 * @param {(value: string) => void} props.setNewName - Function to update the input value.
 * @param {(value: string) => void} props.onSave - Callback triggered on save with the new name.
 * @param {() => void} props.onCancel - Callback triggered to cancel/close the modal.
 * @param {string} props.modalType - A string label indicating the modal type ("rename").
 *
 * @returns {JSX.Element} The rename modal UI component.
 */
function RenameModal({ newName, setNewName, onSave, onCancel, modalType }) {
  return (
    <NameInputModal
      value={newName}               // Current text inside the input field
      setValue={setNewName}         // Update input field when user types
      onSave={(val) => onSave(val)} // Called when user confirms (saves) the rename
      onCancel={onCancel}           // Called when user cancels/closes the modal
      modalType={modalType}         // Passes modal type for internal handling
      label="Rename Project:"       // Label shown above the input field
    />
  );
}

export default RenameModal;
