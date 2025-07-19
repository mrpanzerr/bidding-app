import { useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import NewCalculatorModal from "../components/modals/newCalculatorModal";

import { useProject } from "../hooks/useProjects";

import { useCalculators } from "../hooks/useCalculator";

/**
 * TitlePage component displays details for a single project.
 * It fetches the project data based on the "id" URL parameter.
 */
function ProjectDashboard() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id } = useParams();
  const { project, loading, error } = useProject(id);

  const {
    calculators,
    addNewCalculator,
    loading: calcLoading,
  } = useCalculators(id);

  const [newCalculator, setNewCalculator] = useState(false);
  const [calculatorName, setCalculatorName] = useState("");

  const navigate = useNavigate();

  const openTitlePage = () => navigate(`/project/${id}/titlePage`);

  const openCalculator = (calculatorId, type) => {
    navigate(`/project/${id}/calculator/${calculatorId}/${type}`);
  };

  const openNewCalculatorModal = (e) => {
    e.stopPropagation();
    setCalculatorName(calculatorName || ""); // reset calculator name input
    setNewCalculator(true); // show new calculator modal
  };

  const handleNewSqftCalculator = async () => {
    const trimmed = calculatorName.trim();
    if (!trimmed) return;
    await addNewCalculator(id, trimmed, "SqftCalculator");
    setCalculatorName("");
    setNewCalculator(false);
  };

  // While loading, show a simple loading message
  if (loading) return <p>Loading project...</p>;
  // If there's an error, show it (could be a network issue, etc.)
  if (error) return <p>Error loading project: {error.message}</p>;
  // If loading is done but project is null, show a "not found" message
  if (!project || project === false) return <p>Project not found.</p>;

  return (
    <div style={{ display: "flex", minHeight: "80vh" }}>
      {/* LEFT SIDEBAR */}
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

      {/* MAIN CONTENT */}
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
                  style={{ background: "none", border: "2px", color: "blue", textDecoration: "none", cursor: "pointer" }}
                >
                  {calc.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* MODAL */}
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

// Export this componenet for use in routing
export default ProjectDashboard;
