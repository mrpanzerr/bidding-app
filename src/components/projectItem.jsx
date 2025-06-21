function ProjectItem({ project, onOpen, onRename }) {
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
      {/* Show project name or fallback to its ID if no name exists */}
      <p>{project.name}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename(project.id, project.name || "");
        }}
      >
        Rename Project
      </button>
    </li>
  );
}

export default ProjectItem;
