import NameInputModal from "./nameInputModal";

function NewCalculatorModal({ calculatorName, setCalculatorName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={calculatorName}         // The current text shown in the input field
      setValue={setCalculatorName}   // Function that updates the input value as the user types
      onSave={onSave}                // Function to run when user confirms (adds the new calculator)
      onCancel={onCancel}            // Function to run when user cancels (closes the modal)
      label="Name Calculator:"       // Label text above the input field
    />
  );
}

export default NewCalculatorModal;