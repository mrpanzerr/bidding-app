import { useState } from "react";

import SqftCalculatorUI from "./calculatorUI/sqftCalculatorUI";

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
  } = props;

  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState("");

  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [lineDescription, setLineDescription] = useState("");

  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");

  // Return early if calculator is null or undefined (avoid reading its props)
  if (!calculator) {
    return <p>Loading or no calculator data available.</p>;
  }

  // Ensure section is always an array to avoid crashes downstream
  const safeCalculator = {
    ...calculator,
    section: Array.isArray(calculator.section) ? calculator.section : [],
  };

  const safeAction = async (action) => {
    setIsRefreshing(true);
    try {
      await action();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteCalculator = async () => {
    await safeAction(() => deleteCalculatorFunction());
    if (navigateAfterDelete) navigateAfterDelete();
  };

  // Now safeCalculator is guaranteed non-null and section is array

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

    // other cases or default here...

    default:
      return <p>Unknown calculator type.</p>;
  }
}
