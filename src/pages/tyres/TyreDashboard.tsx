import React from "react";

// The entire application will be contained within this single component.
// All imports from external files are mocked below to make the code self-contained.

// --- Mocking External Dependencies for a runnable example ---

interface ButtonProps {
  children: React.ReactNode;
  variant?: "outline" | "secondary" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactElement;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

// Mocking shadcn/ui components
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const baseClasses =
    "flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500";
  const sizeClasses =
    size === "sm" ? "px-2.5 py-1.5 h-8" : size === "md" ? "px-4 py-2 h-10" : "px-6 py-3 h-12";
  let variantClasses;
  switch (variant) {
    case "outline":
      variantClasses = "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
      break;
    case "secondary":
      variantClasses = "bg-gray-100 text-gray-800 hover:bg-gray-200";
      break;
    case "primary":
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
      break;
    case "ghost":
      variantClasses = "text-gray-800 hover:bg-gray-100";
      break;
    default:
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
      break;
  }
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className} ${disabledClasses}`;
  return (
    <button className={combinedClasses} onClick={onClick} disabled={disabled} type={type}>
      {icon &&
        React.cloneElement(icon, { className: "w-4 h-4 mr-2" } as React.HTMLAttributes<SVGElement>)}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}
const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
interface CardHeaderProps {
  title: string;
}
const CardHeader: React.FC<CardHeaderProps> = ({ title }) => (
  <div className="p-6 pb-2">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  </div>
);
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}
const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h3>
);
interface LinkProps {
  children: React.ReactNode;
  to: string;
  className?: string;
  title?: string;
}
const Link: React.FC<LinkProps> = ({ children, to, className, title }) => (
  <a href={to} className={className} title={title}>
    {children}
  </a>
);

interface SelectProps {
  label: React.ReactNode;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  options: { value: string; label: string }[];
}
const Select: React.FC<SelectProps> = ({ label, id, value, onChange, className, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}
const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

interface VehicleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  activeOnly?: boolean;
  showDetails?: boolean;
}
const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  activeOnly,
  showDetails,
}) => {
  const filteredVehicles = activeOnly
    ? mockFleetVehicles.filter((v) => v.fleetNo !== "V-003")
    : mockFleetVehicles;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">{placeholder}</option>
        {filteredVehicles.map((v) => (
          <option key={v.fleetNo} value={v.fleetNo}>
            {v.regNo} - {v.make} {v.model}
          </option>
        ))}
      </select>
      {showDetails && value && (
        <p className="mt-2 text-sm text-gray-500">
          Selected: {mockFleetVehicles.find((v) => v.fleetNo === value)?.make}{" "}
          {mockFleetVehicles.find((v) => v.fleetNo === value)?.model}
        </p>
      )}
    </div>
  );
};

// Mocking Firebase data structures
// Firebase functionality is mocked directly in the hooks

// --- Mock Data Structures and Hooks ---
export interface TyreDoc {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  size: string;
  status: string;
  location: string;
  vehicleId?: string;
  vehicleReg?: string;
  position?: string;
  purchaseDate: string;
  purchasePrice: number;
  treadDepth?: number;
  lastInspection?: string;
  notes?: string;
  [key: string]: any;
}
export interface TyreInventoryUIRecord {
  id: string;
  tyreNumber: string;
  manufacturer: string;
  condition: string;
  status: string;
  vehicleAssignment: string;
  km: number;
  kmLimit: number;
  treadDepth: number;
  mountStatus: string;
  kmRun?: number;
  kmRunLimit?: number;
  lastInspection?: string;
  datePurchased?: string;
  size?: string;
  pattern?: string;
  axlePosition?: string;
  purchasePrice: number;
}
export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  reorderLevel: number;
  cost: number;
  lastUpdated: string;
  location: string;
}
export interface TyreAssignment {
  tyreId: string;
  vehicleReg: string;
  position: string;
}

export const TyreStatus = {
  NEW: "new",
  IN_SERVICE: "in_use",
  SPARE: "spare",
  RETREADED: "retreaded",
  SCRAPPED: "disposed",
  DAMAGED: "damaged",
};

const TyreStoreLocation = {
  IN_VEHICLE: "In Vehicle",
  WAREHOUSE: "Warehouse",
  HOLDING_BAY: "Holding Bay",
  REPAIR_SHOP: "Repair Shop",
};

const mockTyreData: TyreDoc[] = [
  {
    id: "tyre1",
    serialNumber: "TY-001",
    brand: "Michelin",
    model: "Pilot Sport",
    size: "225/45R17",
    status: TyreStatus.IN_SERVICE,
    location: TyreStoreLocation.IN_VEHICLE,
    purchaseDate: "2023-01-15",
    purchasePrice: 150,
    treadDepth: 5,
    kmRun: 25000,
    kmRunLimit: 60000,
    vehicleReg: "V-001",
    position: "Front-Left",
    notes: "Regularly inspected.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tyre2",
    serialNumber: "TY-002",
    brand: "Continental",
    model: "ContiSport",
    size: "205/55R16",
    status: TyreStatus.NEW,
    location: TyreStoreLocation.WAREHOUSE,
    purchaseDate: "2024-05-20",
    purchasePrice: 120,
    treadDepth: 8,
    kmRun: 0,
    kmRunLimit: 50000,
    notes: "Ready for installation.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tyre3",
    serialNumber: "TY-003",
    brand: "Michelin",
    model: "Pilot Sport",
    size: "225/45R17",
    status: TyreStatus.SPARE,
    location: TyreStoreLocation.WAREHOUSE,
    purchaseDate: "2023-01-15",
    purchasePrice: 150,
    treadDepth: 7,
    kmRun: 0,
    kmRunLimit: 60000,
    notes: "Spare tire.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockStockData: StockItem[] = [
  {
    id: "stock1",
    name: "Oil Filter",
    quantity: 15,
    reorderLevel: 5,
    cost: 10,
    lastUpdated: new Date().toISOString(),
    location: "Warehouse A",
  },
  {
    id: "stock2",
    name: "Brake Pads",
    quantity: 8,
    reorderLevel: 10,
    cost: 50,
    lastUpdated: new Date().toISOString(),
    location: "Warehouse B",
  },
];

const mockTyrePositionsData = {
  horse: [
    { id: "H1", name: "Front Left Steer", fitmentType: "Steer" },
    { id: "H2", name: "Front Right Steer", fitmentType: "Steer" },
    { id: "H3", name: "Rear Left Drive", fitmentType: "Drive" },
    { id: "H4", name: "Rear Right Drive", fitmentType: "Drive" },
  ],
  interlink: [
    { id: "I1", name: "Rear Left Trailer", fitmentType: "Trailer" },
    { id: "I2", name: "Rear Right Trailer", fitmentType: "Trailer" },
  ],
};

const mockTyreAssignments: TyreAssignment[] = [
  { tyreId: "tyre1", vehicleReg: "V-001", position: "Front-Left" },
];

const mockTyreBrands = [
  { id: "brand1", name: "Michelin" },
  { id: "brand2", name: "Continental" },
  { id: "brand3", name: "Goodyear" },
];

const mockFleetVehicles = [
  { fleetNo: "V-001", type: "horse", regNo: "XYZ-123", make: "Volvo", model: "FH16" },
  { fleetNo: "V-002", type: "interlink", regNo: "ABC-456", make: "Scania", model: "R-series" },
  { fleetNo: "V-003", type: "lmv", regNo: "LMN-789", make: "Toyota", model: "Hilux" },
];

const useTyreReferenceData = () => ({ brands: mockTyreBrands });

// Hook Implementations
const useTyreInventory = () => {
  const [tyres, setTyres] = useState<TyreDoc[]>(mockTyreData);
  const [loading] = useState(false); // Removed setLoading as it's unused
  const [error] = useState<string | null>(null); // Removed setError as it's unused
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sizeFilter] = useState("all"); // Removed setSizeFilter as it's unused

  const addTyre = useCallback(async (data: TyreDoc) => {
    console.log("Adding tyre:", data);
    const newTyre = { ...data, id: `tyre-${Date.now()}` };
    setTyres((prev) => [...prev, newTyre]);
  }, []);
  const updateTyre = useCallback(async (id: string, data: Partial<TyreDoc>) => {
    console.log("Updating tyre:", id, data);
    setTyres((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const filtered = useMemo(() => {
    return tyres.filter((t) => {
      const matchesSearch =
        !searchTerm || t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesBrand = brandFilter === "all" || t.brand === brandFilter;
      const matchesSize = sizeFilter === "all" || t.size === sizeFilter;
      return matchesSearch && matchesStatus && matchesBrand && matchesSize;
    });
  }, [tyres, searchTerm, statusFilter, brandFilter, sizeFilter]);

  const uiRecords = useMemo(
    () =>
      filtered.map((t) => ({
        id: t.id,
        tyreNumber: t.serialNumber || t.id,
        manufacturer: t.brand,
        condition:
          t.status === "new"
            ? "New"
            : (t.treadDepth ?? 0) > 7
              ? "Good"
              : (t.treadDepth ?? 0) > 3
                ? "Fair"
                : "Poor",
        status: t.status === "in_use" ? "In-Service" : t.status === "new" ? "In-Stock" : "Other",
        vehicleAssignment: t.vehicleReg || "",
        km: t.kmRun || 0,
        kmLimit: t.kmRunLimit || 60000,
        treadDepth: t.treadDepth || 0,
        mountStatus: t.position ? "Mounted" : "Not Mounted",
        axlePosition: t.position,
        purchasePrice: t.purchasePrice,
        size: t.size,
        pattern: t.model, // Added missing properties
      })),
    [filtered]
  );

  return {
    tyres,
    loading,
    error,
    searchTerm,
    statusFilter,
    brandFilter,
    sizeFilter,
    setSearchTerm,
    setStatusFilter,
    setBrandFilter,
    uiRecords,
    addTyre,
    updateTyre,
    // deleteTyre, // (unused in this composite page component)
  };
};

const useStockInventory = () => {
  const [stock, setStock] = useState<StockItem[]>(mockStockData);
  const loading = false;
  const addStock = useCallback(async (item: StockItem) => {
    console.log("Adding stock:", item);
    const newItem = { ...item, id: `stock-${Date.now()}` };
    setStock((prev) => [...prev, newItem]);
  }, []);
  const updateStock = useCallback(async (id: string, changes: Partial<StockItem>) => {
    console.log("Updating stock:", id, changes);
    setStock((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }, []);
  const deleteStock = useCallback(async (id: string) => {
    console.log("Deleting stock:", id);
    setStock((prev) => prev.filter((s) => s.id !== id));
  }, []);
  return { stock, loading, addStock, updateStock, deleteStock };
};

// (Removed unused createTyrePositionsHook to reduce bundle size and clear lint warning)

const useVehicleTyreStore = () => {
  const [assignments, setAssignments] = useState<TyreAssignment[]>(mockTyreAssignments);
  const [loading] = useState(false); // Removed setLoading as it's unused
  const getAtPosition = useCallback(
    (reg: string, pos: string) =>
      assignments.find((a) => a.vehicleReg === reg && a.position === pos),
    [assignments]
  );
  const assignTyre = useCallback(async (assignment: TyreAssignment) => {
    console.log("Assigning tyre:", assignment);
    setAssignments((prev) => [
      ...prev.filter((a) => a.position !== assignment.position),
      assignment,
    ]);
  }, []);
  return { assignments, loading, getAtPosition, assignTyre };
};

// Mocking sub-components
interface TyreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TyreDoc) => void;
  initialData: TyreDoc;
  editMode: boolean;
}
const TyreFormModal: React.FC<TyreFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  editMode,
}) => {
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...initialData, brand: "Goodyear", serialNumber: `TY-${Date.now()}` });
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">{editMode ? "Edit Tyre" : "Add New Tyre"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600">
            This is a mock form. Data will be logged to console on submit.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
interface TyreInventoryStatsProps {
  inventory: TyreInventoryUIRecord[];
}
const TyreInventoryStats: React.FC<TyreInventoryStatsProps> = ({ inventory }) => (
  <Card>
    <CardContent>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
        <p className="text-gray-600">Total Items: {inventory.length}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">Total Value</p>
          <p className="text-xl font-bold text-gray-900">
            R{inventory.reduce((sum, item) => sum + item.purchasePrice, 0)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm">In-Service Tyres</p>
          <p className="text-xl font-bold text-gray-900">
            {inventory.filter((item) => item.status === "In-Service").length}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
interface TyreDashboardProps {
  tyres: TyreDoc[];
  stock: StockItem[];
  assignments: TyreAssignment[];
}
const TyreDashboard: React.FC<TyreDashboardProps> = ({ tyres, stock, assignments }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-4">Live Fleet Summary</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Tyres in use</p>
        <p className="text-2xl font-bold text-gray-900">
          {assignments.length} / {tyres.length}
        </p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Depot Stock Items</p>
        <p className="text-2xl font-bold text-gray-900">{stock.length}</p>
      </div>
    </div>
  </div>
);
export default TyreDashboard;
const TyreReports = () => (
  <div className="p-6">
    <p className="text-gray-500">Placeholder for Summary Reports.</p>
  </div>
);
const TyrePerformanceReport = () => (
  <div className="p-6">
    <p className="text-gray-500">Placeholder for Performance Reports.</p>
  </div>
);

const TyreReportGenerator = () => {
  const [reportOptions, setReportOptions] = useState({
    reportType: "inventory",
    dateRange: "last30",
    format: "pdf",
    includeScrapped: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: "inventory", label: "Inventory Report" },
    { value: "wear", label: "Wear Analysis Report" },
    { value: "cost", label: "Cost Analysis Report" },
    { value: "maintenance", label: "Maintenance History Report" },
    { value: "performance", label: "Performance Comparison Report" },
  ];

  const dateRanges = [
    { value: "last30", label: "Last 30 Days" },
    { value: "last90", label: "Last 90 Days" },
    { value: "last180", label: "Last 180 Days" },
    { value: "lastYear", label: "Last Year" },
    { value: "allTime", label: "All Time" },
  ];

  const reportFormats = [
    { value: "pdf", label: "PDF Document" },
    { value: "excel", label: "Excel Spreadsheet" },
    { value: "csv", label: "CSV File" },
  ];

  const handleOptionChange = (option: keyof typeof reportOptions, value: string | boolean) => {
    setReportOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation with timeout
    setTimeout(() => {
      setIsGenerating(false);
      console.log("Report generated:", reportOptions);
      // Removed alert, replaced with a temporary message.
      const messageElement = document.createElement("div");
      messageElement.textContent = `Generated ${reportOptions.reportType} report for ${reportOptions.dateRange} as ${reportOptions.format}`;
      messageElement.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border:1px solid gray;z-index:1000;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);";
      document.body.appendChild(messageElement);
      setTimeout(() => document.body.removeChild(messageElement), 3000);
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <CardTitle className="mb-4">Generate Tyre Reports</CardTitle>
        <div>
          <Select
            label={<span>Report Type</span>}
            id="reportType"
            value={reportOptions.reportType}
            onChange={(e) => handleOptionChange("reportType", e.target.value)}
            className="w-full"
            options={reportTypes}
          />
        </div>
        <div>
          <Select
            label={<span>Date Range</span>}
            id="dateRange"
            value={reportOptions.dateRange}
            onChange={(e) => handleOptionChange("dateRange", e.target.value)}
            className="w-full"
            options={dateRanges}
          />
        </div>
        <div>
          <Select
            label={<span>Format</span>}
            id="format"
            value={reportOptions.format}
            onChange={(e) => handleOptionChange("format", e.target.value)}
            className="w-full"
            options={reportFormats}
          />
        </div>
        <div className="flex items-center">
          <input
            id="includeScrapped"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            checked={reportOptions.includeScrapped}
            onChange={(e) => handleOptionChange("includeScrapped", e.target.checked)}
          />
          <label htmlFor="includeScrapped" className="ml-2 text-sm text-gray-700">
            Include scrapped tyres
          </label>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {}} // Empty function for mock preview
            icon={<FileText className="w-4 h-4" />}
            disabled={isGenerating}
            size="md"
          >
            Preview
          </Button>
          <Button
            onClick={handleGenerateReport}
            icon={<Download className="w-4 h-4" />}
            disabled={isGenerating}
            size="md"
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CombinedTyreReports = () => {
  const [reportsSubTab, setReportsSubTab] = useState("summary");
  return (
    <div className="space-y-6">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4 pb-2">
          <Button
            variant="secondary"
            size="sm"
            className={`${reportsSubTab === "summary" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"} rounded-none px-2 py-1 h-auto`}
            onClick={() => setReportsSubTab("summary")}
            icon={<FileText className="w-4 h-4 mr-2" />}
          >
            Summary Reports
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={`${reportsSubTab === "performance" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"} rounded-none px-2 py-1 h-auto`}
            onClick={() => setReportsSubTab("performance")}
            icon={<TrendingUp className="w-4 h-4 mr-2" />}
          >
            Performance Reports
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={`${reportsSubTab === "generator" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"} rounded-none px-2 py-1 h-auto`}
            onClick={() => setReportsSubTab("generator")}
            icon={<Download className="w-4 h-4 mr-2" />}
          >
            Report Generator
          </Button>
        </div>
      </div>
      {reportsSubTab === "summary" && <TyreReports />}
      {reportsSubTab === "performance" && <TyrePerformanceReport />}
      {reportsSubTab === "generator" && <TyreReportGenerator />}
    </div>
  );
};

