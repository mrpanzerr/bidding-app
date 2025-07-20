import NameInputModal from "./nameInputModal";

/**
 * DeleteModal Component
 * 
 * Modal popup for confirming project deletion by typing the project's name.
 * Uses NameInputModal for input and buttons.
 * 
 * @param {Object} props
 * @param {string} props.originalName - The current project name to confirm against
 * @param {string} props.deleteName - The input value typed by the user
 * @param {(value: string) => void} props.setDeleteName - Updates input state in parent
 * @param {() => Promise<void>} props.onSave - Called when user confirms deletion
 * @param {() => void} props.onCancel - Called when user cancels/closes modal
 * @param {string} props.modalType - Should be "delete" here
 */
function DeleteModal({ originalName, deleteName, setDeleteName, onSave, onCancel, modalType }) {
  return (
    <NameInputModal
      value={deleteName}
      setValue={setDeleteName}
      originalName={originalName}
      onSave={onSave}
      onCancel={onCancel}
      modalType={modalType}
      label="Delete Project:"
    />
  );
}

export default DeleteModal;
