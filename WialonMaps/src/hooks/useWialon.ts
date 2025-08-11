import { useState } from "react";
import { wialonService } from "../lib/wialonService";
import type { WialonError, WialonResource, WialonUnit } from "../types/wialon";

export const useWialon = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WialonError | null>(null);
  const [resources, setResources] = useState<WialonResource[]>([]);
  const [units, setUnits] = useState<WialonUnit[]>([]);

  const initialize = async (token?: string) => {
    try {
      setLoading(true);
      await wialonService.initialize(token);

      const [res, units] = await Promise.all([
        wialonService.getResources(),
        wialonService.getUnits(),
      ]);

      setResources(res);
      setUnits(units);
    } catch (err) {
      setError(err as WialonError);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    resources,
    units,
    initialize,
    refreshUnits: async () => {
      const updatedUnits = await wialonService.getUnits();
      setUnits(updatedUnits);
    },
    executeCommand: wialonService.executeCommand,
  };
};
