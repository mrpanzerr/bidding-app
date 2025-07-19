import { useCalculator } from "./useCalculator";

export function useSqftCalculator(projectId, calculatorId) {
  const {
    calculator,
    loading,
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
  } = useCalculator(projectId, calculatorId);

  // Add typeA specific overrides here if needed

  return {
    calculator,
    loading,
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
  };
}
