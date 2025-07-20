import { useState } from "react";

/**
 * CalculatorPageUI Component
 *
 * UI for displaying and editing a calculator with multiple sections and lines.
 * Supports renaming sections, editing line descriptions and measurements,
 * adding/removing lines and sections, calculating amounts, and deleting the calculator.
 *
 * @param {Object} props
 * @param {Object} props.calculator - Calculator data object
 * @param {string} props.calculator.name - Calculator name
 * @param {Array<Object>} props.calculator.section - Array of section objects
 * @param {boolean} props.error - Error state (if any)
 * @param {boolean} props.loading - Loading state for initial data
 * @param {boolean} props.loadingMutation - Loading state for mutations (not used here)
 * @param {boolean} props.isRefreshing - Boolean indicating if a backend call is in progress
 * @param {function(boolean):void} props.setIsRefreshing - Setter for isRefreshing state
 * @param {function(): Promise<void>} props.addNewSection - Adds a new section to the calculator
 * @param {function(string): Promise<void>} props.deleteSection - Deletes a section by ID
 * @param {function(string, string): Promise<void>} props.renameSection - Renames a section by ID
 * @param {function(string, string, string): Promise<void>} props.renameDescription - Updates line description
 * @param {function(string): Promise<void>} props.addLine - Adds a single line to a section by ID
 * @param {function(string): Promise<void>} props.addTen - Adds ten lines to a section by ID
 * @param {function(string, string): Promise<void>} props.deleteOne - Deletes one line by section ID and line ID
 * @param {function(string): Promise<void>} props.deleteTen - Deletes ten lines from a section by ID
 * @param {function(): Promise<void>} props.deleteCalculatorFunction - Deletes the entire calculator
 * @param {function(string, string, string): Promise<void>} props.calcMeasurement - Calculates amount from measurement string
 * @param {function(): void} [props.navigateAfterDelete] - Optional callback after deleting calculator (e.g., navigation)
 *
 * @returns {JSX.Element} The calculator page UI
 */
