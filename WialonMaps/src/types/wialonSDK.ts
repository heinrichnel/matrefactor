export interface WialonSessionInstance {
  initSession(url: string): void;
  loginToken(token: string, appName: string, callback: (code: number) => void): void;
  loadLibrary(libraries: string[], callback: () => void): void;
  updateDataFlags(
    flags: Array<{ type: string; data: string; flags: number; mode: number }>,
    callback: () => void
  ): void;
  getItems(type: string): WialonItemInstance[];
  getItem(id: string): WialonItemInstance | null;
}

export interface WialonItemInstance {
  getId(): string;
  getName(): string;
  getReportTemplates?(): Array<{ id: string; nm: string }>;
  getPosition?(): { x: number; y: number; speed: number };
  getDriver?(): { id: string; n: string };
  getSensors?(): Array<{ id: string; n: string; t: string; m: string; p: string }>;
  execCmd(
    commandName: string,
    params: Record<string, string>,
    callback: (code: number) => void
  ): void;
}
