// exportUtils.js
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Helper to get the correct total
const getCalculatorTotal = (calc) => {
  if (
    calc.type === "SevenFieldCalculator" &&
    typeof calc.finalTotal === "number"
  ) {
    return calc.finalTotal;
  } else if (typeof calc.grandTotal === "number") {
    return calc.grandTotal;
  }
  return 0;
};

// ==========================
// MATERIAL LIST EXPORTS
// ==========================

/**
 * Export Material List to PDF — grouped by calculator
 */
export const exportMaterialListToPDF = (project, calculators) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Material List - ${project.name}`, 14, 20);

  let currentY = 30;

  // Only include SevenFieldCalculators
  const filteredCalcs = calculators.filter(
    (calc) => calc.type === "SevenFieldCalculator"
  );

  if (filteredCalcs.length === 0) {
    doc.text("No material calculators or line items found.", 14, currentY);
    doc.save(`${project.name}_materials.pdf`);
    return;
  }

  filteredCalcs.forEach((calc, index) => {
    // Add calculator name
    doc.setFontSize(14);
    doc.text(calc.name || `Calculator ${index + 1}`, 14, currentY);
    currentY += 5;

    // --- Optional: Include section titles ---
    /*
      (calc.section || []).forEach((sec) => {
        doc.setFontSize(12);
        doc.text(sec.name || "Section", 18, currentY);
        currentY += 5;

        const lines = sec.lines || [];
        if (lines.length === 0) {
          doc.setFontSize(10);
          doc.text("No line items in this section.", 20, currentY);
          currentY += 10;
          return;
        }

        const tableColumn = ["#", "Quantity", "Product Code", "Name", "Length"];
        const tableRows = lines.map((line, i) => [
          i + 1,
          line.quantity || "",
          line.productCode || "",
          line.description || "",
          line.descriptionThree || "",
        ]);

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: currentY,
          styles: { halign: "center" },
          headStyles: { halign: "center", fillColor: [200, 200, 200] },
        });

        currentY = doc.lastAutoTable.finalY + 5;
      */

    const lines = (calc.section || []).flatMap((sec) => sec.lines || []) || [];

    if (lines.length === 0) {
      doc.setFontSize(10);
      doc.text("No line items found.", 20, currentY + 5);
      currentY += 10;
      return;
    }

    // Prepare table
    const tableColumn = ["Quantity", "Product Code", "Name", "Length"];
    const tableRows = lines.map((line) => [
      line.quantity || "",
      line.productCode || "",
      line.description || "",
      line.descriptionThree || "",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      styles: { halign: "center" },
      headStyles: { halign: "center", fillColor: [200, 200, 200] },
    });

    // Get where the table ended
    currentY = doc.lastAutoTable.finalY + 10;

    // Add page break if near bottom
    if (currentY > 270 && index < filteredCalcs.length - 1) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.save(`${project.name}_Material_List.pdf`);
};

/**
 * Export Material List to Excel — each calculator gets its own sheet
 */
export const exportMaterialListToExcel = (project, calculators) => {
  const wb = XLSX.utils.book_new();

  // Only include SevenFieldCalculators
  const filteredCalcs = calculators.filter(
    (calc) => calc.type === "SevenFieldCalculator"
  );

  if (filteredCalcs.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([["No material data found."]]);
    XLSX.utils.book_append_sheet(wb, ws, "Materials");
  } else {
    filteredCalcs.forEach((calc, index) => {
      const calcName = calc.name?.trim() || `Calculator ${index + 1}`;

      const lines =
        (calc.section || []).flatMap((sec) => sec.lines || []) || [];

      const data =
        lines.length > 0
          ? [
              ["Quantity", "Product Code", "Name", "Length"],
              ...lines.map((line) => [
                line.quantity || "",
                line.productCode || "",
                line.description || "",
                line.descriptionThree || "",
              ]),
            ]
          : [["No line items found."]];

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Limit sheet name to 31 chars (Excel restriction)
      const safeName = calcName.slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, safeName);
    });
  }

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `${project.name}_Material_List.xlsx`
  );
};

// ==========================
// LABOR EXPORTS
// ==========================

/**
 * Export Labor List to PDF — grouped by calculator
 */
export const exportLaborToPDF = (project, calculators) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Labor List - ${project.name}`, 14, 20);

  let currentY = 30;

  // Only include ThreeFieldCalculators
  const laborCalcs = calculators.filter(
    (calc) => calc.type === "ThreeFieldCalculator"
  );

  const laborTotal = laborCalcs.reduce(
    (sum, calc) => sum + Number(calc.grandTotal || 0),
    0
  );

  if (laborCalcs.length === 0) {
    doc.text("No labor calculators or line items found.", 14, currentY);
    doc.save(`${project.name}_Labor_List.pdf`);
    return;
  }

  laborCalcs.forEach((calc, index) => {
    // Add calculator name
    doc.setFontSize(14);
    doc.text(calc.name || `Calculator ${index + 1}`, 14, currentY);
    currentY += 5;

    const lines = (calc.section || []).flatMap((sec) => sec.lines || []) || [];

    if (lines.length === 0) {
      doc.setFontSize(10);
      doc.text("No line items found.", 20, currentY + 5);
      currentY += 10;
      return;
    }

    const tableColumn = ["Description", "SqFt", "Price/Unit", "Total"];
    const tableRows = lines.map((line) => [
      line.description || "",
      line.squarefoot || "",
      line.pricePerUnit || "",
      Number(line.amount || 0).toFixed(2) || "",
    ]);

    tableRows.push([
      "",
      "Grand Total",
      "",
      `$${Number(calc.grandTotal || 0).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      styles: { halign: "center" },
      headStyles: { halign: "center", fillColor: [200, 200, 200] },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Add page break if near bottom
    if (currentY > 270 && index < laborCalcs.length - 1) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.setFontSize(14);
  doc.text(`Project Labor Total: $${laborTotal.toFixed(2)}`, 14, currentY + 10);

  doc.save(`${project.name}_Labor_List.pdf`);
};

/**
 * Export Labor List to Excel — each calculator gets its own sheet
 */
export const exportLaborToExcel = (project, calculators) => {
  const wb = XLSX.utils.book_new();

  // Only include ThreeFieldCalculators
  const laborCalcs = calculators.filter(
    (calc) => calc.type === "ThreeFieldCalculator"
  );

  const laborTotal = laborCalcs.reduce(
    (sum, calc) => sum + Number(calc.grandTotal || 0),
    0
  );

  if (laborCalcs.length === 0) {
    const ws = XLSX.utils.aoa_to_sheet([["No labor data found."]]);
    XLSX.utils.book_append_sheet(wb, ws, "Labor");
  } else {
    laborCalcs.forEach((calc, index) => {
      const calcName = calc.name?.trim() || `Calculator ${index + 1}`;

      const lines =
        (calc.section || []).flatMap((sec) => sec.lines || []) || [];

      const data =
        lines.length > 0
          ? [
              ["Description", "SqFt", "Price/Unit", "Total"],
              ...lines.map((line, i) => [
                line.description || "",
                line.squarefoot || "",
                line.pricePerUnit || "",
                Number(line.amount.toFixed(2)) || "",
              ]),
              [
                "",
                "Grand Total",
                "",
                `$${Number(calc.grandTotal || 0).toFixed(2)}`,
              ],
            ]
          : [["No line items found."]];

      const ws = XLSX.utils.aoa_to_sheet(data);

      // Limit sheet name to 31 chars (Excel restriction)
      const safeName = calcName.slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, safeName);
    });
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["Labor Grand Totals"],
      ...laborCalcs.map((calc) => [
        calc.name,
        `$${Number(calc.grandTotal || 0).toFixed(2)}`,
      ]),
      [],
      ["Project Labor Total", `$${laborTotal.toFixed(2)}`],
    ]);

    XLSX.utils.book_append_sheet(wb, summarySheet, "Labor Summary");
  }

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `${project.name}_Labor_List.xlsx`
  );
};

// ==========================
// TOTALS EXPORTS
// ==========================

/**
 * Export Totals to EXCEL
 */
export const exportToExcel = (project, calculators) => {
  const data = [
    ["Category", "Total"],
    ...calculators
      .filter((calc) => calc.type !== "MeasurementCalculator")
      .map((calc) => [calc.name, `$${getCalculatorTotal(calc).toFixed(2)}`]),
    ["Grand Total", `$${Number(project.total).toFixed(2)}`],
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Totals");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `${project.name}_totals.xlsx`
  );
};

/**
 * Export Totals to PDF
 */
export const exportToPDF = (project, calculators) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`${project.name} Totals`, 14, 20);

  const tableColumn = ["Category", "Total"];
  const tableRows = calculators
    .filter((calc) => calc.type !== "MeasurementCalculator")
    .map((calc) => [calc.name, `$${getCalculatorTotal(calc).toFixed(2)}`]);

  tableRows.push(["Grand Total", `$${Number(project.total).toFixed(2)}`]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { halign: "right" },
    headStyles: { halign: "center" },
  });

  doc.save(`${project.name}_totals.pdf`);
};
