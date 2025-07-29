import styles from "../../styles/calculatorModules/calculatorUI.module.css";

/**
 * SqftCalculatorUI Component
 *
 * Renders the UI for a square footage calculator, displaying sections and their lines.
 * Supports inline editing of section titles, line descriptions, and measurements.
 * Provides buttons to add/delete lines and sections, and calculates totals accordingly.
 *
 * @param {Object} props - Component props
 * @param {Object} props.calculator - Calculator data including sections and lines
 * @param {string|null} props.editingTitleId - ID of the section currently editing its title
 * @param {function(string|null): void} props.setEditingTitleId - Setter for editingTitleId
 * @param {string} props.titleInput - Current input value for editing section title
 * @param {function(string): void} props.setTitleInput - Setter for titleInput
 * @param {string|null} props.editingDescriptionId - ID of the line currently editing description
 * @param {function(string|null): void} props.setEditingDescriptionId - Setter for editingDescriptionId
 * @param {string} props.lineDescription - Current input value for editing line description
 * @param {function(string): void} props.setLineDescription - Setter for lineDescription
 * @param {string|null} props.editingMeasurementId - ID of the line currently editing measurement
 * @param {function(string|null): void} props.setEditingMeasurementId - Setter for editingMeasurementId
 * @param {string} props.measurement - Current input value for editing measurement
 * @param {function(string): void} props.setMeasurement - Setter for measurement
 * @param {boolean} props.isRefreshing - Indicates if async operations are in progress (disables inputs)
 * @param {function(Function): Promise<void>} props.safeAction - Wrapper to safely run async actions with loading state
 * @param {function(string, string): Promise<void>} props.renameSection - Rename a section by ID
 * @param {function(string, string, string): Promise<void>} props.renameDescription - Rename a line description
 * @param {function(string, string, string): Promise<void>} props.calcMeasurement - Calculate and update measurement for a line
 * @param {function(string): Promise<void>} props.addLine - Add a single line to a section by ID
 * @param {function(string): Promise<void>} props.addTen - Add ten lines to a section by ID
 * @param {function(string, string): Promise<void>} props.deleteOne - Delete one line from a section
 * @param {function(string): Promise<void>} props.deleteTen - Delete ten lines from a section
 * @param {function(string): Promise<void>} props.deleteSection - Delete an entire section by ID
 * @param {function(string): number} props.sectionTotal - Calculate total value of a section by ID
 * @param {function(): number} props.calculateGrandTotal - Calculate total value of the entire calculator
 *
 * @returns {JSX.Element} Rendered calculator UI with editable sections and lines
 */
