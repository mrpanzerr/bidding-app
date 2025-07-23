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
}) {
  return (
    <>
      {calculator.section?.length ? (
        calculator.section.map((section) => (
          <div key={section.id} style={sectionBoxStyle}>
            {editingTitleId === section.id ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={async () => {
                  if (titleInput.trim() !== "") {
                    await safeAction(() => renameSection(section.id, titleInput.trim()));
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
                style={titleInputStyle}
                disabled={isRefreshing}
              />
            ) : (
              <h2
                onClick={() => !isRefreshing && setEditingTitleId(section.id)}
                style={{ cursor: isRefreshing ? "default" : "pointer" }}
              >
                {section.title || <em style={{ color: "#999" }}>Click to add title</em>}
              </h2>
            )}

            {Array.isArray(section.lines) &&
              section.lines.map((line) => (
                <div key={line.id} style={lineStyle}>
                  {/* Measurement */}
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
                          await safeAction(() => calcMeasurement(section.id, line.id, measurement.trim()));
                          await safeAction(() => sectionTotal(section.id));
                          setEditingMeasurementId(null);
                          setEditingTitleId(null);
                        }
                      }}
                      autoFocus
                      style={{ flex: 1, padding: "4px" }}
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() => !isRefreshing && setEditingMeasurementId(line.id)}
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
                  {editingDescriptionId === line.id ? (
                    <input
                      type="text"
                      placeholder="description"
                      value={lineDescription}
                      onChange={(e) => setLineDescription(e.target.value)}
                      onBlur={async () => {
                        if (lineDescription.trim() !== "") {
                          await safeAction(() =>
                            renameDescription(section.id, line.id, lineDescription.trim())
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
                      style={descriptionInputStyle}
                      disabled={isRefreshing}
                    />
                  ) : (
                    <p
                      onClick={() => !isRefreshing && setEditingDescriptionId(line.id)}
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

                  {/* Delete line */}
                  <button
                    onClick={() => safeAction(() => deleteOne(section.id, line.id))}
                    disabled={isRefreshing}
                  >
                    Delete Line
                  </button>
                </div>
              ))}

            {/* Section buttons */}
            <div style={sectionButtonGroupStyle}>
              <button onClick={() => safeAction(() => addLine(section.id))} disabled={isRefreshing}>
                + Add Line
              </button>
              <button onClick={() => safeAction(() => addTen(section.id))} disabled={isRefreshing}>
                + 10 Lines
              </button>
              <button onClick={() => safeAction(() => deleteTen(section.id))} disabled={isRefreshing}>
                - 10 Lines
              </button>
              <button
                onClick={() => safeAction(() => deleteSection(section.id))}
                style={{ color: "red" }}
                disabled={isRefreshing}
              >
                Delete Section
              </button>
            </div>

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

const sectionBoxStyle = {
  border: "1px solid gray",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "8px",
};

const titleInputStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  border: "none",
  borderBottom: "1px solid lightgray",
  marginBottom: "1rem",
  width: "100%",
};

const descriptionInputStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  border: "none",
  borderBottom: "1px solid lightgray",
  marginBottom: "1rem",
  flex: 1,
};

const lineStyle = {
  display: "flex",
  gap: "1rem",
  marginTop: "0.5rem",
  alignItems: "center",
};

const sectionButtonGroupStyle = {
  marginTop: "1rem",
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
};
