import ProjectItem from "./projectItem";

function ProjectList({ projects, onOpen, onRename, onDelete }) {
  return (
    <ul>
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
