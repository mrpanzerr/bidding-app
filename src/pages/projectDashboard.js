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
  const { calculators, addNewCalculator, loading: calcLoading } = useCalculators(id);

  const [newCalculator, setNewCalculator] = useState(false);
  const [calculatorName, setCalculatorName] = useState("");

  const navigate = useNavigate();

  const openTitlePage = () => navigate(`/project/${id}/titlePage`);

  const openCalculator = (calculatorId, type) => {
    navigate(`/project/${id}/calculator/${calculatorId}/${type}`);
  };

  const openNewCalculatorModal = (e) => {
    e.stopPropagation();
    setCalculatorName(""); // Reset calculator name input
    setNewCalculator(true); // Show modal
  };

  const handleNewSqftCalculator = async () => {
    const trimmed = calculatorName.trim();
    if (!trimmed) return;
    await addNewCalculator(id, trimmed, "SqftCalculator");
    setCalculatorName("");
    setNewCalculator(false);
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
          onClick={openTitlePage}
          style={{ display: "block", marginBottom: "1rem" }}
        >
          Open Title Page
        </button>
        <button onClick={openNewCalculatorModal} style={{ display: "block" }}>
          Add Square Foot Calculator
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
      {newCalculator && (
        <NewCalculatorModal
          calculatorName={calculatorName}
          setCalculatorName={setCalculatorName}
          onSave={handleNewSqftCalculator}
          onCancel={() => {
            setNewCalculator(false);
            setCalculatorName("");
          }}
        />
      )}
    </div>
  );
}

// Export component for routing
export default ProjectDashboard;
