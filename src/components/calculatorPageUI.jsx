import { useState } from "react";
import SqftCalculatorUI from "./calculatorUI/sqftCalculatorUI";
import DeleteCalculatorModal from "./modals/deleteCalculatorModal";

/**
 * CalculatorPageUI Component
 *
 * Renders the appropriate calculator interface based on the provided `calculator.type`.
 * This component manages local UI state related to section title editing, line description editing,
 * measurement input, and calculator deletion. It also handles user interactions for modifying
 * sections and lines, and for triggering calculations.
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.calculator - Calculator data object; may be null while loading
 * @param {boolean} props.isRefreshing - Indicates if an async operation is in progress
 * @param {function(boolean): void} props.setIsRefreshing - Updates the `isRefreshing` state
 * @param {function(): Promise<void>} props.addNewSection - Adds a new section to the calculator
 * @param {function(string): Promise<void>} props.deleteSection - Deletes a section by ID
 * @param {function(string, string): Promise<void>} props.renameSection - Renames a section by ID
 * @param {function(string, string, string): Promise<void>} props.renameDescription - Renames a line description
 * @param {function(string): Promise<void>} props.addLine - Adds one line to a section
 * @param {function(string): Promise<void>} props.addTen - Adds ten lines to a section
 * @param {function(string, string): Promise<void>} props.deleteOne - Deletes a single line
 * @param {function(string): Promise<void>} props.deleteTen - Deletes ten lines from a section
 * @param {function(): Promise<void>} props.deleteCalculatorFunction - Deletes the entire calculator
 * @param {function(): void} [props.navigateAfterDelete] - Optional callback to run after calculator deletion
 * @param {function(string, string, string): Promise<void>} props.calcMeasurement - Calculates and updates a measurement
 * @param {function(string): number} props.sectionTotal - Returns the total value of a section
 * @param {function(): number} props.calculateGrandTotal - Returns the overall total of the calculator
 *
 * @returns {JSX.Element} Rendered calculator UI or fallback loading message
 */
export default function CalculatorPageUI(props) {
  const {
    calculator,
    isRefreshing,
    setIsRefreshing,
    addNewSection,
    deleteSection,
    renameSection,
    renameDescription,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteCalculatorFunction,
    calcMeasurement,
    navigateAfterDelete,
    sectionTotal,
    calculateGrandTotal,
    editingCalculatorName,
    setEditingCalculatorName,
    newCalculatorName,
    setNewCalculatorName,
    handleRenameCalculator,
    renaming,
  } = props;

  // Normalize calculator data to ensure `section` is always an array
  const safeCalculator = {
    ...calculator,
    section: Array.isArray(calculator?.section) ? calculator.section : [],
  };

  // State for editing section titles
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState("");

  // State for editing line descriptions
  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [lineDescription, setLineDescription] = useState("");

  // State for editing measurement values
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");

  // State for delete confirmation modal and input
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // Show fallback if calculator data hasn't loaded yet
  if (!calculator) {
    return <p>Loading or no calculator data available.</p>;
  }

  /**
   * Wraps an async function to safely handle loading state
   * and ensure consistent UI feedback during the operation.
   *
   * @param {Function} action - The async action to execute
   */
  const safeAction = async (action) => {
    setIsRefreshing(true);
    try {
      await action();
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handles full calculator deletion and optional navigation afterward.
   */
  const handleDeleteCalculator = async () => {
    await safeAction(() => deleteCalculatorFunction());
    if (navigateAfterDelete) navigateAfterDelete();
  };

  // Render UI based on calculator type
  switch (safeCalculator.type) {
    case "SqftCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {editingCalculatorName ? (
            <input
              type="text"
              value={newCalculatorName}
              onChange={(e) => setNewCalculatorName(e.target.value)}
              onBlur={handleRenameCalculator}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.target.blur();
                }
              }}
              autoFocus
              disabled={renaming}
            />
          ) : (
            <h1 onClick={() => setEditingCalculatorName(true)}>
              {safeCalculator.name}
            </h1>
          )}
          <SqftCalculatorUI
            {...{
              calculator: safeCalculator,
              editingTitleId,
              setEditingTitleId,
              titleInput,
              setTitleInput,
              editingDescriptionId,
              setEditingDescriptionId,
              lineDescription,
              setLineDescription,
              editingMeasurementId,
              setEditingMeasurementId,
              measurement,
              setMeasurement,
              isRefreshing,
              safeAction,
              renameSection,
              renameDescription,
              calcMeasurement,
              addLine,
              addTen,
              deleteOne,
              deleteTen,
              deleteSection,
              sectionTotal,
              calculateGrandTotal,
            }}
          />
          <button
            onClick={() => safeAction(addNewSection)}
            disabled={isRefreshing}
          >
            + Add Section
          </button>
          <h2 style={{ textAlign: "right" }}>
            Grand Total: {safeCalculator.grandTotal || 0}
          </h2>
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isRefreshing}
            style={{ float: "right" }}
          >
            Delete Calculator
          </button>

          {showDeleteModal && (
            <DeleteCalculatorModal
              safeCalculator={safeCalculator}
              deleteConfirmInput={deleteConfirmInput}
              setDeleteConfirmInput={setDeleteConfirmInput}
              isRefreshing={isRefreshing}
              setShowDeleteModal={setShowDeleteModal}
              handleDeleteCalculator={handleDeleteCalculator}
            />
          )}
        </div>
      );

    default:
      // Fallback for unknown calculator types
      return <p>Unknown calculator type.</p>;
  }
}
