// useParams lets you access URL parameters (like the project id from the route)
import { useParams } from "react-router-dom";

// Import function to fetch project data from Firebase
import { useCalculatorById } from "../hooks/useCalculator";

/**
 * CalculatorPage component displays details for a single calculator.
 * It fetches the project data based on the "id" and "calculatorId" URL parameters.
 */
function CalculatorPage() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id, calculatorId } = useParams();

  const { calculator, loading: calcLoading, error: calcError } = useCalculatorById(id, calculatorId);

  // While loading, show a simple loading message
  if (calcLoading) return <div>Loading...</div>;
  if (calcError) return <div>Error loading calculator: {calcError.message}</div>;

  return (
    <div>
      <h1>{calculator.name}</h1>
      <p>Type: {calculator.type}</p>
      {/* Add more calculator details here */}
    </div>
  );
}

export default CalculatorPage;
