import { useState } from "react";

function NameInputModal({ value, setValue, onSave, onCancel, label = "Name Project:" }) {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalBackdropStyle}>
      <div style={{ ...modalBoxStyle, opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}>
        <label style={labelStyle}>
          {label}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault();
                handleSave();
              }
            }}
            placeholder="Enter name"
            style={{ marginTop: "5px", padding: "5px" }}
            disabled={loading}
          />
        </label>
        <div style={buttonRowStyle}>
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const modalBackdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBoxStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontWeight: "bold",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

export default NameInputModal;
