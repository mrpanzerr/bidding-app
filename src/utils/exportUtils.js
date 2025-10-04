// exportUtils.js
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const tableColumn = ["#", "Product Code", "Description", "Quantity"];

  const tableRows = materials.map((prod, index) => [
    index + 1, // auto-number
    prod.productCode || "", // Product Code
    prod.description || "", // Description
    prod.quantity || "", // Quantity
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
 * Export Material List to DOCX
 */
export const exportMaterialListToDocx = async (project, calculators) => {
  const materials = getMaterialLineItems(calculators);

  const header = new Paragraph({
    text: `Material List - ${project.name}`,
    heading: "Heading1",
    spacing: { after: 200 },
  });

  if (materials.length === 0) {
    const doc = new Document({
      sections: [
        { children: [header, new Paragraph("No material data found.")] },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${project.name}_materials.docx`);
    return;
  }

  // Table rows
  const rows = [
    // Header row
    new TableRow({
      children: ["#", "Product Code", "Description", "Quantity"].map(
        (text) =>
          new TableCell({
            children: [new Paragraph({ text, bold: true })],
            width: { size: 25, type: WidthType.PERCENTAGE },
          })
      ),
    }),
    // Product rows
    ...materials.map(
      (prod, index) =>
        new TableRow({
          children: [
            index + 1,
            prod.productCode || "",
            prod.description || "",
            prod.quantity || "",
          ].map(
            (text) =>
              new TableCell({
                children: [new Paragraph(String(text))],
                width: { size: 25, type: WidthType.PERCENTAGE },
              })
          ),
        })
    ),
  ];

  const table = new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  const doc = new Document({
    sections: [{ children: [header, table] }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${project.name}_Material_List.docx`);
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
              children: [
                new Paragraph(`$${getCalculatorTotal(calc).toFixed(2)}`),
              ],
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
          children: [
            new Paragraph({
              text: `$${Number(project.total).toFixed(2)}`,
              bold: true,
            }),
          ],
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `${project.name} Totals`,
            heading: "Heading1",
          }),
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
