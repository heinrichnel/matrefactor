import { useEffect, useState } from "react";
import { useWialon } from "../../hooks/useWialon";
import type { WialonCommand, WialonUnit } from "../../types/wialon";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface CommandsTabProps {
  units: WialonUnit[];
}

export const CommandsTab = ({ units }: CommandsTabProps) => {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedCommand, setSelectedCommand] = useState<string>("");
  const [commands, setCommands] = useState<WialonCommand[]>([]);
  const [commandParams, setCommandParams] = useState<Record<string, string>>({});
  const [executionStatus, setExecutionStatus] = useState<{
    status: "idle" | "pending" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });
  const { executeCommand } = useWialon();

  // Load commands when unit is selected
  useEffect(() => {
    if (selectedUnit) {
      const unit = units.find((u) => u.id === selectedUnit);
      if (unit && unit.commands) {
        setCommands(unit.commands);
        // Initialize empty params for each command
        const params: Record<string, string> = {};
        unit.commands.forEach((cmd) => {
          if (cmd.parameters) {
            Object.keys(cmd.parameters).forEach((param) => {
              params[`${cmd.id}_${param}`] = "";
            });
          }
        });
        setCommandParams(params);
      }
    } else {
      setCommands([]);
      setSelectedCommand("");
    }
  }, [selectedUnit, units]);

  // Reset selected command when commands list changes
  useEffect(() => {
    setSelectedCommand("");
    setExecutionStatus({ status: "idle", message: "" });
  }, [commands]);

  const handleParamChange = (commandId: string, paramName: string, value: string) => {
    setCommandParams((prev) => ({
      ...prev,
      [`${commandId}_${paramName}`]: value,
    }));
  };

  const handleExecute = async () => {
    if (!selectedUnit || !selectedCommand) return;

    const command = commands.find((c) => c.id === selectedCommand);
    if (!command) return;

    setExecutionStatus({ status: "pending", message: "Sending command..." });

    try {
      // Prepare parameters
      const params: Record<string, string> = {};
      if (command.parameters) {
        Object.keys(command.parameters).forEach((param) => {
          const key = `${command.id}_${param}`;
          params[param] = commandParams[key] || "";
        });
      }

      // Execute command through Wialon service
      const result: unknown = await executeCommand(selectedUnit, selectedCommand, params);
      let message: string | undefined;
      if (result && typeof result === "object" && "message" in result) {
        // runtime guard ensures safe access
        // @ts-ignore
        message = (result as any).message as string | undefined;
      }
      setExecutionStatus({
        status: "success",
        message: `Command executed successfully: ${message || "No response"}`,
      });
    } catch (error) {
      setExecutionStatus({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to execute command",
      });
    }
  };

  const getCurrentCommand = () => {
    return commands.find((c) => c.id === selectedCommand);
  };

  const renderParameterInputs = () => {
    const command = getCurrentCommand();
    if (!command || !command.parameters) return null;

    return Object.entries(command.parameters).map(([paramName, paramConfig]) => {
      const paramKey = `${command.id}_${paramName}`;
      return (
        <div key={paramKey} className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paramConfig.label || paramName}
          </label>
          <input
            type={paramConfig.type === "number" ? "number" : "text"}
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
