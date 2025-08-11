// src/types/wialon.ts

/** ===================== Realtime Core ===================== */

export type WialonUnitStatus = "online" | "parked" | "offline" | "moving" | "unknown";

export interface WialonPosition {
  latitude: number;
  longitude: number;
  /** Speed in km/h (or source units if you map differently) */
  speed: number;
  /** Epoch ms of last update, if available */
  updatedAt?: number;
  /** Course/heading in degrees 0..359 */
  course?: number;
}

export interface WialonDriver {
  id: string;
  name: string;
  /** Optional fields used by UI/forms */
  code?: string;
  phone?: string;
}

export interface WialonSensor {
  id: string;
  name: string;
  type: string;
  /** Unit of measurement, e.g., "°C", "liters" */
  measurement: string;
  /** Parameter key as used by Wialon (e.g., "fuel_level") */
  parameter: string;
}

/** ===================== Commands ===================== */

export type CommandParamType = "text" | "number" | "select";

export interface CommandParamConfig {
  label?: string;
  type?: CommandParamType; // default "text"
  placeholder?: string;
  description?: string;
  required?: boolean;
  /** For "select" inputs */
  options?: { value: string; label: string }[];
}

export interface WialonCommand {
  /** Unique command identifier used when executing */
  id: string;
  /** Human-friendly name */
  name: string;
  /** Optional display label */
  label?: string;

  /**
   * Preferred schema: parameter definitions keyed by param name.
   */
  parameters?: Record<string, CommandParamConfig>;

  /**
   * Back-compat alias (some mappers may still produce this).
   * Must be identical in shape to `parameters`.
   */
  paramsSchema?: Record<string, CommandParamConfig>;
}

/** ===================== Units ===================== */

export interface WialonUnit {
  id: string;
  name: string;
  position?: WialonPosition;
  driver?: WialonDriver;
  sensors?: WialonSensor[];
  status?: WialonUnitStatus;
  /** Present only if you load command definitions */
  commands?: WialonCommand[];
}

/** ===================== Resources & Templates ===================== */

export interface WialonReportTemplate {
  id: string;
  name: string;
}

export interface WialonResource {
  id: string;
  name: string;
  reports: WialonReportTemplate[];
}

/** Useful for surfacing SDK/login errors uniformly */
export interface WialonError {
  code: number;
  message: string;
}

/** ===================== Reports (Normalized) ===================== */

export interface ReportTable {
  name: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface WialonReport {
  id: string;
  name: string;
  tables: ReportTable[];
}

/** ===================== Helpers ===================== */

/**
 * Type guard to narrow a unit that has a valid position.
 */
export const hasPosition = (unit: WialonUnit): unit is WialonUnit & { position: WialonPosition } =>
  !!unit.position;

// src/types/wialon.d.ts
// Minimal, correct ambient types for the browser Wialon SDK.
// Matches runtime shape: window.wialon.core.*, window.wialon.item.*
// Extend as you touch more of the SDK.

declare global {
  interface Window {
    wialon: {
      core: {
        Session: new () => WialonSessionInstance;
        Errors: { getErrorText(code: number): string };
      };
      item: {
        Item: { dataFlag: { base: number } };
        Unit: { dataFlag: { lastPosition: number } };
        Resource: { dataFlag: { reports: number } };
      };
    };
  }
}

// ---- Session API (subset you use) ----
export interface WialonSessionInstance {
  initSession(host: string): void;
  loginToken(token: string, unused: string, cb: (code: number) => void): void;
  loadLibrary(names: string[], cb: () => void): void;

  updateDataFlags(
    requests: Array<{
      type: "type";
      data: "avl_unit" | "avl_resource";
      flags: number;
      mode: 0 | 1 | 2;
    }>,
    cb: () => void
  ): void;

  getItems(type: "avl_unit" | "avl_resource"): unknown[] | null;
  getItem(id: string): unknown | null;
}

// ---- Unit instance (subset you read) ----
export interface WialonUnitSdkInstance {
  getId(): string;
  getName(): string;
  // Wialon pos uses x=lng, y=lat; optional speed s
  getPosition?(): { x: number; y: number; s?: number } | null;
  getDriver?(): { id: string; n: string } | null;
  getSensors?(): Array<{ id: string; n: string; t?: string; m?: string; p?: string }>;
  execCmd?(name: string, params: Record<string, string>, cb: (code: number) => void): void;
}

// ---- Resource instance (subset you read) ----
export interface WialonResourceSdkInstance {
  getId(): string | number;
  getName(): string;
  getReportTemplates?(): Array<{ id: number | string; n: string }>;
}

export {};
