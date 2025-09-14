import { useState } from "react";
import MeasurementCalculatorUI from "./calculatorUI/measurementCalculatorUI";
import SevenFieldCalculatorUI from "./calculatorUI/sevenFieldCalculatorUI";
import ThreeFieldCalculatorUI from "./calculatorUI/threeFieldCalculatorUI";
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
    updateField,
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
  const [editingDescriptionTwoId, setEditingDescriptionTwoId] = useState(null);
  const [descriptionTwo, setDescriptionTwo] = useState("");
  const [editingDescriptionThreeId, setEditingDescriptionThreeId] = useState(null);
  const [descriptionThree, setDescriptionThree] = useState("");
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [editingProductCodeId, setEditingProjectCodeId] = useState(null);
  const [productCode, setProductCode] = useState("");
  const [editingAmount, setEditingAmount] = useState(null);
  const [amountInput, setAmountInput] = useState("");

  const editingState = {
    title: {
      id: editingTitleId,
      setId: setEditingTitleId,
      value: titleInput,
      setValue: setTitleInput,
    },
    description: {
      id: editingDescriptionId,
      setId: setEditingDescriptionId,
      value: lineDescription,
      setValue: setLineDescription,
    },
    measurement: {
      id: editingMeasurementId,
      setId: setEditingMeasurementId,
      value: measurement,
      setValue: setMeasurement,
    },
    amount: {
      id: editingAmount,
      setId: setEditingAmount,
      value: amountInput,
      setValue: setAmountInput,
    },
    descriptionTwo: {
      id: editingDescriptionTwoId,
      setId: setEditingDescriptionTwoId,
      value: descriptionTwo,
      setValue: setDescriptionTwo,
    },
    descriptionThree: {
      id: editingDescriptionThreeId,
      setId: setEditingDescriptionThreeId,
      value: descriptionThree,
      setValue: setDescriptionThree,
    },
    quantity: {
      id: editingQuantityId,
      setId: setEditingQuantityId,
      value: quantity,
      setValue: setQuantity,
    },
    productCode: {
      id: editingProductCodeId,
      setId: setEditingProjectCodeId,
      value: productCode,
      setValue: setProductCode,
    }
  };

  // Calculator action wrappers
  const calculatorActions = {
    renameSection,
    calcMeasurement,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteSection,
    updateField,
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
      <h1 onClick={() => setEditingCalculatorName(true)}>
        {safeCalculator.name}
      </h1>
    );

  /**
   * Renders the footer with total display and section addition/deletion
   */
  const renderFooter = () => (
    <>
      <button onClick={() => safeAction(addNewSection)} disabled={isRefreshing}>
        + Add Section
      </button>
      <h2 style={{ textAlign: "right" }}>
        Total: {safeCalculator.grandTotal || 0}
      </h2>
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

    case "ThreeFieldCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {renderHeader()}
          <ThreeFieldCalculatorUI
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

    case "SevenFieldCalculator":
      return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {renderHeader()}
          <SevenFieldCalculatorUI
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