interface StockInventoryDashboardProps {
  stock: StockItem[];
}
const StockInventoryDashboard: React.FC<StockInventoryDashboardProps> = ({ stock }) => {
  const { deleteStock } = useStockInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editItem, setEditItem] = useState<StockItem | null>(null);
  const handleAddSubmit = (data: StockItem) => {
    console.log("Submitting new stock:", data);
    setShowAddForm(false);
  };
  const handleEditSubmit = (data: StockItem) => {
    console.log("Submitting edit:", data);
    setEditItem(null);
  };

  interface StockItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StockItem) => void;
    initialData: StockItem | null;
    editMode: boolean;
  }
  const StockItemFormModal: React.FC<StockItemFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    editMode,
  }) => {
    if (!isOpen) return null;
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({ ...(initialData as StockItem), name: "New Item", quantity: 10 });
    };
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
          <h3 className="text-xl font-bold mb-4">
            {editMode ? "Edit Stock Item" : "Add New Stock Item"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-600">Mock form for stock item.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Depot Stock</h2>
        <Button icon={<Plus />} onClick={() => setShowAddForm(true)}>
          Add Stock Item
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reorderLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R{item.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditItem(item)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteStock(item.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {showAddForm && (
        <StockItemFormModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddSubmit}
          initialData={null}
          editMode={false}
        />
      )}
      {editItem && (
        <StockItemFormModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          onSubmit={handleEditSubmit}
          initialData={editItem}
          editMode={true}
        />
      )}
    </div>
  );
};

