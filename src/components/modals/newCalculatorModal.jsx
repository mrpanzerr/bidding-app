import NameInputModal from "./nameInputModal";

/**
 * NewCalculatorModal Component
 *
 * Displays a modal popup to enter a name for a new calculator.
 * Uses the shared NameInputModal component for input and action buttons.
 *
 * @param {Object} props
 * @param {string} props.calculatorName - Current value of the calculator name input.
 * @param {(value: string) => void} props.setCalculatorName - Function to update the input value.
 * @param {() => void} props.onSave - Callback triggered when user confirms the name.
 * @param {() => void} props.onCancel - Callback triggered when user cancels/closes the modal.
 *
 * @returns {JSX.Element} The new calculator naming modal UI.
 */
function NewCalculatorModal({ calculatorName, setCalculatorName, onSave, onCancel }) {
  return (
    <NameInputModal
      value={calculatorName}
      setValue={setCalculatorName}
      onSave={onSave}
      onCancel={onCancel}
      label="Name Calculator:"
    />
  );
}

export default NewCalculatorModal;
