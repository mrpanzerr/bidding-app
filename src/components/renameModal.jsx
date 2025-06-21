import NameInputModal from "./nameInputModal";

function RenameModal({ newName, setNewName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={newName}
      setValue={setNewName}
      onSave={(val) => onSave(val)}
      onCancel={onCancel}
      label="Rename Project:"
    />
  );
}

export default RenameModal;
