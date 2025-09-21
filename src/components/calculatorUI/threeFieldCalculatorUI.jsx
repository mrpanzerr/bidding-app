import styles from "../../styles/calculatorModules/calculatorUI.module.css";
import EditableField from "./editableField";

export default function ThreeFieldCalculatorUI({
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
    if (field === "amount") {
      await safeAction(() => sectionTotal(sectionId));
      await safeAction(() => calculateGrandTotal());
    }
  };

  return (
    <>
      {calculator.section.map((section) => (
        <div key={section.id} className={styles.sectionBox}>
          {/* Section Title */}
          <EditableField
            fieldState={editingState.title}
            value={{ id: section.id, value: section.title }}
            placeholder="Click to add title"
            onSave={(val) => safeAction(() => actions.renameSection(section.id, val.trim()))}
            isRefreshing={isRefreshing}
          />

          {/* Lines */}
          {section.lines?.map((line) => (
            <div key={line.id} className={styles.lineStyle}>
              {/* Description */}
              <EditableField
                fieldState={editingState.description}
                value={{ id: line.id, value: line.description }}
                placeholder="Click to add description"
                onSave={(val) => handleFieldUpdate(section.id, line.id, "description", val)}
                isRefreshing={isRefreshing}
              />
              
              {/* Description Two*/}
              <EditableField
                fieldState={editingState.descriptionTwo}
                value={{ id: line.id, value: line.descriptionTwo }}
                placeholder="Click to add description"
                onSave={(val) => handleFieldUpdate(section.id, line.id, "descriptionTwo", val)}
                isRefreshing={isRefreshing}
              />
              
              {/* Amount */}
              <EditableField
                fieldState={editingState.amount}
                value={{ id: line.id, value: line.amount }}
                type="number"
                placeholder="$0"
                onSave={(val) => handleFieldUpdate(section.id, line.id, "amount", val)}
                isRefreshing={isRefreshing}
              />

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
      ))}
    </>
  );
}
