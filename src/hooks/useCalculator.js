import { useEffect, useState } from "react";
import { getCalculator } from "../firebase/calculatorServices";

export function useCalculators(projectId, calculatorId) {
    const [calculator, setCalculator] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalculator = async () => {
            try {
                const docSnap = await getCalculator(projectId, calculatorId);
                if (docSnap.exists()) {
                    setCalculator(docSnap.data());
                } else {
                    setError("Calculator not found");
                }
            } catch (e) {
                setError("Error fetching calculator data");
            } finally {
                setLoading(false);
            }
        };

        fetchCalculator();
    }, [projectId, calculatorId]);

    return { calculator, loading, error };
}
