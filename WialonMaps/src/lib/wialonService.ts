import type { WialonResource, WialonUnit } from "../types/wialon";

class WialonService {
  private session: any;
  private isInitialized = false;

  constructor() {
    this.loadSdk();
  }

  private loadSdk() {
    return new Promise<void>((resolve) => {
      if (window.wialon) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async initialize(token?: string): Promise<void> {
    await this.loadSdk();

    return new Promise((resolve, reject) => {
      this.session = new window.wialon.core.Session();
      this.session.initSession("https://hst-api.wialon.com");

      this.session.loginToken(token || "", "", (code: number) => {
        if (code) {
          reject(new Error(window.wialon.core.Errors.getErrorText(code)));
          return;
        }

        this.isInitialized = true;
        this.loadLibraries();
        resolve();
      });
    });
  }

  private loadLibraries(): Promise<void> {
    return new Promise((resolve) => {
      this.session.loadLibrary(
        ["itemIcon", "resourceReports", "resourceDrivers", "unitSensors", "unitCommandDefinitions"],
        resolve
      );
    });
  }

  async getResources(): Promise<WialonResource[]> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");

    return new Promise((resolve) => {
      this.session.updateDataFlags(
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
          const resources = this.session.getItems("avl_resource") || [];
          resolve(this.mapResources(resources));
        }
      );
    });
  }

  async getUnits(): Promise<WialonUnit[]> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");

    return new Promise((resolve) => {
      this.session.updateDataFlags(
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
          const units = this.session.getItems("avl_unit") || [];
          resolve(this.mapUnits(units));
        }
      );
    });
  }

  private mapResources(resources: any[]): WialonResource[] {
    return resources.map((res) => ({
      id: res.getId(),
      name: res.getName(),
      reports: res.getReportTemplates?.() || [],
    }));
  }

  private mapUnits(units: any[]): WialonUnit[] {
    return units.map((unit) => {
      const pos = unit.getPosition?.();
      const driver = unit.getDriver?.();

      return {
        id: unit.getId(),
        name: unit.getName(),
        status: this.getUnitStatus(unit),
        position: pos ? { lat: pos.y, lng: pos.x } : undefined,
        driver: driver ? { id: driver.id, name: driver.n } : undefined,
        sensors: unit.getSensors?.() || [],
      };
    });
  }

  private getUnitStatus(unit: any): "online" | "offline" | "parked" {
    const pos = unit.getPosition?.();
    if (!pos) return "offline";
    return pos.speed > 1 ? "online" : "parked";
  }

  async executeCommand(unitId: string, commandName: string, params: Record<string, string>) {
    if (!this.isInitialized) throw new Error("Wialon not initialized");

    return new Promise((resolve, reject) => {
      const unit = this.session.getItem(unitId);
      if (!unit) {
        reject(new Error("Unit not found"));
        return;
      }

      unit.execCmd(commandName, params, (code: number) => {
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
