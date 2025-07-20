/**
 * ProjectItem Component
 *
 * Displays a single project in a list with options to open, rename, or delete it.
 *
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object containing ID and name
 * @param {string} props.project.id - Unique ID of the project
 * @param {string} props.project.name - Name of the project
 * @param {(id: string) => void} props.onOpen - Callback fired when the project is opened (clicked or Enter pressed)
 * @param {(id: string, name: string) => void} props.onRename - Callback fired when the rename button is clicked
 * @param {(id: string, name: string) => void} props.onDelete - Callback fired when the delete button is clicked
 *
 * @returns {JSX.Element} The rendered project list item
 */
function ProjectItem({ project, onOpen, onRename, onDelete }) {
  return (
    <li
      onClick={() => onOpen(project.id)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onOpen(project.id)}
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
