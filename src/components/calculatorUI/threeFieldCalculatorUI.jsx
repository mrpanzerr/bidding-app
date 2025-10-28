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
    const numericFields = ["pricePerUnit", "squarefoot"];
    const valueToSave = numericFields.includes(field)
      ? Number(newValue)
      : newValue;

    await safeAction(() =>
      actions.updateField(sectionId, lineId, valueToSave, field)
    );

    // if squarefoot or pricePerUnit changes, recalc labor and totals
    if (numericFields.includes(field)) {
      await safeAction(() => actions.laborTotal(sectionId));
      await safeAction(() => sectionTotal(sectionId));
      await safeAction(() => calculateGrandTotal());
    }
  };

  const addCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            onSave={(val) =>
              safeAction(() => actions.renameSection(section.id, val.trim()))
            }
            isRefreshing={isRefreshing}
          />

          {/* Section Headers */}
          <div className={styles.headerRow}>
            <div>Description</div>
            <div>Square Foot</div>
            <div>Price Per Unit</div>
            <div>Total</div>
            <div></div> {/* Empty div for the Delete button column */}
          </div>
          {/* Lines */}
          {section.lines?.map((line) => (
            <div key={line.id} className={styles.lineStyle}>
              {/* Description */}
              <EditableField
                fieldState={editingState.description}
                value={{ id: line.id, value: line.description }}
                placeholder="Click to add description"
                onSave={(val) =>
                  handleFieldUpdate(section.id, line.id, "description", val)
                }
                isRefreshing={isRefreshing}
              />

              {/* Square Foot */}
              <EditableField
                fieldState={editingState.sqft}
                value={{ id: line.id, value: line.squarefoot }}
                type="number"
                placeholder="square foot"
                onSave={(val) =>
                  handleFieldUpdate(section.id, line.id, "squarefoot", val)
                }
                isRefreshing={isRefreshing}
              />

              {/* Price Per Unit */}
              <EditableField
                fieldState={editingState.pricePerUnit}
                value={{ id: line.id, value: line.pricePerUnit }}
                type="number"
                placeholder="price per unit"
                onSave={(val) =>
                  handleFieldUpdate(section.id, line.id, "pricePerUnit", val)
                }
                isRefreshing={isRefreshing}
              />

              {/* Total */}
              <div>${addCommas(Number(line.amount).toFixed(2))}</div>

              <button
                className={styles.sectionButtonGroup}
                onClick={async () => {
                  await safeAction(() =>
                    actions.deleteOne(section.id, line.id)
                  );
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
            <button
              onClick={() => safeAction(() => actions.addLine(section.id))}
              disabled={isRefreshing}
            >
              + Add Line
            </button>
            <button
              onClick={() => safeAction(() => actions.addTen(section.id))}
              disabled={isRefreshing}
            >
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
          <div
            style={{
              fontWeight: "bold",
              marginTop: "0.5rem",
              textAlign: "right",
            }}
          >
            Section Total: ${addCommas(Number(section.total).toFixed(2))}
          </div>
        </div>
      ))}
    </>
  );
}
