// Import the reusable modal component used for text-based input (like naming a project)
import NameInputModal from "./nameInputModal";

/**
 * NewProjectModal Component
 *
 * Displays a modal popup allowing the user to enter a name for a new project.
 * Wraps the shared NameInputModal component which provides input and action buttons.
 *
 * @param {Object} props
 * @param {string} props.projectName - Current value of the project name input field.
 * @param {(value: string) => void} props.setProjectName - Function to update the project name input.
 * @param {() => void} props.onSave - Callback triggered when user clicks "Save".
 * @param {() => void} props.onCancel - Callback triggered when user clicks "Cancel".
 *
 * @returns {JSX.Element} The new project naming modal UI.
 */
function NewProjectModal({ projectName, setProjectName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={projectName}         // Current text in the input field
      setValue={setProjectName}   // Update function for the input field
      onSave={onSave}             // Called when user confirms the name
      onCancel={onCancel}         // Called when user cancels/closes the modal
      label="Name Project:"       // Label above the input field
    />
  );
}

export default NewProjectModal;
