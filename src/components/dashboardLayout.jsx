import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import styles from "../styles/dashboardModules/DashboardLayout.module.css";

function DashboardLayout({ title, onAddProject, onLogout, children }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.buttonGroup}>
            <button
              onClick={onAddProject}
              className={`${styles.button} ${styles.blue}`}
            >
              + Add Project
            </button>

            {auth.currentUser ? (
              <button
                onClick={onLogout}
                className={`${styles.button} ${styles.gray}`}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className={`${styles.button} ${styles.gray}`}
              >
                Back to Login
              </button>
            )}

            {auth.currentUser?.uid === "u2jMTVW8OccctfVHx88IQs4cE8L2" && (
              <button
                onClick={() => navigate("/product")}
                className={`${styles.button} ${styles.green}`}
              >
                Product Code Page
              </button>
            )}
          </div>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
