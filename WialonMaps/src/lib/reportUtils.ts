// /workspaces/matrefactor/WialonMaps/src/lib/reportUtils.ts
import * as XLSX from "xlsx";

/** UI-ready normalized table */
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

/** Minimal raw Wialon shapes (adjust if your payload includes more) */
interface RawWialonReport {
  id?: string;
  name?: string;
  tables?: RawWialonTable[];
}
interface RawWialonTable {
  name?: string;
  columns?: RawWialonColumn[];
  rows?: RawWialonRow[];
}
interface RawWialonColumn {
  name?: string;
}
interface RawWialonRow {
  c: RawWialonCell[]; // Wialon often uses { c: [{ v: ... }, ...] }
}
interface RawWialonCell {
  v: unknown;
}

/* ---------------------------- Export to Excel ---------------------------- */

export const exportToExcel = (report: WialonReport) => {
  const wb = XLSX.utils.book_new();

  report.tables.forEach((table) => {
    const sheetData = [table.headers, ...table.rows];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, table.name.substring(0, 31)); // Excel caps names at 31 chars
  });

  const fileName = `report_${report.name.toLowerCase().replace(/\s+/g, "_")}_${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  XLSX.writeFile(wb, fileName);
};

/* ----------------------------- Formatting ----------------------------- */

export const formatReportValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  // Last resort: stable JSON (avoid circular refs here; payloads should be plain)
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

/* ----------------------------- Type Guards ----------------------------- */

const isObject = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null;

const isArray = <T = unknown>(x: unknown): x is T[] => Array.isArray(x);

/* ----------------------------- Parser ----------------------------- */

/**
 * Convert raw Wialon response into normalized WialonReport.
 * Defensively typed: accepts `unknown`, validates shapes, and defaults gracefully.
 */
export const parseReportData = (rawData: unknown): WialonReport => {
  const raw: RawWialonReport = isObject(rawData) ? (rawData as RawWialonReport) : {};

  const tables: ReportTable[] = isArray<RawWialonTable>(raw.tables)
    ? raw.tables.map<ReportTable>((table) => {
        const name = typeof table?.name === "string" && table.name.trim() ? table.name : "Table";

        const headers = isArray<RawWialonColumn>(table?.columns)
          ? table!.columns!.map((col) => (typeof col?.name === "string" ? col.name : ""))
          : [];

        const rows: (string | number)[][] = isArray<RawWialonRow>(table?.rows)
          ? table!.rows!.map<(string | number)[]>((row) => {
              if (!isObject(row) || !isArray<RawWialonCell>(row.c)) return [];
              return row.c.map((cell) => {
                const text = formatReportValue(isObject(cell) ? cell.v : undefined);
                // try to coerce numeric-looking strings back to numbers when safe
                const n = Number(text);
                return text !== "" && !Number.isNaN(n) && /^\s*-?\d+(\.\d+)?\s*$/.test(text) ? n : text;
              });
            })
          : [];

        return { name, headers, rows };
      })
    : [];

  const id = typeof raw.id === "string" && raw.id.trim() ? raw.id : "unknown";
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name : "Unnamed Report";

  return { id, name, tables };
};