interface CombinedTyreAnalyticsProps {
  uiRecords: TyreInventoryUIRecord[];
}
const CombinedTyreAnalytics: React.FC<CombinedTyreAnalyticsProps> = ({ uiRecords }) => {
  const totalTyres = uiRecords.length;
  const inService = uiRecords.filter((t) => t.status === "In-Service").length;
  const totalValue = uiRecords.reduce((sum, item) => sum + item.purchasePrice, 0);
  const averageTreadDepth =
    totalTyres > 0
      ? (uiRecords.reduce((sum, item) => sum + item.treadDepth, 0) / totalTyres).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Tyre Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tyres</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{totalTyres}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Service</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{inService}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                R{totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Tread Depth</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{averageTreadDepth} mm</p>
            </div>
            <Gauge className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader title="Analytics and Trends" />
        <CardContent>
          <p className="text-gray-500">
            Placeholder for charts and detailed analytics. You could use a library like Chart.js or
            Recharts here to visualize data on wear rates, tyre lifespan, and costs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const getVehicleTyreConfiguration = (vehicleId: string) => {
  const vehicle = mockFleetVehicles.find((v) => v.fleetNo === vehicleId);
  if (!vehicle) return null;
  return {
    vehicleType: vehicle.type,
    positions: mockTyrePositionsData[vehicle.type as keyof typeof mockTyrePositionsData] || [],
  };
};

interface VehicleTyreViewProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}
const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({ selectedVehicle, onVehicleSelect }) => {
  const [selectedTyre, setSelectedTyre] = useState<TyreDoc | null>(null);
  const { tyres: allTyres } = useTyreInventory();
  const vehicleTyres = allTyres.filter((t) => t.vehicleReg === selectedVehicle);
  const tyreConfig = selectedVehicle ? getVehicleTyreConfiguration(selectedVehicle) : null;

  const getTyreDetailsFromTyre = (tyre: TyreDoc) => ({
    brand: tyre.brand,
    model: tyre.model,
    pattern: tyre.model, // Assuming model and pattern are the same for mock
    size: tyre.size,
    treadDepth: tyre.treadDepth,
    odometerAtFitment: tyre.kmRun, // Mocking odometer for now
    tyreCode: tyre.serialNumber,
  });

  const getTyreAtPosition = (position: string) => {
    const tyre = vehicleTyres.find((t) => t.position === position);
    return tyre ? getTyreDetailsFromTyre(tyre) : null;
  };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case "horse":
        return "Horse (Truck Tractor)";
      case "interlink":
        return "Interlink";
      case "reefer":
        return "Reefer";
      case "lmv":
        return "LMV";
      case "special":
        return "Special Configuration";
      default:
        return "Unknown Type";
    }
  };

  const getTyreConditionColor = (treadDepth: number) => {
    if (treadDepth > 7) return "bg-green-100 text-green-800";
    if (treadDepth > 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <VehicleSelector
            value={selectedVehicle}
            onChange={onVehicleSelect}
            label="Select Vehicle for Tyre View"
            placeholder="Choose a vehicle to view tyre details..."
            activeOnly={false}
            showDetails={true}
          />
        </div>
      </div>

      {selectedVehicle && tyreConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Tyre Layout"></CardHeader>
            <CardContent>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Position</th>
                    <th className="px-2 py-1">Tyre Code</th>
                    <th className="px-2 py-1">Brand</th>
                    <th className="px-2 py-1">Pattern</th>
                    <th className="px-2 py-1">Size</th>
                    <th className="px-2 py-1">Tread (mm)</th>
                    <th className="px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tyreConfig.positions.map((pos) => {
                    const tyreAtPos = getTyreAtPosition(pos.name);
                    const fullTyreData = allTyres.find(
                      (t) => t.position === pos.name && t.vehicleReg === selectedVehicle
                    );
                    return (
                      <tr
                        key={pos.name}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedTyre(fullTyreData || null)}
                      >
                        <td className="px-2 py-1 font-semibold">{pos.name}</td>
                        <td className="px-2 py-1">{tyreAtPos?.tyreCode || "Empty"}</td>
                        <td className="px-2 py-1">{tyreAtPos?.brand || "-"}</td>
                        <td className="px-2 py-1">{tyreAtPos?.pattern || "-"}</td>
                        <td className="px-2 py-1">{tyreAtPos?.size || "-"}</td>
                        <td className="px-2 py-1">{tyreAtPos?.treadDepth ?? "-"}</td>
                        <td className="px-2 py-1">
                          {tyreAtPos && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-2 py-1"
                              onClick={() => setSelectedTyre(fullTyreData || null)}
                            >
                              <Wrench className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={selectedTyre ? `Tyre Details - ${selectedTyre.position}` : "Tyre Information"}
            />
            <CardContent>
              {selectedTyre ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {selectedTyre.brand} {selectedTyre.model}
                      </h3>
                      <p className="text-gray-600">{selectedTyre.model} Pattern</p>
                    </div>
                    <Badge className={getTyreConditionColor(selectedTyre.treadDepth ?? 0)}>
                      {selectedTyre.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <div className="space-y-1">
                        <p>
                          <span className="text-gray-500">Size:</span> {selectedTyre.size}
                        </p>
                        <p>
                          <span className="text-gray-500">DOT Code:</span>{" "}
                          {selectedTyre.dotCode || "—"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Condition</h4>
                      <div className="space-y-1">
                        <p>
                          <span className="text-gray-500">Tread Depth:</span>{" "}
                          {selectedTyre.treadDepth ?? "-"}mm
                        </p>
                        <p>
                          <span className="text-gray-500">Last Inspection:</span>{" "}
                          {selectedTyre.lastInspection || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Installation Details</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-gray-500">Installed:</span>{" "}
                        {selectedTyre.purchaseDate}
                      </p>
                      <p>
                        <span className="text-gray-500">Distance Run:</span>{" "}
                        {selectedTyre.kmRun?.toLocaleString()} km
                      </p>
                      <p>
                        <span className="text-gray-500">Serial Number:</span>{" "}
                        {selectedTyre.serialNumber}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Purchase Information</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-gray-500">Cost:</span> R
                        {selectedTyre.purchasePrice.toLocaleString()}
                      </p>
                      <p>
                        <span className="text-gray-500">Purchase Date:</span>{" "}
                        {selectedTyre.purchaseDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Eye className="w-4 h-4 mr-1" />}
                      onClick={() => {}}
                    >
                      Inspect
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Wrench className="w-4 h-4 mr-1" />}
                      onClick={() => {}}
                    >
                      Service
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CircleDot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Click on a tyre position above to view details</p>
                  {tyreConfig && (
                    <div className="mt-4 text-sm">
                      <p>
                        <strong>{getVehicleTypeLabel(tyreConfig.vehicleType)}</strong>
                      </p>
                      <p>{tyreConfig.positions.length} tyre positions</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// End of previously duplicated TyreDashboard page component (removed to avoid redeclaration)
