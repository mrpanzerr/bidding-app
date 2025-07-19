/**
 * 
 * Displays a single section in a list with options to rename, add, delete, and edit it.
 * 
 * Props:
 * - section:    (object) Contains information about the section (like its title and ID)
 * - onRename: (function) Called when the user clicks the "Rename" button
 * - onAddLine: (function) Called when the user clicks the "Add Line"
 * - onDelete: (function) Called when the user clicks the "Delete" button
 * - onEdit: (function) Called when the user clicks the "Edit" button
 */

function SectionItem({ section}) {
    return(
        <li>
            <p
            >{section.title}</p>
        </li>
    );
}

export default SectionItem;