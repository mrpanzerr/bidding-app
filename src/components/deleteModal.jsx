// Import a reusable input modal component that handles name inputs
import NameInputModal from "./nameInputModal";

/**
 * DeleteModal component
 * 
 * This modal is shown when the user wants to delete a project.
 * It reuses the NameInputModal component to get a confirmation input from the user,
 * such as typing the project name to confirm deletion.
 * 
 * Props:
 * - originalName: The current name of the project to display or compare
 * - deleteName: The current input value the user types to confirm deletion
 * - setDeleteName: Function to update the deleteName input state
 * - onSave: Function to call when the user confirms deletion
 * - onCancel: Function to call when the user cancels the deletion modal
 * - modalType: String describing the modal type ("delete" here)
 */
function DeleteModal({ originalName, deleteName, setDeleteName, onSave, onCancel, modalType }) {
    return (
        <NameInputModal
            value={deleteName}             // Current input value user types for confirmation
            setValue={setDeleteName}       // Function to update input value in parent state
            originalName={originalName}    // Original project name to display in modal
            onSave={(val) => onSave(val)}  // Called when user confirms (passes input value)
            onCancel={onCancel}             // Called when user cancels the modal
            modalType={modalType}           // Modal type string ("delete")
            label="Delete Project:"        // Label text shown above input
        />
    );
}

export default DeleteModal;
