import { useMeasurementCalculator } from "../hooks/useMeasurementCalculator.js";
import { useTwoFieldCalculator } from "../hooks/useTwoFieldCalculator.js";

export const calculatorConfigs = {
    MeasurementCalculator: {
        useCalculatorData: useMeasurementCalculator,
    },
    TwoFieldCalculator: {
        useCalculatorData: useTwoFieldCalculator,
    }
};