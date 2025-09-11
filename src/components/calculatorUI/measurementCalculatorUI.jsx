import styles from "../../styles/calculatorModules/calculatorUI.module.css";

/**
 * MeasurementCalculatorUI Component
 *
 * Renders the UI for a square footage calculator, displaying sections and their lines.
 * Supports inline editing of section titles, line descriptions, and measurements.
 *
 * @param {Object} props
 * @param {Object} props.calculator
 * @param {Object} props.editingState - { title, description, measurement } objects
 * @param {boolean} props.isRefreshing
 * @param {function(Function): Promise<void>} props.safeAction
 * @param {Object} props.actions - { renameSection, renameDescription, calcMeasurement, addLine, addTen, deleteOne, deleteTen, deleteSection }
 * @param {function(string): number} props.sectionTotal
 * @param {function(): number} props.calculateGrandTotal
 */
export default function MeasurementCalculatorUI({
  calculator,
  editingState,
  isRefreshing,
  safeAction,
  actions,
  sectionTotal,
  calculateGrandTotal,
}) {
  return (
    <>
      {calculator.section?.length ? (
        calculator.section.map((section) => (
          <div key={section.id} className={styles.sectionBox}>
            {/* Section Title */}
            {editingState.title.id === section.id ? (
              <input
                type="text"
                value={editingState.title.value}
                onChange={(e) => editingState.title.setValue(e.target.value)}
                onBlur={async () => {
                  if (editingState.title.value.trim() !== "") {
                    await safeAction(() =>
                      actions.renameSection(section.id, editingState.title.value.trim())
                    );
                  }
                  editingState.title.setId(null);
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
                    editingState.title.setId(section.id);
                    editingState.title.setValue(section.title || "");
                  }
                }}
                style={{ cursor: isRefreshing ? "default" : "pointer" }}
              >
                {section.title || <em style={{ color: "#999" }}>Click to add title</em>}
              </h2>
            )}

            {/* Lines */}
            {Array.isArray(section.lines) &&
              section.lines.map((line) => (
                <div key={line.id} className={styles.lineStyle}>
                  {/* Measurement */}
                  {editingState.measurement.id === line.id ? (
                    <input
                      type="text"
                      placeholder="ex. 60 x 114"
                      value={editingState.measurement.value}
                      onChange={(e) => editingState.measurement.setValue(e.target.value)}
                      onBlur={() => editingState.measurement.setId(null)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" || e.key === "Tab") {
                          e.preventDefault();
                          await safeAction(() =>
                            actions.calcMeasurement(section.id, line.id, editingState.measurement.value.trim())
                          );
                          await safeAction(() => sectionTotal(section.id));
                          await safeAction(() => calculateGrandTotal());
                          editingState.measurement.setId(null);
                        }
                      }}
                      autoFocus
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        if (!isRefreshing) {
                          editingState.measurement.setId(line.id);
                          editingState.measurement.setValue(line.measurement || "");
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

                  {/* Description */}
                  {editingState.description.id === line.id ? (
                    <input
                      type="text"
                      placeholder="description"
                      value={editingState.description.value}
                      onChange={(e) => editingState.description.setValue(e.target.value)}
                      onBlur={async () => {
                        if (editingState.description.value.trim() !== "") {
                          await safeAction(() =>
                            actions.renameDescription(section.id, line.id, editingState.description.value.trim(), "description")
                          );
                        }
                        editingState.description.setId(null);
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
                          editingState.description.setId(line.id);
                          editingState.description.setValue(line.description || "");
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

                  {/* Amount */}
                  <input
                    type="number"
                    placeholder="Amount"
                    value={line.amount}
                    readOnly
                    style={{ width: "100px", padding: "4px" }}
                    disabled={isRefreshing}
                  />

                  {/* Delete Line */}
                  <button
                    onClick={async () => {
                      await safeAction(() => actions.deleteOne(section.id, line.id));
                      await safeAction(() => sectionTotal(section.id));
                      await safeAction(() => calculateGrandTotal());
                    }}
                    disabled={isRefreshing}
                  >
                    Delete Line
                  </button>
                </div>
              ))}

            {/* Section Buttons */}
            <div className={styles.sectionButtonGroup}>
              <button onClick={() => safeAction(() => actions.addLine(section.id))} disabled={isRefreshing}>
                + Add Line
              </button>
              <button onClick={() => safeAction(() => actions.addTen(section.id))} disabled={isRefreshing}>
                + 10 Lines
              </button>
              <button
                onClick={async () => {
                  await safeAction(() => actions.deleteTen(section.id));
                  await safeAction(() => sectionTotal(section.id));
                  await safeAction(() => calculateGrandTotal());
                }}
                disabled={isRefreshing}
              >
                - 10 Lines
              </button>
              <button
                onClick={async () => {
                  await safeAction(() => actions.deleteSection(section.id));
                  await safeAction(() => calculateGrandTotal());
                }}
                style={{ color: "red" }}
                disabled={isRefreshing}
              >
                Delete Section
              </button>
            </div>

            {/* Section Total */}
            <div style={{ fontWeight: "bold", marginTop: "0.5rem", textAlign: "right" }}>
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
