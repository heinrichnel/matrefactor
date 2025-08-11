// Minimal ambient declarations for the browser Wialon SDK used by this app
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

export interface WialonUnitSdkInstance {
  getId(): string;
  getName(): string;
  getPosition?(): { x: number; y: number; s?: number } | null; // x=lng, y=lat, s=speed
  getDriver?(): { id: string; n: string } | null;
  getSensors?(): Array<{ id: string; n: string; t?: string; m?: string; p?: string }>;
  execCmd?(name: string, params: Record<string, string>, cb: (code: number) => void): void;
}

export interface WialonResourceSdkInstance {
  getId(): string | number;
  getName(): string;
  getReportTemplates?(): Array<{ id: number | string; n: string }>;
}

export {};
