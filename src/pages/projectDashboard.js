import { Link, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import { useProject } from "../hooks/useProjects";

import NewCalculatorModal from "../components/modals/newCalculatorModal";

import {
  addCalculator,
  getAllCalculators,
} from "../firebase/calculatorServices";

/**
 * TitlePage component displays details for a single project.
 * It fetches the project data based on the "id" URL parameter.
 */
function ProjectDashboard() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id } = useParams();

  const { project, loading, error } = useProject(id);

  const [newCalculator, setNewCalculator] = useState(false);
  const [calculatorName, setCalculatorName] = useState("");
  const [calculators, setCalculators] = useState([]);

  const navigate = useNavigate();

  const openTitlePage = () => navigate(`/project/${id}/titlePage`);

  const openNewCalculatorModal = (e) => {
    e.stopPropagation();
    setCalculatorName(calculatorName || ""); // reset calculator name input
    setNewCalculator(true); // show new calculator modal
  };

  const loadCalculators = async () => {
    try {
      const data = await getAllCalculators(id);
      console.log("Fetched calculators:", data); // ✅ ADD THIS
      setCalculators(data);
    } catch (e) {
      console.error("Error loading calculators:", e);
    }
  };

  useEffect(() => {
    if (id) loadCalculators();
  }, [id]);

  const handleNewSqftCalculator = async () => {
    const trimmed = calculatorName.trim();
    if (!trimmed) return;
    await addCalculator(id, "sqft", trimmed);
    setCalculatorName("");
    setNewCalculator(false);
    await loadCalculators();
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
        {calculators.length === 0 ? (
          <p>No calculators yet.</p>
        ) : (
          <ul>
            {calculators.map((calc) => (
              <li key={calc.id}>
                <Link
                  to={`/project/${id}/calculator/${calc.id}`}
                  style={{ textDecoratyion: "none", color: "inherit" }}
                >
                  {calc.name} ({calc.type})
                </Link>
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
