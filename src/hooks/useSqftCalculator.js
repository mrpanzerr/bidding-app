import { useCalculator } from "./useCalculator";

/**
 * Custom hook for managing Square Foot calculators.
 * Wraps useCalculator and allows for potential sqft-specific overrides.
 */
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
    sectionTotal,
    calculateGrandTotal,
  } = useCalculator(projectId, calculatorId);

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
    sectionTotal,
    calculateGrandTotal
  };
}
