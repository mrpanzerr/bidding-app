import { useState } from "react";
import EditableField from "./calculatorUI/editableField";
import MeasurementCalculatorUI from "./calculatorUI/measurementCalculatorUI";
import SevenFieldCalculatorUI from "./calculatorUI/sevenFieldCalculatorUI";
import ThreeFieldCalculatorUI from "./calculatorUI/threeFieldCalculatorUI";
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
    checkCode,
    navigateAfterDelete,
    sectionTotal,
    calculateGrandTotal,
    editingCalculatorName,
    setEditingCalculatorName,
    newCalculatorName,
    setNewCalculatorName,
    handleRenameCalculator,
    renaming,
    updateTax,
    laborTotal,
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
  const [editingDescriptionThreeId, setEditingDescriptionThreeId] =
    useState(null);
  const [descriptionThree, setDescriptionThree] = useState("");
  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");
  const [editingQuantityId, setEditingQuantityId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [editingProductCodeId, setEditingProjectCodeId] = useState(null);
  const [productCode, setProductCode] = useState("");
  const [editingAmount, setEditingAmount] = useState(null);
  const [amountInput, setAmountInput] = useState("");
  const [edittingTaxRateId, setEditingTaxRateId] = useState(null);
  const [taxRateInput, setTaxRateInput] = useState("");
  const [editingSqftId, setEditingSqftId] = useState(null);
  const [sqftInput, setSqftInput] = useState("");
  const [editingPricePerUnitId, setEditingPricePerUnitId] = useState(null);
  const [pricePerUnitInput, setPricePerUnitInput] = useState("");

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
    },
    taxRate: {
      id: edittingTaxRateId,
      setId: setEditingTaxRateId,
      value: taxRateInput,
      setValue: setTaxRateInput,
    },
    sqft: {
      id: editingSqftId,
      setId: setEditingSqftId,
      value: sqftInput,
      setValue: setSqftInput,
    },
    pricePerUnit: {
      id: editingPricePerUnitId,
      setId: setEditingPricePerUnitId,
      value: pricePerUnitInput,
      setValue: setPricePerUnitInput,
    },
  };

  // Calculator action wrappers
  const calculatorActions = {
    renameSection,
    calcMeasurement,
    checkCode,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteSection,
    updateField,
    updateTax,
    laborTotal,
  };

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // -----------------------
  // Helper Functions
  // -----------------------

  /**
   * Adds commas to a number for thousands separation
   * @param {number|string} num - Number to format
   * @returns {string} Formatted number with commas
   */
  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

  const handleTaxUpdate = async () => {
    const numericVal = parseFloat(editingState.taxRate.value);
    if (isNaN(numericVal) || numericVal < 0) return;
    await safeAction(() => updateTax(numericVal));
    await safeAction(() => calculateGrandTotal());
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "16px",
        }}
      >
        {/* Total */}
        <h2 style={{ margin: 0 }}>
          Total: {safeCalculator.type === "SevenFieldCalculator" && "$"}
          {addCommas(Number(safeCalculator.grandTotal).toFixed(2)) || 0}
        </h2>

        {safeCalculator.type === "SevenFieldCalculator" && (
          <>
            {/* Tax Rate + Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <h2 style={{ margin: 0 }}>Tax Rate:</h2>
              <EditableField
                fieldState={editingState.taxRate}
                value={{ id: calculator.id, value: calculator.taxRate }}
                placeholder="Enter Tax Rate"
                onSave={async (val) => {
                  await handleTaxUpdate();
                }}
                isRefreshing={isRefreshing}
                boldValue={true}
              />
            </div>

            {/* Tax Amount */}
            <h2 style={{ margin: 0 }}>
              Tax: {safeCalculator.type !== "MeasurementCalculator" && "$"}
              {addCommas(Number(safeCalculator.taxAmount).toFixed(2)) || 0}
            </h2>

            {/* Grand Total */}
            <h2 style={{ margin: 0 }}>
              Grand Total: {safeCalculator.type !== "MeasurementCalculator" && "$"}
              {addCommas(Number(safeCalculator.finalTotal).toFixed(2)) || 0}
            </h2>
          </>
        )}

        {/* Delete Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={isRefreshing}
          style={{ color: "white", background: "red", padding: "4px 8px" }}
        >
          Delete Calculator
        </button>
      </div>
    </>
  );

  const renderCalculator = (CalculatorComponent) => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "40vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "900px", // max width of the calculator card
        }}
      >
        {renderHeader()}
        <CalculatorComponent
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
    </div>
  );

  // -----------------------
  // Fallback UI
  // -----------------------
  if (!calculator) {
    return <p></p>;
  }

  // -----------------------
  // Calculator Type Switch
  // -----------------------
  switch (safeCalculator.type) {
    case "MeasurementCalculator":
      return renderCalculator(MeasurementCalculatorUI);
    case "ThreeFieldCalculator":
      return renderCalculator(ThreeFieldCalculatorUI);
    case "SevenFieldCalculator":
      return renderCalculator(SevenFieldCalculatorUI);
    default:
      return <p>Unknown calculator type.</p>;
  }
}
