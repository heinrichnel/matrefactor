import * as XLSX from "xlsx";

interface ReportTable {
  name: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface WialonReport {
  id: string;
  name: string;
  tables: ReportTable[];
}

export const exportToExcel = (report: WialonReport) => {
  const wb = XLSX.utils.book_new();

  report.tables.forEach((table) => {
    // Prepare data for the sheet
    const sheetData = [table.headers, ...table.rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Add the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, table.name.substring(0, 31)); // Excel sheet names max at 31 chars
  });

  // Generate file name with timestamp
  const fileName = `report_${report.name.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  // Export the workbook
  XLSX.writeFile(wb, fileName);
};

export const formatReportValue = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const parseReportData = (rawData: any): WialonReport => {
  // This function would parse raw Wialon API response into our standardized report format
  // Implementation depends on the actual Wialon API response structure
  return {
    id: rawData.id || "unknown",
    name: rawData.name || "Unnamed Report",
    tables:
      rawData.tables?.map((table: any) => ({
        name: table.name || "Table",
        headers: table.columns?.map((col: any) => col.name) || [],
        rows:
          table.rows?.map((row: any) => row.c.map((cell: any) => formatReportValue(cell.v))) || [],
      })) || [],
  };
};
