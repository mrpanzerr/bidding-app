import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NewCalculatorModal from "../components/modals/newCalculatorModal";
import { useCalculators } from "../hooks/useCalculator";
import { useProject } from "../hooks/useProjects";

/**
 * Displays the project dashboard with actions and a list of calculators.
 * Fetches project and calculator data based on the URL "id" param.
 */
function ProjectDashboard() {
  const { id } = useParams();
  const { project, loading, error } = useProject(id);
  const {
    calculators,
    addNewCalculator,
    loading: calcLoading,
  } = useCalculators(id);

  const [activeModal, setActiveModal] = useState(null); // 'measurement' or 'twoField' or null
  const [calculatorName, setCalculatorName] = useState("");

  const navigate = useNavigate();

  const openCalculator = (calculatorId, type) => {
    navigate(`/project/${id}/calculator/${calculatorId}/${type}`);
  };

  const openModal = (type) => {
    setCalculatorName("");
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setCalculatorName("");
  };

  const handleNewMeasurementCalculator = async () => {
    if (!calculatorName.trim()) return;
    await addNewCalculator(id, calculatorName, "MeasurementCalculator");
    closeModal();
  };
  const handleNewTwoFieldCalculator = async () => {
    if (!calculatorName.trim()) return;
    await addNewCalculator(id, calculatorName, "TwoFieldCalculator");
    closeModal();
  };

  if (loading) return <p>Loading project...</p>;
  if (error) return <p>Error loading project: {error.message}</p>;
  if (!project || project === false) return <p>Project not found.</p>;

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      {/* Sidebar with project actions */}
      <aside
        style={{
          width: "250px",
          padding: "1rem",
          borderRight: "1px solid #ccc",
        }}
      >
        <h3>Actions</h3>
        <button
          onClick={() => openModal("MeasurementCalculator")}
          style={{ display: "block" }}
        >
          Add Measurement Calculator
        </button>
        <button
          onClick={() => openModal("TwoFieldCalculator")}
          style={{ display: "block", marginTop: "0.5rem" }}
        >
          Add Two Field Calculator
        </button>
      </aside>

      {/* Main content showing calculators */}
      <main style={{ flex: 1, padding: "1rem" }}>
        <h2>{project.name} Calculators</h2>
        {calcLoading ? (
          <p>Loading calculators...</p>
        ) : calculators.length === 0 ? (
          <p>No calculators yet.</p>
        ) : (
          <ul>
            {calculators.map((calc) => (
              <li key={calc.id}>
                <button
                  onClick={() => openCalculator(calc.id, calc.type)}
                  style={{
                    background: "none",
                    border: "2px",
                    color: "blue",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  {calc.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modal for creating new calculator */}
      {activeModal === "MeasurementCalculator" && (
        <NewCalculatorModal
          calculatorName={calculatorName}
          setCalculatorName={setCalculatorName}
          onSave={handleNewMeasurementCalculator}
          onCancel={() => {
            setActiveModal(null);
            setCalculatorName("");
          }}
        />
      )}

      {/* Modal for creating new two field calculator */}
      {activeModal === "TwoFieldCalculator" && (
        <NewCalculatorModal
          calculatorName={calculatorName}
          setCalculatorName={setCalculatorName}
          onSave={handleNewTwoFieldCalculator}
          onCancel={() => {
            setActiveModal(null);
            setCalculatorName("");
          }}
        />
      )}
    </div>
  );
}

// Export component for routing
export default ProjectDashboard;
