import type { WialonUnit } from "../types/wialon";
import type { WialonSessionInstance, WialonUnitSdkInstance } from "../types/wialon-global";

/**
 * IMPORTANT:
 * - Do NOT redeclare `window.wialon` here. It's declared in src/types/wialon-global.d.ts
 * - This service uses those ambient types exclusively.
 */

class WialonService {
  private session: WialonSessionInstance | null = null;
  private isInitialized = false;

  /** Load SDK script if not already present */
  private loadSdk(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Use window.wialon directly which is typed in wialon-global.d.ts
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

    return new Promise<void>((resolve, reject) => {
      try {
        const s = new window.wialon.core.Session();
        s.initSession("https://hst-api.wialon.com");

        // Optional token login
        if (!token) {
          this.session = s;
          this.isInitialized = true;
          resolve();
          return;
        }

        s.loginToken(token, "", (errorCode: number) => {
          if (errorCode) {
            reject(new Error(window.wialon.core.Errors.getErrorText(errorCode)));
            return;
          }
          this.session = s;
          this.isInitialized = true;
          resolve();
        });
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Failed to initialize Wialon"));
      }
    });
  }

  async getUnits(): Promise<WialonUnit[]> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");
    const s = this.getSession();

    return new Promise<WialonUnit[]>((resolve) => {
      // Request base + lastPosition flags for units
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

  private mapUnits(items: WialonUnitSdkInstance[]): WialonUnit[] {
    return items.map((item) => {
      const pos = item.getPosition?.() || null;
      const driver = item.getDriver?.() || null;

      return {
        id: item.getId(),
        name: item.getName(),
        position: pos
          ? {
              latitude: pos.y,
              longitude: pos.x,
              // Wialon position often exposes speed as `s`; default to 0 if missing
              speed: typeof pos.s === "number" ? pos.s : 0,
            }
          : undefined,
        driver: driver ? { id: driver.id, name: driver.n } : undefined,
        sensors:
          item.getSensors?.().map((sensor) => ({
            id: sensor.id,
            name: sensor.n,
            type: sensor.t ?? "",
            measurement: sensor.m ?? "",
            parameter: sensor.p ?? "",
          })) ?? [],
      };
    });
  }

  async executeCommand(
    unitId: string,
    commandId: string,
    params: Record<string, string>
  ): Promise<{ message: string }> {
    if (!this.isInitialized) throw new Error("Wialon not initialized");
    const s = this.getSession();

    const u = s.getItem(unitId) as WialonUnitSdkInstance | null;

    if (!u || typeof u.execCmd !== "function") {
      throw new Error(`Unit with ID ${unitId} not found or commands not supported`);
    }

    return new Promise<{ message: string }>((resolve, reject) => {
      try {
        u.execCmd!(commandId, params, (code: number) => {
          if (code) {
            reject(new Error(window.wialon!.core!.Errors.getErrorText(code)));
            return;
          }
          const paramSummary = Object.keys(params || {}).length
            ? ` with params ${JSON.stringify(params)}`
            : "";
          resolve({
            message: `Command ${commandId} successfully sent to ${u.getName?.() ?? unitId}${paramSummary}`,
          });
        });
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Failed to execute command"));
      }
    });
  }
}

export const wialonService = new WialonService();
