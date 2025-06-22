// Import the reusable modal component used for text input (like renaming a project)
import NameInputModal from "./nameInputModal";

/**
 * RenameModal Component
 * 
 * This component displays a modal popup that allows the user to rename an existing project.
 * It uses the shared NameInputModal component to provide the input field and buttons.
 * 
 * Props:
 * - newName:       (string) The current input value for the new project name
 * - setNewName:    (function) Updates the input value when the user types
 * - onSave:        (function) Called when the user confirms the rename action
 * - onCancel:      (function) Called when the user cancels and closes the modal
 * - modalType:     (string) A label to indicate the modal mode ("rename" here)
 */
function RenameModal({ newName, setNewName, onSave, onCancel, modalType }) {
  return (
    <NameInputModal
      value={newName}           // Current text inside the input field
      setValue={setNewName}     // Function to update the input field when the user types
      onSave={(val) => onSave(val)} // Function called when user clicks "Save"
      onCancel={onCancel}       // Function called when user clicks "Cancel"
      modalType={modalType}     // Passes the modal type (affects behavior inside NameInputModal)
      label="Rename Project:"   // Label shown above the input field
    />
  );
}

// Export this component to be used in other parts of the app (e.g., dashboard)
export default RenameModal;
