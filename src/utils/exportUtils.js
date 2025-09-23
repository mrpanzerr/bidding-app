// exportUtils.js
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to get the correct total
const getCalculatorTotal = (calc) => {
  if (calc.type === "SevenFieldCalculator" && typeof calc.finalTotal === "number") {
    return calc.finalTotal;
  } else if (typeof calc.grandTotal === "number") {
    return calc.grandTotal;
  }
  return 0;
};

// Export DOCX
export const exportToDocx = (project, calculators) => {
  const rows = calculators
    .filter((calc) => calc.type !== "MeasurementCalculator")
    .map(
      (calc) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [new Paragraph(calc.name)],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [new Paragraph(`$${getCalculatorTotal(calc).toFixed(2)}`)],
            }),
          ],
        })
    );

  rows.push(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: "Grand Total", bold: true })],
        }),
        new TableCell({
          children: [new Paragraph({ text: `$${Number(project.total).toFixed(2)}`, bold: true })],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: `${project.name} Totals`, heading: "Heading1" }),
          new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${project.name}_totals.docx`);
  });
};

// Export PDF
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
