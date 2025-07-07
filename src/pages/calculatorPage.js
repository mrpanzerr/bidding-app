// useParams lets you access URL parameters (like the project id from the route)
import { useParams } from "react-router-dom";

import { useState } from "react";

// Import function to fetch project data from Firebase
import { useCalculatorById } from "../hooks/useCalculator";

/**
 * CalculatorPage component displays details for a single calculator.
 * It fetches the project data based on the "id" and "calculatorId" URL parameters.
 */
function CalculatorPage() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id, calculatorId } = useParams();

  const {
    calculator,
    loading: calcLoading,
    error: calcError,
  } = useCalculatorById(id, calculatorId);

  const [sections, setSections] = useState([
    {
      id: 1,
      name: "Section Title",
      lines: [{ id: 1, measurement: "", description: "", amount: 0 }],
    },
  ]);

  // Function to update the name of a specific section by ID in the sections array
  const updateSectionName = (id, newName) => {
    // Loop through all sections and return a new array
    setSections(
      sections.map((section) =>
        // If this section's ID matches the one we're trying to update...
        section.id === id
          ? // ...return a new section object with the updated name
            { ...section, name: newName }
          : // ...otherwise return the section unchanged
            section
      )
    );
  };

  // Function to update a line inside a section by section ID and line ID
  const updateLine = (sectionId, lineId, key, value) => {
    // Go through each section
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          // For the matching section, update the specific line
          return {
            ...section,
            lines: section.lines.map(
              (line) =>
                line.id === lineId
                  ? { ...line, [key]: value } // Update the specified key
                  : line // Keep other lines the same
            ),
          };
        }
        return section;
      })
    );
  };

  // Function to generate unique ID
  const generateId = () => Date.now() + Math.random();

  // Function to add a new line to a given section
  const addLine = (sectionId) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section; // Leave other sections untocuhed

        // Create a new line item with unique ID and default values
        const newLine = {
          id: generateId,
          measurement: "",
          description: "",
          amount: 0,
        };

        // Append the new line to the section's lines array
        return {
          ...section,
          lines: [...section.lines, newLine],
        };
      })
    );
  };

  // Function to add ten lines to a section
  const addTenLines = (sectionId) => {
    const newLines = Array.from({ length: 10 }, () => ({
      id: generateId,
      measurement: "",
      description: "",
      amount: 0,
    }));
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lines: [...section.lines, ...newLines],
        };
      })
    );
  };

  // Function to delete a specific line from a section
  const deleteLine = (sectionId, lineId) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lines: section.lines.filter((line) => line.id !== lineId),
        };
      })
    );
  };

  // Function to delete the last ten lines from a section
  const deleteTenLines = (sectionId) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          lines: section.lines.slice(0, Math.max(section.lines.length - 10, 0)),
        };
      })
    );
  };

  // Function to add a whole new section to the page
  const addSection = () => {
    setSections([
      ...sections, // Keep existing sections
      {
        id: Date.now(),
        name: "Section Title",
        lines: [
          {
            id: Date.now(),
            measurement: "",
            description: "",
            amount: 0,
          },
        ],
      },
    ]);
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  // Function to calculate the area from a measurement string (e.g. "10 x 12") and store in amount
  const calculateMeasurement = (measurement, sectionId, lineId) => {
    const parts = measurement?.split(/x/i).map((p) => p.trim());
    const nums = parts.map((p) => parseFloat(p));
    const product = nums[0] * nums[1] || 0;

    // Only update if not manually edited
    updateLine(sectionId, lineId, "amount", product);
  };

  // Helper function to calculate the total amount for a section
  const sectionTotal = (lines) =>
    Array.isArray(lines)
      ? lines.reduce((sum, line) => sum + Number(line.amount), 0)
      : 0;

  // Calculate the grand total b y summing all section totals
  const grandTotal = Array.isArray(sections)
    ? sections.reduce(
        (total, section) => total + sectionTotal(section?.lines),
        0
      )
    : 0;

  // While loading, show a simple loading message
  if (calcLoading) return <div>Loading...</div>;
  if (calcError)
    return <div>Error loading calculator: {calcError.message}</div>;

  // Render the page
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Render each section block */}
      {sections.map((section) => (
        <div
          key={section.id}
          style={{
            border: "1px solid gray",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          {/* Editable input field for section name */}
          <input
            type="text"
            value={section.name}
            onChange={(e) => updateSectionName(section.id, e.target.value)}
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              border: "none",
              borderBottom: "1px solid lightgray",
              marginBottom: "1rem",
              width: "100%",
            }}
          />

          {/* Loop through all line items in this section */}
          {Array.isArray(section.lines) &&
            section.lines.map((line) => (
              <div
                key={line.id}
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "0.5rem",
                  alignItems: "center",
                }}
              >
                {/* Measurement input field */}
                <input
                  type="text"
                  placeholder="ex. 60 x 114"
                  value={line.measurement}
                  onChange={(e) =>
                    updateLine(
                      section.id,
                      line.id,
                      "measurement",
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Tab") {
                      calculateMeasurement(e.target.value, section.id, line.id);
                    }
                  }}
                  style={{ flex: 1, padding: "4px" }}
                />

                {/* Description input field */}
                <input
                  type="text"
                  placeholder="Description"
                  value={line.description}
                  onChange={(e) =>
                    updateLine(
                      section.id,
                      line.id,
                      "description",
                      e.target.value
                    )
                  }
                  style={{ flex: 1, padding: "4px" }}
                />

                {/* Amount input field */}
                <input
                  type="number"
                  placeholder="Amount"
                  value={line.amount}
                  readOnly
                  style={{ width: "100px", padding: "4px" }}
                />
                <button onClick={() => deleteLine(section.id, line.id)}>
                  Delete
                </button>
              </div>
            ))}

          {/* Button to add a new line to this section */}
          <button
            onClick={() => addLine(section.id)}
            style={{ marginTop: "0.5rem", marginRight: "0.2rem" }}
          >
            + Add Line
          </button>

          {/* Button to add a new line to this section */}
          <button
            onClick={() => addTenLines(section.id)}
            style={{ marginTop: "0.5rem", marginRight: "0.2rem" }}
          >
            + 10 Lines
          </button>

          {/* Button to add a new line to this section */}
          <button
            onClick={() => deleteTenLines(section.id)}
            style={{ marginTop: "0.5rem", marginRight: "0.2rem" }}
          >
            - 10 Lines
          </button>

          {/* Button to delete a section */}
          <button
            onClick={() => deleteSection(section.id)}
            style={{ marginTop: "0.5rem", color: "red" }}
          >
            Delete Section
          </button>

          {/* Show total for this section */}
          <div
            style={{
              fontWeight: "bold",
              marginTop: "0.5rem",
              textAlign: "right",
            }}
          >
            Section Total: {sectionTotal(section.lines).toFixed(2)}
          </div>
        </div>
      ))}

      {/* Button to add a new section to the form */}
      <button onClick={addSection} style={{ marginBottom: "1rem" }}>
        + Add Section
      </button>

      {/* Display the total of all section totals */}
      <h2 style={{ textAlign: "right" }}>
        Grand Total: {grandTotal.toFixed(2)}
      </h2>
    </div>
  );
}

export default CalculatorPage;
