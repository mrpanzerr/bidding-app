import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/projectDashboardModules/projectDashboard.module.css";
import {
  exportMaterialListToExcel,
  exportMaterialListToPDF,
} from "../utils/exportUtils";

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
    <div className={styles.pageContainer}>
      <div className={styles.dashboardCard}>
        <aside className={styles.dashboardSidebar}>
          <h3 className={styles.sidebarHeader}>Actions</h3>

          {/* Add calculator buttons */}
          <button
            className={styles.addCalculatorBtn}
            onClick={() => openModal("SevenFieldCalculator")}
          >
            Add Material Calculator
          </button>
          <button
            className={styles.addCalculatorBtn}
            onClick={() => openModal("ThreeFieldCalculator")}
          >
            Add Labor Calculator
          </button>
          <button
            className={styles.addCalculatorBtn}
            onClick={() => openModal("MeasurementCalculator")}
          >
            Add Measurement Calculator
          </button>

          {/* Project Total Page button */}
          <button
            className={styles.projectPageBtn}
            onClick={() => openTotalsPage()}
          >
            Project Total Page
          </button>

          {/* Export list of materials */}
          <div className={styles.exportButtons}>
            <button
              className={styles.exportBtn}
              onClick={() => exportMaterialListToPDF(project, calculators)}
            >
              Export Material List - PDF
            </button>
            <button
              className={styles.exportBtn}
              onClick={() => exportMaterialListToExcel(project, calculators)}
            >
              Export Material List - Excel
            </button>
          </div>
        </aside>

        <main className={styles.dashboardMain}>
          <h2 className={styles.mainHeader}>{project.name} Calculators</h2>
          {calcLoading ? (
            <p>Loading calculators...</p>
          ) : calculators.length === 0 ? (
            <p>No calculators yet.</p>
          ) : (
            <ul className={styles.calculatorList}>
              {calculators.map((calc) => (
                <li key={calc.id}>
                  <button onClick={() => openCalculator(calc.id, calc.type)}>
                    {calc.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>

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
