import { useMeasurementCalculator } from "../hooks/useMeasurementCalculator.js";
import { useSevenFieldCalculator } from "../hooks/useSevenFieldCalculator.js";
import { useThreeFieldCalculator } from "../hooks/useThreeFieldCalculator.js";
import { useTwoFieldCalculator } from "../hooks/useTwoFieldCalculator.js";

export const calculatorConfigs = {
    MeasurementCalculator: {
        useCalculatorData: useMeasurementCalculator,
    },
    TwoFieldCalculator: {
        useCalculatorData: useTwoFieldCalculator,
    },
    ThreeFieldCalculator: {
        useCalculatorData: useThreeFieldCalculator,
    },
    SevenFieldCalculator: {
        useCalculatorData: useSevenFieldCalculator,
    },
};