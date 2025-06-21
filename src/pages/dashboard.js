import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewProjectModal from "../components/newProjectModal";
import ProjectItem from "../components/projectItem";
import RenameModal from "../components/renameModal";
import { useProjects } from "../hooks/useProjects";

function Dashboard() {
  const { projects, loading, error, addNewProject, renameExistingProject } =
    useProjects();

  const [newProject, setNewProject] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA;
  });

  const openNewProjectModal = (e) => {
    e.stopPropagation();
    setProjectName(projectName || "");
    setNewProject(true);
  };

  const handleRename = async () => {
    if (!selectedProjectId || !newName) return;
    await renameExistingProject(selectedProjectId, newName);
    setNewName("");
    setSelectedProjectId(null);
  };

  const handleNewProject = async () => {
    if (!projectName.trim()) return;
    await addNewProject(projectName.trim());
    setProjectName("");
    setNewProject(false);
  };

  const openProject = (id) => {
    navigate(`/project/${id}`);
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <div>
      <h1>Welcome, Gaetano</h1>
      <ul>
        {sortedProjects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            onOpen={openProject}
            onRename={(id, name) => {
              setSelectedProjectId(id);
              setNewName(name);
            }}
          />
        ))}
      </ul>

      <button onClick={openNewProjectModal}>Add Project</button>

      {newProject && (
        <NewProjectModal
          projectName={projectName}
          setProjectName={setProjectName}
          onSave={handleNewProject}
          onCancel={() => {
            setNewProject(false);
            setProjectName("");
          }}
        />
      )}

      {selectedProjectId && (
        <RenameModal
          newName={newName}
          setNewName={setNewName}
          onSave={handleRename}
          onCancel={() => {
            setSelectedProjectId(null);
            setNewName("");
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
