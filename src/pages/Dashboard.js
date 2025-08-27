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
  // Fetch project data and expose CRUD functions (create, rename, delete)
  const { projects, loading, error, addNewProject, renameExistingProject, deleteExistingProject } = useProjects();

  const navigate = useNavigate();

  // Custom hook that centralizes modal state and logic for creating, renaming, and deleting projects
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
  } = useProjectManagement({ addNewProject, renameExistingProject, deleteExistingProject });

  // Navigate to a specific project dashboard by ID
  const openProject = (id) => navigate(`/project/${id}`);

  // Handle loading and error states early for cleaner render logic
  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  // Sort projects by creation date (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA;
  });

  // Log out the user and navigate back to login screen
  const handleLogout = async () => {
    try {
      await logout();

      // Delay added to ensure Firebase session cleanup before redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <DashboardLayout
      // Show user email if logged in, otherwise display generic welcome
      title={auth.currentUser ? `Welcome, ${auth.currentUser.email || "User"}` : "Welcome, Guest"}
      onAddProject={openNewProjectModal}
      onLogout={handleLogout}
    >
      <ProjectList
        projects={sortedProjects}
        onOpen={openProject}
        onRename={(id, name) => {
          setSelectedProjectId(id);
          setNewName(name);
          setModalType("rename"); // Trigger rename modal
        }}
        onDelete={(id) => {
          setSelectedProjectId(id);
          setModalType("delete"); // Trigger delete confirmation modal
        }}
      />

      {/* Render modals conditionally based on modalType */}
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
          onSave={handleDelete}
          onCancel={() => setModalType(null)}
        />
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
