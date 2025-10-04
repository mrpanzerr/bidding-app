import styles from "../../styles/calculatorModules/calculatorUI.module.css";
import EditableField from "./editableField";

export default function MeasurementCalculatorUI({
  calculator,
  editingState,
  isRefreshing,
  safeAction,
  actions,
  sectionTotal,
  calculateGrandTotal,
}) {
  const handleFieldUpdate = async (sectionId, lineId, field, newValue) => {
    const valueToSave = field === "amount" ? Number(newValue) : newValue;
    await safeAction(() => actions.updateField(sectionId, lineId, valueToSave, field));
    if (field === "amount" || field === "measurement") {
      await safeAction(() => sectionTotal(sectionId));
      await safeAction(() => calculateGrandTotal());
    }
  };

  return (
    <>
      {calculator.section?.length ? (
        calculator.section.map((section) => (
          <div key={section.id} className={styles.sectionBox}>
            {/* Section Title */}
            <EditableField
              fieldState={editingState.title}
              value={{ id: section.id, value: section.title }}
              placeholder="Click to add title"
              onSave={(val) => safeAction(() => actions.renameSection(section.id, val.trim()))}
              isRefreshing={isRefreshing}
            />

            {/* Section Headers */}
          <div className={styles.headerRow}>
            <div>Measurement</div>
            <div>Description</div>
            <div>Amount</div>
            <div></div> {/* Empty div for the Delete button column */}
          </div>
            {/* Lines */}
            {section.lines?.map((line) => (
              <div key={line.id} className={styles.lineStyle}>
                {/* Measurement */}
                <EditableField
                  fieldState={editingState.measurement}
                  value={{ id: line.id, value: line.measurement }}
                  placeholder="Click to add measurement"
                  onSave={(val) => handleFieldUpdate(section.id, line.id, "measurement", val)}
                  isRefreshing={isRefreshing}
                />

                {/* Description */}
                <EditableField
                  fieldState={editingState.description}
                  value={{ id: line.id, value: line.description }}
                  placeholder="Click to add description"
                  onSave={(val) => handleFieldUpdate(section.id, line.id, "description", val)}
                  isRefreshing={isRefreshing}
                />

                {/* Amount (read-only) */}
                <EditableField
                  fieldState={editingState.amount}
                  value={{ id: line.id, value: line.amount }}
                  type="number"
                  placeholder="$0"
                  onSave={(val) => handleFieldUpdate(section.id, line.id, "amount", val)}
                  isRefreshing={isRefreshing}
                  readOnly
                />

                {/* Delete Line */}
                <button className={styles.sectionButtonGroup}
                  onClick={async () => {
                    await safeAction(() => actions.deleteOne(section.id, line.id));
                    await safeAction(() => sectionTotal(section.id));
                    await safeAction(() => calculateGrandTotal());
                  }}
                  disabled={isRefreshing}
                >
                  Delete
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
