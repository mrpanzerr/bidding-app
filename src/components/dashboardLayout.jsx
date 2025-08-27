import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

/**
 * DashboardLayout component
 *
 * Provides a common layout structure for the dashboard,
 * including a title, dynamic children content, and an "Add Project" button.
 *
 * @param {Object} props
 * @param {string} props.title - The page title displayed at the top of the dashboard.
 * @param {function} props.onAddProject - Callback triggered when the "Add Project" button is clicked.
 * @param {React.ReactNode} props.children - The main dashboard content (project list, modals, etc.).
 */
function DashboardLayout({ title, onAddProject, onLogout, children }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1>{title}</h1>
      {children}
      <button onClick={onAddProject}>Add Project</button>
      {auth.currentUser && <button onClick={onLogout}>Logout</button>}
      {!auth.currentUser && (
        <button onClick={() => navigate("/")}>Back to Login</button>
      )}
    </div>
  );
}

export default DashboardLayout;
