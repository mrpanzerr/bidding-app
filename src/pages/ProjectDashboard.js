import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exportMaterialListToDocx, exportMaterialListToPDF } from "../utils/exportUtils";

import NewCalculatorModal from "../components/modals/newCalculatorModal";
import { useCalculator, useCalculators } from "../hooks/useCalculator";
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
  const { calculateProjectTotal } = useCalculator(id);

  const [activeModal, setActiveModal] = useState(null);
  const [calculatorName, setCalculatorName] = useState("");

  const navigate = useNavigate();

  const openCalculator = (calculatorId, type) => {
    navigate(`/project/${id}/calculator/${calculatorId}/${type}`);
  };

  const openTotalsPage = async () => {
    await calculateProjectTotal(id);
    navigate(`/project/${id}/total`);
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
  const handleNewThreeFieldCalculator = async () => {
    if (!calculatorName.trim()) return;
    await addNewCalculator(id, calculatorName, "ThreeFieldCalculator");
    closeModal();
  };
  const handleNewSevenFieldCalculator = async () => {
    if (!calculatorName.trim()) return;
    await addNewCalculator(id, calculatorName, "SevenFieldCalculator");
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
        {/* Calculator creator buttons */}
        <h3>Actions</h3>
        <button
          onClick={() => openModal("SevenFieldCalculator")}
          style={{ display: "block" }}
        >
          Add Material Calculator
        </button>
        <button
          onClick={() => openModal("ThreeFieldCalculator")}
          style={{ display: "block", marginTop: "0.5rem" }}
        >
          Add Labor Calculator
        </button>
        <button
          onClick={() => openModal("MeasurementCalculator")}
          style={{ display: "block", marginTop: "0.5rem" }}
        >
          Add Measurement Calculator
        </button>

        {/* Project Total Page */}
        <button
          onClick={() => openTotalsPage()}
          style={{ display: "block", marginTop: "1.5rem" }}
        >
          Project Total Page
        </button>

        {/* Export list of materials */}
        <div style={{ marginTop: "20px" }}>
          <button
            style={{ marginRight: "10px", marginBottom: "10px"}}
            onClick={() => exportMaterialListToPDF(project, calculators)}
          >
            Export Material List - PDF
          </button>
          <button
            onClick={() => exportMaterialListToDocx(project, calculators)}
          >
            Export Material List - Word
          </button>
        </div>
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

      {/* Modal for creating new measurement calculator */}
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

      {/* Modal for creating new three field calculator */}
      {activeModal === "ThreeFieldCalculator" && (
        <NewCalculatorModal
          calculatorName={calculatorName}
          setCalculatorName={setCalculatorName}
          onSave={handleNewThreeFieldCalculator}
          onCancel={() => {
            setActiveModal(null);
            setCalculatorName("");
          }}
        />
      )}

      {/* Modal for creating new seven field calculator */}
      {activeModal === "SevenFieldCalculator" && (
        <NewCalculatorModal
          calculatorName={calculatorName}
          setCalculatorName={setCalculatorName}
          onSave={handleNewSevenFieldCalculator}
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
