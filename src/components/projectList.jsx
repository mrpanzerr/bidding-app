import styles from "../styles/dashboardModules/projectList.module.css";
import ProjectItem from "./projectItem";

function ProjectList({ projects, onOpen, onRename, onDelete }) {
  return (
    <ul className={styles.projectGrid}>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          onOpen={onOpen}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
export default ProjectList;
