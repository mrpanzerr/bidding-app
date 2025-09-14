import { checkProductCode } from "../../firebase/lineServices";
import styles from "../../styles/calculatorModules/calculatorUI.module.css";
import EditableField from "./editableField";

export default function SevenFieldCalculatorUI({
  calculator,
  editingState,
  isRefreshing,
  safeAction,
  actions,
  sectionTotal,
  calculateGrandTotal,
}) {
  const handleFieldUpdate = async (sectionId, lineId, field, newValue) => {
    const valueToSave =
      field === "amount" || field === "price" ? Number(newValue) : newValue;
    await safeAction(() =>
      actions.updateField(sectionId, lineId, valueToSave, field)
    );
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
            onSave={(val) =>
              safeAction(() => actions.renameSection(section.id, val.trim()))
            }
            isRefreshing={isRefreshing}
          />

          {/* Lines */}
          {section.lines?.map((line) => (
            <div key={line.id} className={styles.lineStyle}>
              <EditableField
                fieldState={editingState.quantity}
                value={{ id: line.id, value: line.quantity }}
                placeholder="0"
                onSave={async (val) => {
                  await handleFieldUpdate(section.id, line.id, "quantity", val);

                  const qty = Number(val) || 0;
                  const price = Number(line.price) || 0;
                  const product = qty * price;

                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "amount",
                    product
                  );
                }}
                isRefreshing={isRefreshing}
              />
              <EditableField
                fieldState={editingState.productCode}
                value={{ id: line.id, value: line.productCode }}
                placeholder="Product code"
                onSave={async (val) => {
                  const codeData = await checkProductCode(val);
                  if (codeData) {
                    await handleFieldUpdate(
                      section.id,
                      line.id,
                      "price",
                      codeData.price
                    );
                    await handleFieldUpdate(
                      section.id,
                      line.id,
                      "description",
                      codeData.name
                    );
                  }

                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "productCode",
                    val
                  );
                }}
                isRefreshing={isRefreshing}
              />
              <EditableField
                fieldState={editingState.description}
                value={{ id: line.id, value: line.description }}
                placeholder="Product name"
                onSave={async (val) => {
                  handleFieldUpdate(section.id, line.id, "description", val);
                }}
                isRefreshing={isRefreshing}
              />
              <EditableField
                fieldState={editingState.descriptionTwo}
                value={{ id: line.id, value: line.descriptionTwo }}
                placeholder="Click to add description"
                onSave={(val) =>
                  handleFieldUpdate(section.id, line.id, "descriptionTwo", val)
                }
                isRefreshing={isRefreshing}
              />
              <EditableField
                fieldState={editingState.descriptionThree}
                value={{ id: line.id, value: line.descriptionThree }}
                placeholder="ex. 11-0"
                onSave={(val) =>
                  handleFieldUpdate(
                    section.id,
                    line.id,
                    "descriptionThree",
                    val
                  )
                }
                isRefreshing={isRefreshing}
              />

              {/* Price (non-editable) */}
              <div
                style={{
                  width: "100px",
                  padding: "6px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                  textAlign: "right",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                ${Number(line.price).toFixed(2) ?? 0}
              </div>

              {/* Amount (non-editable) */}
              <div
                style={{
                  width: "100px",
                  padding: "6px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  color: "#333",
                  textAlign: "right",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                ${Number(line.amount).toFixed(2) ?? 0}
              </div>

              <button
                onClick={async () => {
                  await safeAction(() =>
                    actions.deleteOne(section.id, line.id)
                  );
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
            Section Total: {Number(section.total).toFixed(2)}
          </div>
        </div>
      ))}
    </>
  );
}
