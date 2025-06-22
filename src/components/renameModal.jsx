import NameInputModal from "./nameInputModal";

function RenameModal({ newName, setNewName, onSave, onCancel, modalType }) {
  return (
    <NameInputModal
      value={newName}
      setValue={setNewName}
      onSave={(val) => onSave(val)}
      onCancel={onCancel}
      modalType={modalType}
      label="Rename Project:"
    />
  );
}

export default RenameModal;
