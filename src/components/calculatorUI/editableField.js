
export default function EditableField({ fieldState, value, onSave, placeholder, type = "text", isRefreshing }) {
  return fieldState.id === value.id ? (
    <input
      type={type}
      placeholder={placeholder}
      value={fieldState.value}
      onChange={(e) => fieldState.setValue(e.target.value)}
      onBlur={async () => {
        if (fieldState.value.trim() !== "" || type === "number") {
          await onSave(fieldState.value);
        }
        fieldState.setId(null);
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
          fieldState.setId(value.id);
          fieldState.setValue(value.value || "");
        }
      }}
      style={{
        flex: 1,
        margin: 0,
        cursor: isRefreshing ? "default" : "pointer",
        color: value.value ? "inherit" : "#999",
        fontStyle: value.value ? "normal" : "italic",
      }}
    >
      {value.value || placeholder}
    </p>
  );
}
