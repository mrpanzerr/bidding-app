export default function EditableField({
  fieldState,
  value,
  onSave,
  placeholder,
  type = "text",
  isRefreshing,
  boldValue = false, 
}) {
  return fieldState.id === value.id ? (
    <input
      type={type}
      placeholder={placeholder}
      value={fieldState.value}
      onChange={(e) => fieldState.setValue(e.target.value)}
      onBlur={async () => {
        const val = fieldState.value;
        if ((typeof val === "string" && val.trim() !== "") || type === "number") {
          await onSave(val);
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
      {value.value ? (
        boldValue ? <strong>{value.value}%</strong> : value.value
      ) : (
        placeholder
      )}
    </p>
  );
}
