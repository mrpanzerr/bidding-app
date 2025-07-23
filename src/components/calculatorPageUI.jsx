import { useState } from "react";
import SqftCalculatorUI from "./calculatorUI/sqftCalculatorUI";

/**
 * CalculatorPageUI Component
 *
 * Responsible for rendering the appropriate calculator UI based on
 * the `calculator.type` provided in props.
 *
 * It manages editing state locally and handles user interactions,
 * such as renaming sections, adding/deleting lines, and deleting
 * the entire calculator.
 *
 * @param {Object} props - Component props
 * @param {Object|null} props.calculator - Calculator data, may be null while loading
 * @param {boolean} props.isRefreshing - Flag indicating if an action is in progress
 * @param {function(boolean): void} props.setIsRefreshing - Setter for refreshing state
 * @param {function(): Promise<void>} props.addNewSection - Adds a new section to calculator
 * @param {function(string): Promise<void>} props.deleteSection - Deletes a section by ID
 * @param {function(string, string): Promise<void>} props.renameSection - Renames section by ID
 * @param {function(string, string, string): Promise<void>} props.renameDescription - Renames line description
 * @param {function(string): Promise<void>} props.addLine - Adds a line to section
 * @param {function(string): Promise<void>} props.addTen - Adds 10 lines to section
 * @param {function(string, string): Promise<void>} props.deleteOne - Deletes a single line
 * @param {function(string): Promise<void>} props.deleteTen - Deletes 10 lines from section
 * @param {function(): Promise<void>} props.deleteCalculatorFunction - Deletes entire calculator
 * @param {function(string, string, string): Promise<void>} props.calcMeasurement - Calculates amount from measurement input
 * @param {function(): void} [props.navigateAfterDelete] - Optional callback after delete
 *
 * @returns {JSX.Element} UI for the selected calculator type or loading/error message
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
  } = props;

  // Local state for editing titles, descriptions, and measurements
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState("");

  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [lineDescription, setLineDescription] = useState("");

  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");

  // Return early UI state if calculator data is not loaded yet
  if (!calculator) {
    return <p>Loading or no calculator data available.</p>;
  }

  // Normalize calculator data to avoid crashes:
  // Ensure 'section' is always an array to safely map later
  const safeCalculator = {
    ...calculator,
    section: Array.isArray(calculator.section) ? calculator.section : [],
  };

  /**
   * Wrapper for async actions that manages the isRefreshing state.
   * Shows loading indicator or disables inputs while awaiting.
   * 
   * @param {function} action - Async action to execute
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
   * Handler for deleting the entire calculator.
   * Executes passed delete function and triggers navigation callback.
   */
  const handleDeleteCalculator = async () => {
    await safeAction(() => deleteCalculatorFunction());
    if (navigateAfterDelete) navigateAfterDelete();
  };

  // Render UI based on calculator type; can add more cases for other types
  switch (safeCalculator.type) {
    case "SqftCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>{safeCalculator.name || "Calculator"}</h1>
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
              calculateGrandTotal
            }}
          />

          <button onClick={() => safeAction(addNewSection)} disabled={isRefreshing}>
            + Add Section
          </button>

          <p>Grand Total: {safeCalculator.grandTotal || 0}</p>

          <button onClick={handleDeleteCalculator} disabled={isRefreshing}>
            Delete Calculator
          </button>
        </div>
      );

    // Add other calculator types here

    default:
      // Fallback UI for unknown or unsupported calculator types
      return <p>Unknown calculator type.</p>;
  }
}
