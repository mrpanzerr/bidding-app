import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CalculatorPageUI from "../components/calculatorPageUI";
import { calculatorConfigs } from "../config/calculatorConfig";

import { updateCalculatorName } from "../firebase/calculatorServices";

/**
 * CalculatorPage component
 * Displays a calculator based on project ID, calculator ID, and calculator type from the URL.
 * Handles calculator data fetching and passes all logic down to the UI component.
 */
export default function CalculatorPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [editingCalculatorName, setEditingCalculatorName] = useState(false);
  const [newCalculatorName, setNewCalculatorName] = useState("");

  const { id: projectId, calculatorId, type } = useParams();
  const navigate = useNavigate();

  // Get config for the given calculator type
  const config = calculatorConfigs[type];
  if (!config) return <p>Invalid calculator type</p>;

  // Destructure data and operations provided by the config
  const {
    calculator,
    loading,
    loadingMutation,
    error,
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
    sectionTotal,
    calculateGrandTotal,
  } = config.useCalculatorData(projectId, calculatorId);

  // Keep newCalculatorName in sync with the calculator's name
  if (
    calculator?.name &&
    !editingCalculatorName &&
    newCalculatorName !== calculator.name
  ) {
    setNewCalculatorName(calculator.name);
  }

  // Function to handle renaming the calculator
  const handleRenameCalculator = async () => {
    const trimmed = newCalculatorName.trim();
    if (!projectId || !calculatorId || !trimmed) return;

    if (trimmed === calculator?.name) {
      setEditingCalculatorName(false);
      return;
    }

    try {
      setRenaming(true);
      await updateCalculatorName(projectId, calculatorId, trimmed);
    } catch (error) {
      console.error("Error renaming calculator:", error);
    } finally {
      setRenaming(false);
      setEditingCalculatorName(false);
      setNewCalculatorName("");
      navigate(0); // Refresh the page to reflect changes
    }
  };

  // Navigate back to the project dashboard after deleting a calculator
  const navigateAfterDelete = () => {
    navigate(`/project/${projectId}`, { replace: true });
  };

  // Pass all necessary props to the UI component
  return (
    <CalculatorPageUI
      calculator={calculator}
      error={error}
      loading={loading || loadingMutation}
      isRefreshing={isRefreshing}
      setIsRefreshing={setIsRefreshing}
      addNewSection={addNewSection}
      deleteSection={deleteSection}
      renameSection={renameSection}
      updateField={updateField}
      addLine={addLine}
      addTen={addTen}
      deleteOne={deleteOne}
      deleteTen={deleteTen}
      deleteCalculatorFunction={deleteCalculatorFunction}
      calcMeasurement={calcMeasurement}
      checkCode={checkCode}
      navigateAfterDelete={navigateAfterDelete}
      sectionTotal={sectionTotal}
      calculateGrandTotal={calculateGrandTotal}
      editingCalculatorName={editingCalculatorName}
      setEditingCalculatorName={setEditingCalculatorName}
      newCalculatorName={newCalculatorName}
      setNewCalculatorName={setNewCalculatorName}
      handleRenameCalculator={handleRenameCalculator}
      renaming={renaming}
    />
  );
}