export default function CalculatorPageUI({
  calculator,
  error,
  loading,
  loadingMutation,
  isRefreshing,
  setIsRefreshing,
  addNewSection,
  deleteSection,
  renameSection,
  renameDescription,
  addLine,
  addTen,
  deleteOne,
  deleteTen,
  deleteCalculatorFunction,
  calcMeasurement,
  navigateAfterDelete,
}) {
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState("");

  const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  const [lineDescription, setLineDescription] = useState("");

  const [editingMeasurementId, setEditingMeasurementId] = useState(null);
  const [measurement, setMeasurement] = useState("");

  // Wrap backend calls with loading state toggle
  const safeAction = async (action) => {
    setIsRefreshing(true);
    try {
      await action();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handlers
  const handleTitleClick = (section) => {
    setEditingTitleId(section.id);
    setTitleInput(section.title);
  };

  const handleDescriptionClick = (sectionId, line) => {
    setEditingTitleId(sectionId);
    setEditingDescriptionId(line.id);
    setLineDescription(line.description);
  };

  const handleMeasurementClick = (sectionId, line) => {
    setEditingTitleId(sectionId);
    setEditingMeasurementId(line.id);
    setMeasurement(line.measurement);
  };

  const handleTitleChange = (e) => setTitleInput(e.target.value);
  const handleDescriptionChange = (e) => setLineDescription(e.target.value);
  const handleMeasurementChange = (e) => setMeasurement(e.target.value);

  const handleTitleBlur = async (sectionId) => {
    if (titleInput.trim() !== "") {
      await safeAction(() => renameSection(sectionId, titleInput.trim()));
    }
    setEditingTitleId(null);
  };

  const handleDescriptionBlur = async (sectionId, lineId) => {
    if (lineDescription.trim() !== "") {
      await safeAction(() =>
        renameDescription(sectionId, lineId, lineDescription.trim())
      );
    }
    setEditingDescriptionId(null);
    setEditingTitleId(null);
  };

  const handleMeasurementBlur = () => {
    setEditingMeasurementId(null);
    setEditingTitleId(null);
  };

  const handleTitleKeyDown = (e, sectionId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleDescriptionKeyDown = (e, lineId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const handleMeasurementKeyDown = async (e, sectionId, lineId) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      await safeAction(() =>
        calcMeasurement(sectionId, lineId, measurement.trim())
      );
      setEditingMeasurementId(null);
      setEditingTitleId(null);
    }
  };

  // Other UI handlers
  const handleAddLine = (sectionId) => safeAction(() => addLine(sectionId));
  const handleAddTenLines = (sectionId) => safeAction(() => addTen(sectionId));
  const handleDeleteLine = (sectionId, line) => safeAction(() => deleteOne(sectionId, line.id));
  const handleDeleteTenLines = (sectionId) => safeAction(() => deleteTen(sectionId));

  const handleDeleteCalculator = async () => {
    await safeAction(() => deleteCalculatorFunction());
    if (navigateAfterDelete) navigateAfterDelete();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {isRefreshing}

      <h1>{calculator?.name || "Calculator"}</h1>

      {calculator?.section?.length ? (
        calculator.section.map((section) => (
          <div
            key={section.id}
            style={{
              border: "1px solid gray",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            {editingTitleId === section.id ? (
              <input
                type="text"
                value={titleInput}
                onChange={handleTitleChange}
                onBlur={() => handleTitleBlur(section.id)}
                onKeyDown={(e) => handleTitleKeyDown(e, section.id)}
                autoFocus
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  border: "none",
                  borderBottom: "1px solid lightgray",
                  marginBottom: "1rem",
                  width: "100%",
                }}
                disabled={isRefreshing}
              />
            ) : (
              <h2
                onClick={() => !isRefreshing && handleTitleClick(section)}
                style={{ cursor: isRefreshing ? "default" : "pointer" }}
              >
                {section.title}
              </h2>
            )}

            {Array.isArray(section.lines) &&
              section.lines.map((line) => (
                <div
                  key={line.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginTop: "0.5rem",
                    alignItems: "center",
                  }}
                >
                  {/* Measurement */}
                  {editingMeasurementId === line.id ? (
                    <input
                      type="text"
                      placeholder="ex. 60 x 114"
                      value={measurement}
                      onChange={handleMeasurementChange}
                      onBlur={handleMeasurementBlur}
                      onKeyDown={(e) =>
                        handleMeasurementKeyDown(e, section.id, line.id)
                      }
                      autoFocus
                      style={{ flex: 1, padding: "4px" }}
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() =>
                        !isRefreshing && handleMeasurementClick(section.id, line)
                      }
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: isRefreshing ? "default" : "pointer",
                      }}
                    >
                      {line.measurement}
                    </p>
                  )}

                  {/* Description */}
                  {editingDescriptionId === line.id ? (
                    <input
                      type="text"
                      placeholder="description"
                      value={lineDescription}
                      onChange={handleDescriptionChange}
                      onBlur={() => handleDescriptionBlur(section.id, line.id)}
                      onKeyDown={(e) => handleDescriptionKeyDown(e, line.id)}
                      autoFocus
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        border: "none",
                        borderBottom: "1px solid lightgray",
                        marginBottom: "1rem",
                        flex: 1,
                      }}
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() =>
                        !isRefreshing && handleDescriptionClick(section.id, line)
                      }
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: isRefreshing ? "default" : "pointer",
                      }}
                    >
                      {line.description}
                    </p>
                  )}

                  {/* Amount */}
                  <input
                    type="number"
                    placeholder="Amount"
                    value={line.amount}
                    readOnly
                    style={{ width: "100px", padding: "4px" }}
                    disabled={isRefreshing}
                  />

                  {/* Delete line */}
                  <button
                    onClick={() => handleDeleteLine(section.id, line)}
                    disabled={isRefreshing}
                  >
                    Delete Line
                  </button>
                </div>
              ))}

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => handleAddLine(section.id)}
                disabled={isRefreshing}
              >
                + Add Line
              </button>
              <button
                onClick={() => handleAddTenLines(section.id)}
                disabled={isRefreshing}
              >
                + 10 Lines
              </button>
              <button
                onClick={() => handleDeleteTenLines(section.id)}
                disabled={isRefreshing}
              >
                - 10 Lines
              </button>
              <button
                onClick={() => deleteSection(section.id)}
                style={{ color: "red" }}
                disabled={isRefreshing}
              >
                Delete Section
              </button>
            </div>

            <div
              style={{
                fontWeight: "bold",
                marginTop: "0.5rem",
                textAlign: "right",
              }}
            >
              Section Total: {section.total}
            </div>
          </div>
        ))
      ) : (
        <p>No sections found yet.</p>
      )}

      <button onClick={() => safeAction(addNewSection)} disabled={isRefreshing}>
        + Add Section
      </button>

      <p>Grand Total: {calculator?.grandTotal || 0}</p>

      <button onClick={handleDeleteCalculator} disabled={isRefreshing}>
        Delete Calculator
      </button>
    </div>
  );
}
