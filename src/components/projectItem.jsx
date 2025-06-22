function ProjectItem({ project, onOpen, onRename, onDelete }) {
  return (
    <li
      onClick={() => onOpen(project.id)}
      tabIndex="0" /* makes the element focusable with keyboard (Tab key) */
      role="button" /* tells screen readers that an element behaves like a button */
      onKeyDown={(e) =>
        e.key === "Enter" && onOpen(project.id)
      } /* adds support for keyboard activation - Enter) */
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <p>{project.name}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename(project.id, project.name || "");
        }}
      >
        Rename Project
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(project.id, project.name);
        }}
      >
        Delete Project
      </button>
    </li>
  );
}

export default ProjectItem;
