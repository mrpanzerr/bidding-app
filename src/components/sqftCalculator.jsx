import { useState } from "react"; // useState is a React hook that lets us add local state to a functional component.

export default function SqftCalculator() {
    // `rows` is our main state variable, an array where each element is an object
    // representing a single form row. Each row has a `measurement`, `description`,
    // and a `lineTotal`. Initially, we start with one blank row.
    const [rows, setRows] = useState([{ measurement: '', description: '', lineTotal: 0 }]);

    // This function adds a single blank row to the end of the `rows` array.
    // We use the spread operator (`...rows`) to copy all the existing row objects into a new array.
    // Then we add a new row object to that array. Finally, we update the state with the new array.
    const addRow = () => {
        setRows([...rows, { measurement: '', description: '', lineTotal: 0 }]);
    };

    // This function adds ten blank rows to the existing array of rows.
    // We use Array.from to genera5te an array of 10 identical row objects.
    // Then we use the spread operator to append all of them to the current state.
    const addTen = () => {
        const newRows = Array.from({ length: 10 }, () => ({
            measurement: '',
            description: '',
            lineTotal: 0
        }));
        setRows([...rows, ...newRows]);
    };

    // This function deletes a specific row based on its index.
    // `index` is the position of the row in the array (0 for the first row, 1 for the second, etc.).
    // `rows.filter` creates a new array that includes all rows except the one with the matching index.
    const deleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // This function deletes the last 10 rows in the array.
    // `rows.slice(0, Math.max(rows.length - 10, 0))` keeps only the first `length - 10` rows.
    // If there are fewer than 10 rows, it returns an empty array.
    const deleteTen = () => {
        setRows(rows.slice(0, Math.max(rows.length - 10, 0)));
    }

    // This function handles changes to individual row fields.
    // It takes in three arguments:
    // - `index`: the position of the row in the array
    // - `field`: a string ('measurement' or 'description') indicating which property to update
    // - `value`: the new value to set for the specified field
    // We make a copy of the `rows` array, update the specific field of the appropriate row,
    // and then update the state with this modified array.
    const handleRowChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    // This function is triggered when the user presses a key inside the measurement input.
    // If the key is "Enter" or "Tab", it calls `calculateMeasurement` to compute the area.
    const handleKeyDown = (e, index) => {
        if (e.key === "Enter" || e.key === "Tab") {
            calculateMeasurement(e.target.value, index);
        }
    };

    // This function takes a measurement string (like "60 x 114") and an index.
    // It splits the string by the letter "x" (case-insensitive) to separate width and height.
    // `split(/x/i)` splits on either "x" or "X".
    // `map(p => p.trim())` removes any extra spaces from each part.
    // `parseFloat(p)` converts each cleaned string to a number.
    // We multiply the two numbers together to get the area (or 0 if invalid).
    // Then we update the corresponding row’s `lineTotal` in state.
    const calculateMeasurement = (measurement, index) => {
        const parts = measurement?.split(/x/i).map((p) => p.trim());
        const nums = parts.map((p) => parseFloat(p));
        const product = nums[0] * nums[1] || 0;
        const newRows = [...rows];
        newRows[index].lineTotal = product;
        setRows(newRows);
    };

    // This constant calculates the sum of all `lineTotal` values across all rows.
    // `rows.reduce()` goes through each row, adds its lineTotal to the running total (`sum`),
    // and returns the grand total. We use `Number()` to make sure the values are numeric.
    const grandTotal = rows.reduce((sum, row) => sum + Number(row.lineTotal), 0);

    return (
        <div>
            {/* Here we loop over each row in the `rows` array using `map()`.
                For each row, we render three inputs (measurement, description, lineTotal)
                and a delete button. We use the index of the row as the key. */}
            {rows.map((row, index) => (
                <div key={index}>
                    {/* This input holds the measurement string.
                        When changed, it updates the corresponding field in state.
                        When the user presses Enter or Tab, it triggers the calculation. */}
                    <input
                        value={row.measurement}
                        onChange={(e) => handleRowChange(index, 'measurement', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder="e.g., 60 x 114"
                    />

                    {/* This input holds the description text.
                        It updates the corresponding field in the state when changed. */}
                    <input
                        value={row.description}
                        onChange={(e) => handleRowChange(index, 'description', e.target.value)}
                        placeholder="Description"
                    />

                    {/* This input displays the calculated line total.
                        It is read-only to prevent user editing. */}
                    <input
                        type="text"
                        value={row.lineTotal}
                        readOnly
                        placeholder="Line Total"
                    />

                    {/* Clicking this button will delete the row at this index. */}
                    <button onClick={() => deleteRow(index)}>Delete</button>
                </div>
            ))}

            {/* Buttons for adding or removing multiple rows at once. */}
            <br />
            <button onClick={addRow}>Add Row</button>
            <button onClick={addTen}>10 Rows</button>
            <button onClick={deleteTen}>Delete 10</button>

            {/* This section displays the grand total of all row totals.
                It's presented in three read-only input fields for layout clarity. */}
            <div>
                <input type="text" value="" readOnly />
                <input type="text" value="Grand Total" readOnly />
                <input type="text" value={grandTotal} readOnly />
            </div>
        </div>
    );
}
