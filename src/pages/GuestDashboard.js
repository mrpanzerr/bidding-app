import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboardLayout";
import ProjectList from "../components/projectList";

import DeleteModal from "../components/modals/deleteModal";
import NewProjectModal from "../components/modals/newProjectModal";
import RenameModal from "../components/modals/renameModal";

import { useProjectManagement } from "../hooks/useProjectManagement";
import { useProjects } from "../hooks/useProjects";

function GuestDashboard() {
  const {
    projects,
    loading,
    error,
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  } = useProjects();

  const navigate = useNavigate();

  const {
    modalType,
    setModalType,
    setSelectedProjectId,
    projectName,
    setProjectName,
    newName,
    setNewName,
    originalName,
    setOriginalName,
    deleteName,
    setDeleteName,

    openNewProjectModal,
    handleNewProject,
    handleRename,
    handleDelete,
  } = useProjectManagement({
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  });

  // Sort projects by creation date
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA;
  });

  const openProject = (id) => {
    navigate(`/project/${id}`);
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <DashboardLayout title="Welcome, Guest" onAddProject={openNewProjectModal}>
      <ProjectList
        projects={sortedProjects}
        onOpen={openProject}
        onRename={(id, name) => {
          setSelectedProjectId(id);
          setNewName(name);
          setModalType("rename");
        }}
        onDelete={(id, name) => {
          setSelectedProjectId(id);
          setOriginalName(name);
          setModalType("delete");
        }}
      />

      {modalType === "new" && (
        <NewProjectModal
          projectName={projectName}
          setProjectName={setProjectName}
          onSave={handleNewProject}
          onCancel={() => {
            setModalType(null);
            setProjectName("");
          }}
        />
      )}

      {modalType === "rename" && (
        <RenameModal
          newName={newName}
          setNewName={setNewName}
          onSave={handleRename}
          onCancel={() => {
            setSelectedProjectId(null);
            setNewName("");
            setModalType(null);
          }}
        />
      )}

      {modalType === "delete" && (
        <DeleteModal
          deleteName={deleteName}
          setDeleteName={setDeleteName}
          originalName={originalName}
          onSave={handleDelete}
          onCancel={() => {
            setSelectedProjectId(null);
            setOriginalName("");
            setDeleteName("");
            setModalType(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

export default GuestDashboard;
