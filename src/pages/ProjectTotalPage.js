import { useParams } from "react-router-dom";
import { useCalculators } from "../hooks/useCalculator";
import { useProject } from "../hooks/useProjects";

export default function ProjectTotalPage() {
  const { id } = useParams();
  const { project, loading, error } = useProject(id);
  const {
      calculators,
      loading: calcLoading,
    } = useCalculators(id);

  if (loading) return <p>Loading...</p>;
  if (calcLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div>
        <h2>{project.name} Totals</h2>

        <table>
            <thead>
                <tr>
                    <th style={{ textAlign: "left" }}>Name</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                </tr>
            </thead>
            <tbody>
                {calculators
                .filter((calc) => calc.type !== "MeasurementCalculator") 
                .map((calc) => (
                    <tr key={calc.id}>
                        <td>{calc.name}</td>
                        <td style={{ textAlign: "right" }}>
                            ${Number(calc.grandTotal).toFixed(2)}</td>
                    </tr>
                ))}
                <tr>
                    <td><strong>Grand Total</strong></td>
                    <td style={{ textAlign: "right" }}>
                        <strong>${Number(project.total).toFixed(2)}</strong>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  );
}
