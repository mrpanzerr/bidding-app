import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/authServices";
import { auth } from "../firebase/firebase";

import DashboardLayout from "../components/dashboardLayout";
import DeleteModal from "../components/modals/deleteModal";
import NewProjectModal from "../components/modals/newProjectModal";
import RenameModal from "../components/modals/renameModal";
import ProjectList from "../components/projectList";

import { useProjectManagement } from "../hooks/useProjectManagement";
import { useProjects } from "../hooks/useProjects";

function Dashboard() {
  const {
    projects,
    loading,
    error,
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  } = useProjects();

  const navigate = useNavigate();

  // Modal / project state
  const [modalType, setModalType] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [newName, setNewName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const {
    openNewProjectModal,
    handleNewProject,
    handleRename,
    handleDelete,
  } = useProjectManagement({
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
    setModalType,
    setProjectName,
    setNewName,
    setOriginalName,
    setDeleteName,
    setSelectedProjectId,
  });

  const openProject = (id) => navigate(`/project/${id}`);

  const handleLogout = async () => {
    try {
      await logout();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.createdAt?.toDate() || new Date(0);
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA;
  });

  const isUser = !!auth.currentUser;

  return (
    <DashboardLayout
      title={isUser ? `Welcome, ${auth.currentUser.displayName || "User"}` : "Welcome, Guest"}
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

      {isUser && (
        <button style={{ marginBottom: 20 }} onClick={handleLogout}>
          Logout
        </button>
      )}

      {!isUser && (
        <button style={{ marginBottom: 20 }} onClick={() => navigate("/")}>
          Back to login
        </button>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
