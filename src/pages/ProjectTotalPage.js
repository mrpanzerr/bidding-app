import { useParams } from "react-router-dom";
import { useCalculators } from "../hooks/useCalculator";
import { useProject } from "../hooks/useProjects";
import { exportToDocx, exportToPDF } from "../utils/exportUtils";

export default function ProjectTotalPage() {
  const { id } = useParams();
  const { project, loading, error } = useProject(id);
  const { calculators, loading: calcLoading } = useCalculators(id);

  if (loading || calcLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>{project.name} Totals</h2>

      <table
        style={{
          margin: "0 auto", // center the table
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #000", padding: "8px" }}>Name</th>
            <th style={{ borderBottom: "1px solid #000", padding: "8px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
            {calculators
              .filter((calc) => calc.type !== "MeasurementCalculator")
              .map((calc) => (
                <tr key={calc.id}>
                  <td style={{ padding: "8px" }}>{calc.name}</td>
                  <td style={{ padding: "8px" }}>${Number(calc.finalTotal).toFixed(2)}</td>
                </tr>
              ))}
          <tr>
            <td style={{ padding: "8px", fontWeight: "bold" }}>Grand Total</td>
            <td style={{ padding: "8px", fontWeight: "bold" }}>
              ${Number(project.total).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{ marginRight: "10px", padding: "10px 20px" }}
          onClick={() => exportToPDF(project, calculators)}
        >
          Export PDF
        </button>
        <button
          style={{ padding: "10px 20px" }}
          onClick={() => exportToDocx(project, calculators)}
        >
          Export Word
        </button>
      </div>
    </div>
  );
}
