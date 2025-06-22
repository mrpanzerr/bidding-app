// Import the reusable modal component used for text-based input (like naming a project)
import NameInputModal from "./nameInputModal";

/**
 * NewProjectModal Component
 * 
 * This component shows a modal popup that lets the user name a new project.
 * 
 * It uses the shared NameInputModal, which includes:
 * - A label ("Name Project:")
 * - A text input
 * - "Save" and "Cancel" buttons
 * 
 * Props:
 * - projectName:        (string) The current value of the name input
 * - setProjectName:     (function) Updates the name input when the user types
 * - onSave:             (function) Called when the user clicks "Save"
 * - onCancel:           (function) Called when the user clicks "Cancel"
 */
function NewProjectModal({ projectName, setProjectName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={projectName}            // The current text shown in the input field
      setValue={setProjectName}      // Function that updates the input value as the user types
      onSave={onSave}                // Function to run when user confirms (adds the new project)
      onCancel={onCancel}            // Function to run when user cancels (closes the modal)
      label="Name Project:"          // Label text above the input field
    />
  );
}

// Export this component so it can be used elsewhere (like in the dashboard)
export default NewProjectModal;
