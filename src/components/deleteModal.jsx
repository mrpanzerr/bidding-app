import NameInputModal from "./nameInputModal";

function DeleteModal({ originalName, deleteName, setDeleteName, onSave, onCancel, modalType }) {
    return (
        <NameInputModal
            value={deleteName}
            setValue={setDeleteName}
            originalName={originalName}
            onSave={(val) => onSave(val)}
            onCancel={onCancel}
            modalType={modalType}
            label="Delete Project:"
        />
    );

}
export default DeleteModal;