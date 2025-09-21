import { useMeasurementCalculator } from "../hooks/useMeasurementCalculator.js";
import { useSevenFieldCalculator } from "../hooks/useSevenFieldCalculator.js";
import { useThreeFieldCalculator } from "../hooks/useThreeFieldCalculator.js";

export const calculatorConfigs = {
  MeasurementCalculator: {
    useCalculatorData: useMeasurementCalculator,
  },
  ThreeFieldCalculator: {
    useCalculatorData: useThreeFieldCalculator,
  },
  SevenFieldCalculator: {
    useCalculatorData: useSevenFieldCalculator,
  },
};
