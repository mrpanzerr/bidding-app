import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CalculatorPageUI from "../components/calculatorPageUI";
import { calculatorConfigs } from "../config/calculatorConfig";

/**
 * CalculatorPage component
 * Displays a calculator based on project ID, calculator ID, and calculator type from the URL.
 * Handles calculator data fetching and passes all logic down to the UI component.
 */
export default function CalculatorPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
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
    renameDescription,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteCalculatorFunction,
    calcMeasurement,
    sectionTotal,
  } = config.useCalculatorData(projectId, calculatorId);

  // Navigate back to the project dashboard after deleting a calculator
  const navigateAfterDelete = () => {
    navigate(`/project/${projectId}`);
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
      renameDescription={renameDescription}
      addLine={addLine}
      addTen={addTen}
      deleteOne={deleteOne}
      deleteTen={deleteTen}
      deleteCalculatorFunction={deleteCalculatorFunction}
      calcMeasurement={calcMeasurement}
      navigateAfterDelete={navigateAfterDelete}
      sectionTotal={sectionTotal}
    />
  );
}
