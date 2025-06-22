/**
 * ProjectItem Component
 *
 * Displays a single project in a list with options to open, rename, or delete it.
 *
 * Props:
 * - project:    (object) Contains information about the project (like its name and ID)
 * - onOpen:     (function) Called when the user clicks or presses Enter to open the project
 * - onRename:   (function) Called when the user clicks the "Rename" button
 * - onDelete:   (function) Called when the user clicks the "Delete" button
 */

function ProjectItem({ project, onOpen, onRename, onDelete }) {
  return (
    <li
      onClick={() => onOpen(project.id)} // When the whole item is clicked, open the project
      tabIndex="0"                        // Makes the list item focusable with the keyboard (Tab key)
      role="button"                       // Lets screen readers know this item behaves like a button
      onKeyDown={(e) =>
        e.key === "Enter" && onOpen(project.id)
      }                                   // Allow keyboard users to press Enter to open the project
      style={{ cursor: "pointer", userSelect: "none" }} // Add styling: pointer cursor & prevent text highlighting
    >
      {/* Show the project's name */}
      <p>{project.name}</p>

      {/* Rename Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the button click from also triggering the parent click (which would open the project)
          onRename(project.id, project.name || ""); // Trigger rename with current ID and name
        }}
      >
        Rename Project
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the parent list item's onClick from firing
          onDelete(project.id, project.name); // Trigger delete with current ID and name
        }}
      >
        Delete Project
      </button>
    </li>
  );
}

// Export the component so it can be used in other parts of the app (like the dashboard list)
export default ProjectItem;
