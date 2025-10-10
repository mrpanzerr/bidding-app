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
 * Gathers all material line items from SevenFieldCalculators.
 */
const getMaterialLineItems = (calculators) => {
  return calculators
    .filter((calc) => calc.type === "SevenFieldCalculator")
    .flatMap((calc) =>
      (calc.section || []).flatMap((sec) =>
        (sec.lines || []).map((line) => ({
          productCode: line.productCode || "",
          description: line.description || "",
          quantity: line.quantity || "",
          length: line.descriptionThree || "",
        }))
      )
    );
};

/**
 * Export Material List to PDF
 */
export const exportMaterialListToPDF = (project, calculators) => {
  const doc = new jsPDF();
  const materials = getMaterialLineItems(calculators);

  doc.setFontSize(16);
  doc.text(`Material List - ${project.name}`, 14, 20);

  if (materials.length === 0) {
    doc.text("No material calculators or line items found.", 14, 35);
    doc.save(`${project.name}_materials.pdf`);
    return;
  }

  const tableColumn = ["#", "Quantity", "Product Code", "Name", "Length"];

  const tableRows = materials.map((prod, index) => [
    index + 1,
    prod.quantity || "",
    prod.productCode || "",
    prod.description || "",
    prod.length || "",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { halign: "center" },
    headStyles: { halign: "center", fillColor: [200, 200, 200] },
  });

  doc.save(`${project.name}_Material_List.pdf`);
};

/**
 * Export Material List to EXCEL
 */
export const exportMaterialListToExcel = (project, calculators) => {
  const materials = getMaterialLineItems(calculators);

  if (materials.length === 0) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["No material data found."]]);
    XLSX.utils.book_append_sheet(wb, ws, "Materials");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${project.name}_materials.xlsx`);
    return;
  }

  const data = [
    ["#", "Quantity", "Product Code", "Name", "Length"],
    ...materials.map((prod, index) => [
      index + 1,
      prod.quantity,
      prod.productCode,
      prod.description,
      prod.length,
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Materials");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${project.name}_Material_List.xlsx`);
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
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), `${project.name}_totals.xlsx`);
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
