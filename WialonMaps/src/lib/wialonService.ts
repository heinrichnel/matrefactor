/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type {
  WialonResource,
  WialonReportTemplate,
  WialonUnit,
  WialonPosition,
  WialonUnitStatus,
} from "../types/wialon";
import type {
  WialonSessionInstance,
  WialonUnitSdkInstance,
  WialonResourceSdkInstance,
} from "../types/wialon-global";

class WialonService {
  private session: WialonSessionInstance | null = null;
  private isInitialized = false;

  constructor() {
    void this.loadSdk();
  }

  private loadSdk(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (typeof window !== "undefined" && window.wialon) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  private getSession(): WialonSessionInstance {
    if (!this.session) throw new Error("Wialon session is not initialized");
    return this.session;
  }

  async initialize(token?: string): Promise<void> {
    await this.loadSdk();
    return new Promise((resolve, reject) => {
      const s = new window.wialon.core.Session();
      s.initSession("https://hst-api.wialon.com");
      s.loginToken(token || "", "", (code: number) => {
        if (code) {
          reject(new Error(window.wialon.core.Errors.getErrorText(code)));
          return;
        }
        this.session = s;
        this.isInitialized = true;
        this.loadLibraries().then(resolve);
      });
    });
  }

  private loadLibraries(): Promise<void> {
    const s = this.getSession();
    return new Promise((resolve) => {
      s.loadLibrary(
        ["itemIcon", "resourceReports", "resourceDrivers", "unitSensors", "unitCommandDefinitions"],
        resolve
      );
    });
  }

  async getResources(): Promise<WialonResource[]> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");
    const s = this.getSession();

    return new Promise((resolve) => {
      s.updateDataFlags(
        [
          {
            type: "type",
            data: "avl_resource",
            flags:
              window.wialon.item.Item.dataFlag.base | window.wialon.item.Resource.dataFlag.reports,
            mode: 0,
          },
        ],
        () => {
          const raw = (s.getItems("avl_resource") || []) as WialonResourceSdkInstance[];
          resolve(this.mapResources(raw));
        }
      );
    });
  }

  async getUnits(): Promise<WialonUnit[]> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");
    const s = this.getSession();

    return new Promise((resolve) => {
      s.updateDataFlags(
        [
          {
            type: "type",
            data: "avl_unit",
            flags:
              window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastPosition,
            mode: 0,
          },
        ],
        () => {
          const raw = (s.getItems("avl_unit") || []) as WialonUnitSdkInstance[];
          resolve(this.mapUnits(raw));
        }
      );
    });
  }

  /* ------------------------- Mapping helpers ------------------------- */

  private mapResources(resources: WialonResourceSdkInstance[]): WialonResource[] {
    return resources.map((res) => {
      const reports = res.getReportTemplates?.() || [];
      const mapped: WialonReportTemplate[] = reports.map((r) => ({
        id: String(r.id),
        name: r.n,
      }));
      return { id: String(res.getId()), name: res.getName(), reports: mapped };
    });
  }

  private mapUnits(units: WialonUnitSdkInstance[]): WialonUnit[] {
    return units.map((unit) => {
      const p = unit.getPosition?.() || null;
      const driver = unit.getDriver?.() || null;

      const position: WialonPosition | undefined = p
        ? {
            latitude: p.y,
            longitude: p.x,
            speed: typeof p.s === "number" ? p.s : 0,
          }
        : undefined;

      const status: WialonUnitStatus = this.deriveStatus(position);

      return {
        id: unit.getId(),
        name: unit.getName(),
        position,
        status,
        driver: driver ? { id: driver.id, name: driver.n } : undefined,
        sensors:
          unit.getSensors?.().map((s) => ({
            id: s.id,
            name: s.n,
            type: s.t ?? "",
            measurement: s.m ?? "",
            parameter: s.p ?? "",
          })) || [],
      };
    });
  }

  private deriveStatus(position?: WialonPosition): WialonUnitStatus {
    if (!position) return "offline";
    if (position.speed > 2) return "moving";
    if (position.speed > 0) return "online";
    return "parked";
  }

  /* --------------------------- Commands API -------------------------- */

  async executeCommand(unitId: string, commandName: string, params: Record<string, string>) {
    if (!this.isInitialized) throw new Error("Wialon not initialized");
    const s = this.getSession();

    return new Promise((resolve, reject) => {
      const u = s.getItem(unitId) as WialonUnitSdkInstance | null;
      if (!u || typeof u.execCmd !== "function") {
        reject(new Error("Unit not found or commands not supported"));
        return;
      }
      u.execCmd(commandName, params, (code: number) => {
        if (code) {
          reject(new Error(window.wialon.core.Errors.getErrorText(code)));
          return;
        }
        resolve({ message: "Command executed successfully" });
      });
    });
  }
}

export const wialonService = new WialonService();