export default function SqftCalculatorUI({
  calculator,
  editingTitleId,
  setEditingTitleId,
  titleInput,
  setTitleInput,
  editingDescriptionId,
  setEditingDescriptionId,
  lineDescription,
  setLineDescription,
  editingMeasurementId,
  setEditingMeasurementId,
  measurement,
  setMeasurement,
  isRefreshing,
  safeAction,
  renameSection,
  renameDescription,
  calcMeasurement,
  addLine,
  addTen,
  deleteOne,
  deleteTen,
  deleteSection,
  sectionTotal,
  calculateGrandTotal,
}) {
  return (
    <>
      {calculator.section?.length ? (
        calculator.section.map((section) => (
          <div key={section.id} className={styles.sectionBox}>
            {/* Section Title: Editable text input or clickable heading */}
            {editingTitleId === section.id ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={async () => {
                  if (titleInput.trim() !== "") {
                    await safeAction(() =>
                      renameSection(section.id, titleInput.trim())
                    );
                  }
                  setEditingTitleId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.target.blur();
                  }
                }}
                autoFocus
                className={styles.titleInput}
                disabled={isRefreshing}
              />
            ) : (
              <h2
                onClick={() => {
                  if (!isRefreshing) {
                    setEditingTitleId(section.id);
                    setTitleInput(section.title || "");
                  }
                }}
                style={{ cursor: isRefreshing ? "default" : "pointer" }}
              >
                {section.title || (
                  <em style={{ color: "#999" }}>Click to add title</em>
                )}
              </h2>
            )}

            {/* Lines within the section */}
            {Array.isArray(section.lines) &&
              section.lines.map((line) => (
                <div key={line.id} className={styles.lineStyle}>
                  {/* Measurement: Editable input or clickable text */}
                  {editingMeasurementId === line.id ? (
                    <input
                      type="text"
                      placeholder="ex. 60 x 114"
                      value={measurement}
                      onChange={(e) => setMeasurement(e.target.value)}
                      onBlur={() => {
                        setEditingMeasurementId(null);
                        setEditingTitleId(null);
                      }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" || e.key === "Tab") {
                          e.preventDefault();
                          await safeAction(() =>
                            calcMeasurement(
                              section.id,
                              line.id,
                              measurement.trim()
                            )
                          );
                          await safeAction(() => sectionTotal(section.id));
                          await safeAction(() => calculateGrandTotal());
                          setEditingMeasurementId(null);
                          setEditingTitleId(null);
                        }
                      }}
                      autoFocus
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        if (!isRefreshing) {
                          setEditingMeasurementId(line.id);
                          setMeasurement(line.measurement || "");
                        }
                      }}
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: isRefreshing ? "default" : "pointer",
                        color: line.measurement ? "inherit" : "#999",
                        fontStyle: line.measurement ? "normal" : "italic",
                      }}
                    >
                      {line.measurement || "Click to add measurement"}
                    </p>
                  )}

                  {/* Description: Editable input or clickable text */}
                  {editingDescriptionId === line.id ? (
                    <input
                      type="text"
                      placeholder="description"
                      value={lineDescription}
                      onChange={(e) => setLineDescription(e.target.value)}
                      onBlur={async () => {
                        if (lineDescription.trim() !== "") {
                          await safeAction(() =>
                            renameDescription(
                              section.id,
                              line.id,
                              lineDescription.trim()
                            )
                          );
                        }
                        setEditingDescriptionId(null);
                        setEditingTitleId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      autoFocus
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        if (!isRefreshing) {
                          setEditingDescriptionId(line.id);
                          setLineDescription(line.description || "");
                        }
                      }}
                      style={{
                        flex: 1,
                        margin: 0,
                        cursor: isRefreshing ? "default" : "pointer",
                        color: line.description ? "inherit" : "#999",
                        fontStyle: line.description ? "normal" : "italic",
                      }}
                    >
                      {line.description || "Click to add description"}
                    </p>
                  )}

                  {/* Amount: read-only numeric input */}
                  <input
                    type="number"
                    placeholder="Amount"
                    value={line.amount}
                    readOnly
                    style={{ width: "100px", padding: "4px" }}
                    disabled={isRefreshing}
                  />

                  {/* Delete single line button */}
                  <button
                    onClick={async () => {
                      await safeAction(() => deleteOne(section.id, line.id));
                      await safeAction(() => sectionTotal(section.id));
                      await safeAction(() => calculateGrandTotal());
                    }}
                    disabled={isRefreshing}
                  >
                    Delete Line
                  </button>
                </div>
              ))}

            {/* Section action buttons */}
            <div className={styles.sectionButtonGroup}>
              <button
                onClick={() => safeAction(() => addLine(section.id))}
                disabled={isRefreshing}
              >
                + Add Line
              </button>
              <button
                onClick={() => safeAction(() => addTen(section.id))}
                disabled={isRefreshing}
              >
                + 10 Lines
              </button>
              <button
                onClick={async () => {
                  await safeAction(() => deleteTen(section.id));
                  await safeAction(() => sectionTotal(section.id));
                  await safeAction(() => calculateGrandTotal());
                }}
                disabled={isRefreshing}
              >
                - 10 Lines
              </button>
              <button
                onClick={async () => {
                  await safeAction(() => deleteSection(section.id));
                  await safeAction(() => calculateGrandTotal());
                }}
                style={{ color: "red" }}
                disabled={isRefreshing}
              >
                Delete Section
              </button>
            </div>

            {/* Section total display */}
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
    </>
  );
}