import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { calculatorConfigs } from "../config/calculatorConfig";
import CalculatorPageUI from "./calculatorPageUI";

export default function CalculatorPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { id: projectId, calculatorId, type } = useParams();
  const navigate = useNavigate();

  const config = calculatorConfigs[type];
  if (!config) { return  <p>Invalid calculator type</p>; }

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
  } = config.useCalculatorData(projectId, calculatorId);

  const navigateAfterDelete = () => {
    navigate(`/project/${projectId}`);
  };

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
    />
  );
}
