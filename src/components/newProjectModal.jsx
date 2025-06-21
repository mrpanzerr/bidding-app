import NameInputModal from "./nameInputModal";

function NewProjectModal({ projectName, setProjectName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={projectName}
      setValue={setProjectName}
      onSave={onSave}
      onCancel={onCancel}
      label="Name Project:"
    />
  );
}

export default NewProjectModal;
