import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

import DashboardLayout from "../components/dashboardLayout";
import DeleteModal from "../components/modals/deleteModal";
import NewProjectModal from "../components/modals/newProjectModal";
import RenameModal from "../components/modals/renameModal";
import ProjectList from "../components/projectList";

import { logout } from "../firebase/authServices";
import { useProjectManagement } from "../hooks/useProjectManagement";
import { useProjects } from "../hooks/useProjects";

function Dashboard() {
  const { projects, loading, error, addNewProject, renameExistingProject, deleteExistingProject } = useProjects();
  const navigate = useNavigate();

  // Hook that handles modals, input, and calling the useProjects functions
  const {
    modalType,
    setModalType,
    openNewProjectModal,
    handleNewProject,
    handleRename,
    handleDelete,
    projectName,
    setProjectName,
    newName,
    setNewName,
    setSelectedProjectId,
    originalName,
    setOriginalName,
    deleteName,
    setDeleteName
  } = useProjectManagement({ addNewProject, renameExistingProject, deleteExistingProject });

  const openProject = (id) => navigate(`/project/${id}`);

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA;
  });

  const handleLogout = async () => {
    try {
      await logout();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };


  return (
    <DashboardLayout
      title={auth.currentUser ? `Welcome, ${auth.currentUser.email || "User"}` : "Welcome, Guest"}
      onAddProject={openNewProjectModal}
    >
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
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "rename" && (
        <RenameModal
          newName={newName}
          setNewName={setNewName}
          onSave={handleRename}
          onCancel={() => setModalType(null)}
        />
      )}

      {modalType === "delete" && (
        <DeleteModal
          deleteName={deleteName}
          setDeleteName={setDeleteName}
          originalName={originalName}
          onSave={handleDelete}
          onCancel={() => setModalType(null)}
        />
      )}

      {auth.currentUser && (
        <button onClick={handleLogout}>Logout</button>
      )}

      {!auth.currentUser && (
        <button onClick={() => navigate("/")}>Back to Login</button>
      )}
    </DashboardLayout>
  );
}
export default Dashboard;