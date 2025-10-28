import { useNavigate } from "react-router";
import { auth } from "../../firebase/firebase";
import { checkProductCode } from "../../firebase/lineServices";
import styles from "../../styles/calculatorModules/calculatorUI.module.css";
import EditableField from "./editableField";

function calculateProductPrice(val, line) {
  const qty = Number(val) || 0;
  const price = Number(line.price) || 0;
  const length = toFeet(line.descriptionThree) || 1; // convert "X-Y" to feet
  return qty * price * length;
}

function toFeet(lengthStr) {
  if (!lengthStr) return 0;

  const [feetStr, inchesStr] = lengthStr.split("-");
  const feet = parseInt(feetStr, 10) || 0;
  const inches = parseInt(inchesStr, 10) || 0;

  return feet + inches / 12;
}

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

  const navigate = useNavigate();

  return (
    <>
      {calculator.section.map((section) => (
        <div key={section.id} className={styles.sectionBox}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
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

            {auth.currentUser?.uid === "u2jMTVW8OccctfVHx88IQs4cE8L2" && (
              <button
                onClick={() => navigate("/product")}
              >
                Product Code Page
              </button>
            )}
          </div>

          {/* Section Headers */}
          <div className={styles.headerRow}>
            <div>Quantity</div>
            <div>Code</div>
            <div>Name</div>
            <div>Description</div>
            <div>Length</div>
            <div>Price</div>
            <div>Total Price</div>
            <div></div>
          </div>
          {/* Lines */}
          {section.lines?.map((line) => (
            <div key={line.id} className={styles.lineStyle}>
              {/* Quantity */}
              <EditableField
                fieldState={editingState.quantity}
                value={{ id: line.id, value: line.quantity }}
                placeholder="0"
                onSave={async (val) => {
                  await handleFieldUpdate(section.id, line.id, "quantity", val);

                  const productPrice = calculateProductPrice(val, line);

                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "amount",
                    productPrice
                  );
                }}
                isRefreshing={isRefreshing}
              />

              {/* Product Code */}
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

                  // 🔥 Recalculate amount after updates
                  const productPrice = calculateProductPrice(line.quantity, {
                    ...line,
                    price: codeData?.price ?? line.price, // use new price if found
                  });

                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "amount",
                    productPrice
                  );
                }}
                isRefreshing={isRefreshing}
              />

              {/* Product Description */}
              <div
                style={{
                  width: "100px",
                  padding: "6px 8px",
                  color: "#333",
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                {line.description}
              </div>

              {/* Extra Description */}
              <EditableField
                fieldState={editingState.descriptionTwo}
                value={{ id: line.id, value: line.descriptionTwo }}
                placeholder="Click to add description"
                onSave={(val) =>
                  handleFieldUpdate(section.id, line.id, "descriptionTwo", val)
                }
                isRefreshing={isRefreshing}
              />

              {/* Length */}
              <EditableField
                fieldState={editingState.descriptionThree}
                value={{ id: line.id, value: line.descriptionThree }}
                placeholder="ex. 11-0"
                onSave={async (val) => {
                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "descriptionThree",
                    val
                  );

                  const productPrice = calculateProductPrice(line.quantity, {
                    ...line,
                    descriptionThree: val,
                  });

                  await handleFieldUpdate(
                    section.id,
                    line.id,
                    "amount",
                    productPrice
                  );
                }}
                isRefreshing={isRefreshing}
              />

              {/* Price (non-editable) */}
              <div
                style={{
                  width: "100px",
                  padding: "6px 8px",
                  color: "#333",
                  textAlign: "center",
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
                  color: "#333",
                  textAlign: "center",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  userSelect: "none",
                }}
              >
                ${addCommas(Number(line.amount).toFixed(2)) ?? 0}
              </div>

              <button
                onClick={async () => {
                  await safeAction(() =>
                    actions.deleteOne(section.id, line.id)
                  );
                  await safeAction(() => sectionTotal(section.id));
                  await safeAction(() => calculateGrandTotal());
                  await safeAction(() => actions.updateTax(0));
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
                await safeAction(() => actions.updateTax(0));
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
