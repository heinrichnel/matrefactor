// wialon.d.ts

/**
 * Core Wialon types
 */
declare namespace Wialon {
  interface Error {
    code: number;
    message: string;
  }

  interface Position {
    y: number; // latitude
    x: number; // longitude
    t: number; // timestamp
    s: number; // speed
    c: number; // course
    z: number; // altitude
  }

  interface Driver {
    id: string;
    n: string; // name
    c: string; // code
    p: string; // phone
  }

  interface Sensor {
    id: string;
    n: string; // name
    t: string; // type
    m: string; // metrics
    p: string; // parameter
  }

  interface Command {
    id: string;
    n: string; // name
    c: string; // code
  }

  interface ReportTemplate {
    id: string;
    nm: string; // name
  }

  interface ReportTable {
    header: string[];
    rows: Array<{ c: Array<{ t: string }> }>;
    label: string;
  }
}

/**
 * Application-specific types
 */
interface WialonUnit {
  id: string;
  name: string;
  status: "online" | "offline" | "parked";
  position?: {
    lat: number;
    lng: number;
    timestamp?: number;
    speed?: number;
    course?: number;
  };
  driver?: {
    id: string;
    name: string;
    code?: string;
    phone?: string;
  };
  sensors?: WialonSensor[];
  commands?: WialonCommand[];
}

interface WialonResource {
  id: string;
  name: string;
  reports: WialonReportTemplate[];
  drivers?: WialonDriver[];
}

interface WialonDriver {
  id: string;
  name: string;
  code?: string;
  phone?: string;
}

interface WialonSensor {
  id: string;
  name: string;
  type: string;
  metrics: string;
  parameter: string;
  value?: string | number;
  lastUpdated?: number;
}

interface WialonCommandParameterSchema {
  label?: string;
  type?: "string" | "number" | "text";
  placeholder?: string;
  description?: string;
}

interface WialonCommand {
  id: string;
  name: string;
  code: string;
  parameters?: Record<string, WialonCommandParameterSchema>;
}

interface WialonReportTemplate {
  id: string;
  name: string;
  description?: string;
}

interface WialonReport {
  id: string;
  name: string;
  tables: {
    name: string;
    headers: string[];
    rows: (string | number)[][];
  }[];
  generatedAt?: number;
}

interface WialonSession {
  id: string;
  user: {
    id: string;
    name: string;
    permissions: string[];
  };
  expiresAt: number;
}

interface WialonError extends Error {
  code: number;
}

/**
 * API Response types
 */
interface WialonApiResponse<T> {
  error?: number;
  data?: T;
}

interface WialonLoginResponse {
  eid: string;
  user: {
    id: number;
    nm: string;
    prp: Record<string, unknown>;
  };
}

interface WialonUnitsResponse {
  items: WialonUnit[];
  flags: number;
}

interface WialonReportResponse {
  tables: Wialon.ReportTable[];
}

/**
 * Component Props types
 */
interface WialonMapProps {
  units: WialonUnit[];
  center?: [number, number];
  zoom?: number;
  onUnitClick?: (unit: WialonUnit) => void;
  className?: string;
}

interface WialonUnitTableProps {
  units: WialonUnit[];
  onSelect?: (unit: WialonUnit) => void;
  className?: string;
}

/**
 * Utility types
 */
type WialonDataFlag = "base" | "lastPosition" | "sensors" | "commands" | "drivers" | "reports";

type WialonItemType = "avl_unit" | "avl_resource" | "avl_driver" | "avl_sensor" | "avl_command";

/**
 * Extend Window interface with Wialon SDK
 */
declare global {
  interface Window {
    wialon: {
      core: {
        Session: {
          new (): WialonSession;
          getInstance(): WialonSession;
        };
        Errors: {
          getErrorText(code: number): string;
        };
      };
      item: {
        Item: {
          dataFlag: Record<string, number>;
          new (): any;
        };
        Unit: {
          dataFlag: Record<string, number>;
        };
        Resource: {
          dataFlag: Record<string, number>;
        };
      };
    };
  }
}

export type {
  WialonApiResponse,
  WialonCommand,
  WialonDataFlag,
  WialonDriver,
  WialonError,
  WialonItemType,
  WialonLoginResponse,
  WialonMapProps,
  WialonReport,
  WialonReportResponse,
  WialonReportTemplate,
  WialonResource,
  WialonSensor,
  WialonSession,
  WialonUnit,
  WialonUnitsResponse,
  WialonUnitTableProps,
};

export {};
