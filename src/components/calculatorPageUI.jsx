import { useState } from "react";
import MeasurementCalculatorUI from "./calculatorUI/measurementCalculatorUI";
import TwoFieldCalculatorUI from "./calculatorUI/twoFieldCalculatorUI";
import DeleteCalculatorModal from "./modals/deleteCalculatorModal";

/**
 * CalculatorPageUI Component
 *
 * Top-level UI for rendering a calculator of a given type.
 * Manages:
 * - Editing states for calculator name, section titles, line descriptions, and measurements
 * - Calculator operations like adding/removing sections or lines
 * - Calculation updates
 * - Deletion confirmation modal
 *
 * @param {Object} props - Component props
 * @returns {JSX.Element} Rendered calculator UI or loading/fallback messages
 */
export default function CalculatorPageUI(props) {
  // -----------------------
  // Props Destructuring
  // -----------------------
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
    updateAmount,
  } = props;

  // -----------------------
  // Normalize Calculator Data
  // -----------------------
  const safeCalculator = {
    ...calculator,
    section: Array.isArray(calculator?.section) ? calculator.section : [],
  };

  // -----------------------
  // Local State Management
  // -----------------------

  // Editing state for sections, lines, and measurements
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [lineDescription, setLineDescription] = useState("");
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");
  const [editingAmount, setEditingAmount] = useState(null);
  const [amountInput, setAmountInput] = useState("");

  const editingState = {
    title: { id: editingTitleId, setId: setEditingTitleId, value: titleInput, setValue: setTitleInput },
    description: { id: editingDescriptionId, setId: setEditingDescriptionId, value: lineDescription, setValue: setLineDescription },
    measurement: { id: editingMeasurementId, setId: setEditingMeasurementId, value: measurement, setValue: setMeasurement },
    amount: { id: editingAmount, setId: setEditingAmount, value: amountInput, setValue: setAmountInput },
  };

  // Calculator action wrappers
  const calculatorActions = {
    renameSection,
    renameDescription,
    calcMeasurement,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteSection,
    updateAmount,
  };

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // -----------------------
  // Helper Functions
  // -----------------------

  /**
   * Wraps async actions with loading state management
   * @param {Function} action - Async function to execute
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
   * Handles full calculator deletion and optional navigation afterward
   */
  const handleDeleteCalculator = async () => {
    await safeAction(deleteCalculatorFunction);
    if (navigateAfterDelete) navigateAfterDelete();
  };

  // -----------------------
  // Rendering Helpers
  // -----------------------

  /**
   * Renders the calculator header, supporting inline renaming
   */
  const renderHeader = () =>
    editingCalculatorName ? (
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
      <h1 onClick={() => setEditingCalculatorName(true)}>{safeCalculator.name}</h1>
    );

  /**
   * Renders the footer with total display and section addition/deletion
   */
  const renderFooter = () => (
    <>
      <button onClick={() => safeAction(addNewSection)} disabled={isRefreshing}>
        + Add Section
      </button>
      <h2 style={{ textAlign: "right" }}>Total: {safeCalculator.grandTotal || 0}</h2>
      <button
        onClick={() => setShowDeleteModal(true)}
        disabled={isRefreshing}
        style={{ float: "right" }}
      >
        Delete Calculator
      </button>
    </>
  );

  // -----------------------
  // Fallback UI
  // -----------------------
  if (!calculator) {
    return <p>Loading or no calculator data available.</p>;
  }

  // -----------------------
  // Calculator Type Switch
  // -----------------------
  switch (safeCalculator.type) {
    case "MeasurementCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {renderHeader()}
          <MeasurementCalculatorUI
            calculator={safeCalculator}
            editingState={editingState}
            actions={calculatorActions}
            sectionTotal={sectionTotal}
            calculateGrandTotal={calculateGrandTotal}
            isRefreshing={isRefreshing}
            safeAction={safeAction}
          />
          {renderFooter()}
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

    case "TwoFieldCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {renderHeader()}
          <TwoFieldCalculatorUI
            calculator={safeCalculator}
            editingState={editingState}
            actions={calculatorActions}
            sectionTotal={sectionTotal}
            calculateGrandTotal={calculateGrandTotal}
            isRefreshing={isRefreshing}
            safeAction={safeAction}
          />
          {renderFooter()}
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
      return <p>Unknown calculator type.</p>;
  }
}
