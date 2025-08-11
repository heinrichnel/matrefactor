import { useEffect, useState } from "react";
import { useWialon } from "../../hooks/useWialon";
import type { WialonCommand, WialonUnit, CommandParamConfig } from "../../types/wialon";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface CommandsTabProps {
  units: WialonUnit[];
}

type ExecStatus = { status: "idle" | "pending" | "success" | "error"; message: string };

/** Normalize schema regardless of whether the source used `parameters` or `paramsSchema`. */
function getParamSchema(cmd: WialonCommand): Record<string, CommandParamConfig> {
  return cmd.parameters ?? cmd.paramsSchema ?? {};
}

export const CommandsTab = ({ units }: CommandsTabProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedCommand, setSelectedCommand] = useState<string>("");
  const [commands, setCommands] = useState<WialonCommand[]>([]);
  const [commandParams, setCommandParams] = useState<Record<string, string>>({});
  const [executionStatus, setExecutionStatus] = useState<ExecStatus>({
    status: "idle",
    message: "",
  });
  const { executeCommand } = useWialon();

  // Load commands when unit is selected
  useEffect(() => {
    if (!selectedUnit) {
      setCommands([]);
      setSelectedCommand("");
      setCommandParams({});
      return;
    }

    const unit = units.find((u) => u.id === selectedUnit);
    if (!unit || !unit.commands) {
      setCommands([]);
      setSelectedCommand("");
      setCommandParams({});
      return;
    }

    setCommands(unit.commands);

    // Initialize empty params for each command/param
    const params: Record<string, string> = {};
    unit.commands.forEach((cmd) => {
      const schema = getParamSchema(cmd);
      Object.keys(schema).forEach((paramName) => {
        params[`${cmd.id}_${paramName}`] = "";
      });
    });
    setCommandParams(params);
  }, [selectedUnit, units]);

  // Reset selected command when commands list changes
  useEffect(() => {
    setSelectedCommand("");
    setExecutionStatus({ status: "idle", message: "" });
  }, [commands]);

  const handleParamChange = (commandId: string, paramName: string, value: string) => {
    setCommandParams((prev) => ({ ...prev, [`${commandId}_${paramName}`]: value }));
  };

  const getCurrentCommand = () => commands.find((c) => c.id === selectedCommand);

  const handleExecute = async () => {
    if (!selectedUnit || !selectedCommand) return;

    const command = getCurrentCommand();
    if (!command) return;

    setExecutionStatus({ status: "pending", message: "Sending command..." });

    try {
      const schema = getParamSchema(command);
      const params: Record<string, string> = {};
      Object.keys(schema).forEach((paramName) => {
        const key = `${command.id}_${paramName}`;
        params[paramName] = commandParams[key] || "";
      });

      const result: unknown = await executeCommand(selectedUnit, selectedCommand, params);

      let msg: string | undefined;
      if (result && typeof result === "object" && "message" in result) {
        msg = (result as { message: string }).message;
      }

      setExecutionStatus({
        status: "success",
        message: `Command executed successfully${msg ? `: ${msg}` : ""}`,
      });
    } catch (error) {
      setExecutionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to execute command",
      });
    }
  };

  const renderParameterInputs = () => {
    const command = getCurrentCommand();
    if (!command) return null;

    const schema = getParamSchema(command);
    if (!schema || Object.keys(schema).length === 0) return null;

    return Object.entries(schema).map(([paramName, paramConfig]) => {
      const paramKey = `${command.id}_${paramName}`;
      const type = paramConfig.type ?? "text";

      if (type === "select" && Array.isArray(paramConfig.options)) {
        return (
          <div key={paramKey} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {paramConfig.label || paramName}
            </label>
            <select
              value={commandParams[paramKey] || ""}
              onChange={(e) => handleParamChange(command.id, paramName, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select…</option>
              {paramConfig.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {paramConfig.description && (
              <p className="mt-1 text-xs text-gray-500">{paramConfig.description}</p>
            )}
          </div>
        );
      }

      return (
        <div key={paramKey} className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paramConfig.label || paramName}
          </label>
          <input
            type={type === "number" ? "number" : "text"}
            value={commandParams[paramKey] || ""}
            onChange={(e) => handleParamChange(command.id, paramName, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={paramConfig.placeholder || ""}
          />
          {paramConfig.description && (
            <p className="mt-1 text-xs text-gray-500">{paramConfig.description}</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="commands-tab space-y-4">
      <h3 className="text-lg font-semibold">Command Management</h3>

      <div className="grid grid-cols-1 gap-4">
        <Select
          label="Unit"
          value={selectedUnit}
          onChange={setSelectedUnit}
          options={units.map((u) => ({ value: u.id, label: u.name }))}
        />

        <Select
          label="Command"
          value={selectedCommand}
          onChange={setSelectedCommand}
          options={commands.map((c) => ({ value: c.id, label: c.name }))}
          disabled={!selectedUnit}
        />

        {selectedCommand && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">
              {getCurrentCommand()?.name || "Command"} Parameters
            </h4>
            {renderParameterInputs()}

            <div className="mt-4">
              <Button
                onClick={handleExecute}
                disabled={executionStatus.status === "pending"}
                className="w-full"
              >
                {executionStatus.status === "pending" ? "Executing..." : "Execute Command"}
              </Button>
            </div>
          </div>
        )}

        {executionStatus.status !== "idle" && (
          <div
            className={`p-3 rounded-md ${
              executionStatus.status === "success"
                ? "bg-green-50 text-green-700"
                : executionStatus.status === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            {executionStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandsTab;
