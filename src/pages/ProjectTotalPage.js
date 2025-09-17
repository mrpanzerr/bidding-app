import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProjects";

export default function ProjectTotalPage() {
  const { id } = useParams();
  const { project, loading, error } = useProject(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!project) return <p>No project found</p>;

  return (
    <div>
      <h2>Project Total: ${project.total}</h2>
      <h2>More Coming Soon</h2>
    </div>
  );
}
