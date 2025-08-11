import type { WialonUnit } from "../types/wialon";

class WialonService {
  private session: any | null = null;

  initialize(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!window.wialon?.core?.Session) {
          reject(new Error("Wialon SDK not loaded"));
          return;
        }
        this.session = new window.wialon.core.Session();
        this.session.initSession("https://hst-api.wialon.com");
        if (!token) {
          resolve();
          return;
        }
        this.session.loginToken(token, "", (errorCode: number) => {
          if (errorCode) {
            reject(new Error(window.wialon.core.Errors.getErrorText(errorCode)));
          } else {
            resolve();
          }
        });
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Failed to initialize Wialon"));
      }
    });
  }

  async getUnits(): Promise<WialonUnit[]> {
    if (!this.session) return [];
    try {
      const items = this.session.getItems?.("avl_unit") || [];
      return items as WialonUnit[];
    } catch {
      return [];
    }
  }

  async executeCommand(
    unitId: string,
    commandId: string,
    params: Record<string, string>
  ): Promise<{ message: string }> {
    // TODO: Replace with real SDK command invocation when available
    const paramSummary = Object.keys(params || {}).length
      ? ` with params ${JSON.stringify(params)}`
      : "";
    return Promise.resolve({
      message: `Simulated command ${commandId} sent to unit ${unitId}${paramSummary}`,
    });
  }
}

export const wialonService = new WialonService();
