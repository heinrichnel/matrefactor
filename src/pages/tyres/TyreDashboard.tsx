import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileDown,
  Filter,
  Package,
  RotateCcw,
  Ruler,
  Timer,
  TrendingDown,
  Upload,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import { useAppContext } from "../../context/AppContext";
import { Tyre } from "../../types/workshop-tyre-inventory";
import syncService from "../../utils/syncService";

// Import tyre reference data and inventory types
import {
  TYRE_REFERENCES,
  tyreBrands,
  TyreInventoryItem,
  TyreReference,
  tyreSizes,
  TyreStoreLocation,
  VENDORS,
} from "../../utils/tyreConstants";

// Mock data for fallback if Firebase has no data
// This will be replaced with actual Firebase data
const MOCK_TYRES = [
  {
    id: "tyre1",
    brand: "Michelin",
    model: "XZA2 Energy",
    size: "315/80R22.5",
    tyreSize: {
      width: 315,
      aspectRatio: 80,
      rimDiameter: 22.5,
    },
    serialNumber: "MX123456789",
    dotCode: "DOT1234ABC1022",
    manufactureDate: new Date("2022-10-01").toISOString(),
    installDetails: {
      date: new Date("2023-01-15").toISOString(),
      position: "front-left",
      vehicle: "21H",
      mileage: 120500,
    },
    treadDepth: 8.5, // mm
    pressure: 35, // PSI
    lastInspection: new Date("2023-05-10").toISOString(),
    status: "good",
    cost: 1500,
    estimatedLifespan: 120000,
    inspectionHistory: [
      {
        id: "insp1",
        date: "2023-03-10",
        inspector: "John Doe",
        treadDepth: 9.2,
        pressure: 34,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2023-03-10").toISOString(),
      },
      {
        id: "insp2",
        date: "2023-05-10",
        inspector: "Jane Smith",
        treadDepth: 8.5,
        pressure: 35,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2023-05-10").toISOString(),
      },
    ],
    currentMileage: 150000,
    costPerKm: 0.0125, // $1500 / 120000km
  },
  {
    id: "tyre2",
    brand: "Bridgestone",
    model: "R-Drive 001",
    size: "315/80R22.5",
    tyreSize: {
      width: 315,
      aspectRatio: 80,
      rimDiameter: 22.5,
    },
    serialNumber: "BS987654321",
    dotCode: "DOT9876XYZ0522",
    manufactureDate: new Date("2022-05-15").toISOString(),
    installDetails: {
      date: new Date("2022-08-20").toISOString(),
      position: "front-right",
      vehicle: "21H",
      mileage: 105200,
    },
    treadDepth: 5.2, // mm
    pressure: 34, // PSI
    lastInspection: new Date("2023-05-10").toISOString(),
    status: "worn",
    cost: 1400,
    estimatedLifespan: 100000,
    inspectionHistory: [
      {
        id: "insp3",
        date: "2022-10-20",
        inspector: "John Doe",
        treadDepth: 7.8,
        pressure: 36,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2022-10-20").toISOString(),
      },
      {
        id: "insp4",
        date: "2023-01-15",
        inspector: "Mike Johnson",
        treadDepth: 6.5,
        pressure: 35,
        sidewallCondition: "minor_damage",
        status: "worn",
        timestamp: new Date("2023-01-15").toISOString(),
      },
      {
        id: "insp5",
        date: "2023-05-10",
        inspector: "Jane Smith",
        treadDepth: 5.2,
        pressure: 34,
        sidewallCondition: "minor_damage",
        status: "worn",
        timestamp: new Date("2023-05-10").toISOString(),
      },
    ],
    currentMileage: 145000,
    costPerKm: 0.014, // $1400 / 100000km
  },
  {
    id: "tyre3",
    brand: "Continental",
    model: "HDR2+",
    size: "315/80R22.5",
    tyreSize: {
      width: 315,
      aspectRatio: 80,
      rimDiameter: 22.5,
    },
    serialNumber: "CT543216789",
    dotCode: "DOT5432ZYX0422",
    manufactureDate: new Date("2022-04-10").toISOString(),
    installDetails: {
      date: new Date("2022-07-05").toISOString(),
      position: "drive-left-1",
      vehicle: "21H",
      mileage: 98700,
    },
    treadDepth: 2.8, // mm
    pressure: 32, // PSI
    lastInspection: new Date("2023-05-10").toISOString(),
    status: "urgent",
    cost: 1600,
    estimatedLifespan: 110000,
    inspectionHistory: [
      {
        id: "insp6",
        date: "2022-09-10",
        inspector: "John Doe",
        treadDepth: 6.5,
        pressure: 36,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2022-09-10").toISOString(),
      },
      {
        id: "insp7",
        date: "2022-12-15",
        inspector: "Mike Johnson",
        treadDepth: 4.2,
        pressure: 34,
        sidewallCondition: "minor_damage",
        status: "worn",
        timestamp: new Date("2022-12-15").toISOString(),
      },
      {
        id: "insp8",
        date: "2023-03-01",
        inspector: "Jane Smith",
        treadDepth: 3.5,
        pressure: 33,
        sidewallCondition: "bulge",
        status: "urgent",
        timestamp: new Date("2023-03-01").toISOString(),
      },
      {
        id: "insp9",
        date: "2023-05-10",
        inspector: "John Doe",
        treadDepth: 2.8,
        pressure: 32,
        sidewallCondition: "severe_damage",
        status: "urgent",
        timestamp: new Date("2023-05-10").toISOString(),
      },
    ],
    currentMileage: 140000,
    costPerKm: 0.0145, // $1600 / 110000km
  },
  {
    id: "tyre4",
    brand: "Goodyear",
    model: "KMAX S",
    size: "385/65R22.5",
    tyreSize: {
      width: 385,
      aspectRatio: 65,
      rimDiameter: 22.5,
    },
    serialNumber: "GY123987456",
    dotCode: "DOT1239GYZ0322",
    manufactureDate: new Date("2022-03-20").toISOString(),
    installDetails: {
      date: new Date("2022-09-10").toISOString(),
      position: "trailer-left-1",
      vehicle: "22H",
      mileage: 45600,
    },
    treadDepth: 7.2, // mm
    pressure: 36, // PSI
    lastInspection: new Date("2023-05-15").toISOString(),
    status: "good",
    cost: 1700,
    estimatedLifespan: 130000,
    inspectionHistory: [
      {
        id: "insp10",
        date: "2022-12-10",
        inspector: "Jane Smith",
        treadDepth: 8.8,
        pressure: 38,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2022-12-10").toISOString(),
      },
      {
        id: "insp11",
        date: "2023-02-15",
        inspector: "Mike Johnson",
        treadDepth: 8.0,
        pressure: 37,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2023-02-15").toISOString(),
      },
      {
        id: "insp12",
        date: "2023-05-15",
        inspector: "John Doe",
        treadDepth: 7.2,
        pressure: 36,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2023-05-15").toISOString(),
      },
    ],
    currentMileage: 85000,
    costPerKm: 0.0131, // $1700 / 130000km
  },
  {
    id: "tyre5",
    brand: "Dunlop",
    model: "SP346",
    size: "385/65R22.5",
    tyreSize: {
      width: 385,
      aspectRatio: 65,
      rimDiameter: 22.5,
    },
    serialNumber: "DL567891234",
    dotCode: "DOT5678DLP0222",
    manufactureDate: new Date("2022-02-25").toISOString(),
    installDetails: {
      date: new Date("2022-06-15").toISOString(),
      position: "trailer-right-1",
      vehicle: "22H",
      mileage: 32400,
    },
    treadDepth: 4.3, // mm
    pressure: 33, // PSI
    lastInspection: new Date("2023-05-15").toISOString(),
    status: "worn",
    cost: 1550,
    estimatedLifespan: 120000,
    inspectionHistory: [
      {
        id: "insp13",
        date: "2022-08-10",
        inspector: "Mike Johnson",
        treadDepth: 8.5,
        pressure: 38,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2022-08-10").toISOString(),
      },
      {
        id: "insp14",
        date: "2022-11-15",
        inspector: "Jane Smith",
        treadDepth: 6.7,
        pressure: 36,
        sidewallCondition: "good",
        status: "good",
        timestamp: new Date("2022-11-15").toISOString(),
      },
      {
        id: "insp15",
        date: "2023-02-20",
        inspector: "John Doe",
        treadDepth: 5.5,
        pressure: 34,
        sidewallCondition: "minor_damage",
        status: "worn",
        timestamp: new Date("2023-02-20").toISOString(),
      },
      {
        id: "insp16",
        date: "2023-05-15",
        inspector: "Mike Johnson",
        treadDepth: 4.3,
        pressure: 33,
        sidewallCondition: "minor_damage",
        status: "worn",
        timestamp: new Date("2023-05-15").toISOString(),
      },
    ],
    currentMileage: 90000,
    costPerKm: 0.0129, // $1550 / 120000km
  },
];

// Status statistics calculation
const calculateStatusStats = (tyres: Tyre[]) => {
  const stats = {
    total: tyres.length,
    good: 0,
    worn: 0,
    urgent: 0,
  };

  tyres.forEach((tyre) => {
    if (tyre.status === "good") stats.good++;
    else if (tyre.status === "worn") stats.worn++;
    else if (tyre.status === "urgent") stats.urgent++;
  });

  return stats;
};

// Inventory stock levels calculation
const calculateInventoryStats = (inventory: TyreInventoryItem[]) => {
  return {
    total: inventory.reduce((sum, item) => sum + item.quantity, 0),
    items: inventory.length,
    lowStock: inventory.filter((item) => item.quantity <= item.reorderLevel).length,
    outOfStock: inventory.filter((item) => item.quantity === 0).length,
  };
};

// Brand performance calculation
const calculateBrandPerformance = (tyres: any[]) => {
  const brandStats: Record<
    string,
    {
      count: number;
      avgCostPerKm: number;
      avgLifespan: number;
      avgCost: number;
      performances: number[];
    }
  > = {};

  tyres.forEach((tyre) => {
    if (!tyre.brand || !tyre.costPerKm) return;

    if (!brandStats[tyre.brand]) {
      brandStats[tyre.brand] = {
        count: 0,
        avgCostPerKm: 0,
        avgLifespan: 0,
        avgCost: 0,
        performances: [],
      };
    }

    brandStats[tyre.brand].count++;
    brandStats[tyre.brand].performances.push(tyre.costPerKm);

    if (tyre.estimatedLifespan) {
      brandStats[tyre.brand].avgLifespan += tyre.estimatedLifespan;
    }

    if (tyre.cost) {
      brandStats[tyre.brand].avgCost += tyre.cost;
    }
  });

  // Calculate averages
  Object.keys(brandStats).forEach((brand) => {
    const stats = brandStats[brand];
    if (stats.count > 0) {
      stats.avgCostPerKm = stats.performances.reduce((sum, val) => sum + val, 0) / stats.count;
      stats.avgLifespan = stats.avgLifespan / stats.count;
      stats.avgCost = stats.avgCost / stats.count;
    }
  });

  return brandStats;
};

// Helper to convert data to CSV
const convertToCSV = (data: any[], fields: string[]) => {
  const header = fields.join(",");
  const rows = data.map((item) => {
    return fields
      .map((field) => {
        // Handle nested properties
        const value = field.includes(".")
          ? field.split(".").reduce((obj, key) => obj?.[key], item)
          : item[field];

        // Format the value for CSV
        if (value === undefined || value === null) return "";
        if (typeof value === "object" && "toISOString" in value) return value.toISOString();
        if (typeof value === "object") return JSON.stringify(value);
        return typeof value === "string" && value.includes(",") ? `"${value}"` : value;
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
};

// Helper to download CSV
const downloadCSV = (data: string, filename: string) => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const TyreDashboard: React.FC = () => {
  // Get data and methods from AppContext
  const {
    workshopInventory,
    refreshWorkshopInventory,
    isLoading: contextLoading,
  } = useAppContext();

  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterActive, setFilterActive] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);
  const [showInspectionHistory, setShowInspectionHistory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // More detailed filter criteria
  const [filterCriteria, setFilterCriteria] = useState<{
    status?: string;
    vehicle?: string;
    size?: string;
    brand?: string;
    pattern?: string;
    position?: string;
    storeLocation?: TyreStoreLocation;
  }>({});

  // Stats derived from the current filtered tyre list
  const stats = calculateStatusStats(tyres);
  const inventoryStats = calculateInventoryStats(workshopInventory);
  const brandPerformance = calculateBrandPerformance(tyres);

  // Register Firebase listeners when component mounts
  useEffect(() => {
    // Register callbacks for tyre data
    syncService.registerDataCallbacks({
      setTyres: (tyreData: Tyre[]) => {
        const filteredTyres = applyFilters(tyreData, filterCriteria);
        setTyres(filteredTyres);
        setLoading(false);
      },
    });

    // Subscribe to tyre data from Firestore
    syncService.subscribeToAllTyres();

    // If no data comes back in 2 seconds, use mock data for development
    const timer = setTimeout(() => {
      if (tyres.length === 0) {
        console.warn("No tyres found in Firestore, using sample data");
        const tyresData = [...MOCK_TYRES] as unknown as Tyre[];
        const filteredTyres = applyFilters(tyresData, filterCriteria);
        setTyres(filteredTyres);
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Clean up Firebase listeners
      syncService.unsubscribeFromAllTyres();
    };
  }, []);

  // Re-apply filters when filter criteria changes
  useEffect(() => {
    if (tyres.length > 0) {
      // Use the callback to get the latest tyres from syncService
      syncService.getTyres((latestTyres) => {
        const filteredTyres = applyFilters(latestTyres, filterCriteria);
        setTyres(filteredTyres);
      });
    }
  }, [filterCriteria]);

  // Refresh inventory data when inventory view is shown
  useEffect(() => {
    if (showInventory) {
      refreshWorkshopInventory();
    }
  }, [showInventory, refreshWorkshopInventory]);

  // Apply filters to the tyre data
  const applyFilters = (tyres: Tyre[], criteria: any) => {
    return tyres.filter((tyre) => {
      // Status filter
      if (criteria.status && tyre.status !== criteria.status) {
        return false;
      }

      // Vehicle filter
      if (criteria.vehicle && tyre.installDetails.vehicle !== criteria.vehicle) {
        return false;
      }

      // Size filter
      if (criteria.size && tyre.size !== criteria.size) {
        return false;
      }

      // Brand filter
      if (criteria.brand && tyre.brand !== criteria.brand) {
        return false;
      }

      // Pattern filter
      if (criteria.pattern && tyre.pattern !== criteria.pattern) {
        return false;
      }

      // Position filter (partial match)
      if (criteria.position && !tyre.installDetails.position.includes(criteria.position)) {
        return false;
      }

      return true;
    });
  };

  // Toggle views
  const toggleFilter = () => {
    setFilterActive(!filterActive);
  };

  const toggleInventoryView = () => {
    const newShowInventory = !showInventory;
    setShowInventory(newShowInventory);
    setShowAnalytics(false);

    // Refresh workshop inventory when switching to inventory view
    if (newShowInventory) {
      refreshWorkshopInventory();
    }
  };

  const toggleAnalyticsView = () => {
    setShowAnalytics(!showAnalytics);
    setShowInventory(false);
  };

  // Update a specific filter criterion
  const updateFilter = (key: string, value: string) => {
    setFilterCriteria((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterCriteria({});
  };

  // Handle tyre selection for inspection history
  const handleTyreSelect = (tyre: Tyre) => {
    setSelectedTyre(tyre);
    setShowInspectionHistory(true);
  };

  // Function to update a tyre
  const updateTyre = async (tyreId: string, updatedData: Partial<Tyre>) => {
    try {
      await syncService.updateTyre(tyreId, updatedData);
      // The UI will update automatically when the Firestore listener fires
    } catch (error) {
      console.error("Error updating tyre:", error);
      setError("Failed to update tyre. Please try again.");
    }
  };

  // Handle use of an inventory item in job card
  const handleUseItemInJobCard = (item: TyreInventoryItem) => {
    if (item.quantity > 0) {
      try {
        // Update the inventory quantity in Firebase
        syncService.updateInventoryItem(item.id, {
          ...item,
          quantity: item.quantity - 1,
          status: item.status as "in_stock" | "installed" | "scrapped", // Type assertion for status
        });
      } catch (error) {
        console.error("Error updating inventory item:", error);
        setError("Failed to update inventory. Please try again.");
      }
    }
  };

  // Handle reorder request for an inventory item
  const handleReorderItem = (item: TyreInventoryItem) => {
    try {
      // Create a reorder request in Firebase
      const reorderRequest = {
        itemId: item.id,
        brand: item.brand,
        pattern: item.pattern,
        size: item.size,
        quantity: Math.max(item.reorderLevel * 2 - item.quantity, 1),
        supplierId: item.supplierId,
        requestDate: new Date().toISOString(),
        status: "pending",
      };
      syncService.addReorderRequest(reorderRequest);
      alert(`Reorder request created for ${item.brand} ${item.pattern}`);
    } catch (error) {
      console.error("Error creating reorder request:", error);
      setError("Failed to create reorder request. Please try again.");
    }
  };

  // Handle tyre rotation
  const handleTyreRotation = (tyre: Tyre, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent opening inspection history
    }

    try {
      // Create a rotation request and update tyre status in Firebase
      const newPosition = tyre.installDetails.position.includes("front")
        ? tyre.installDetails.position.replace("front", "drive")
        : tyre.installDetails.position.includes("drive")
          ? tyre.installDetails.position.replace("drive", "trailer")
          : tyre.installDetails.position;

      if (newPosition !== tyre.installDetails.position) {
        // Update the tyre with new position
        updateTyre(tyre.id, {
          ...tyre,
          status: tyre.status as "good" | "worn" | "urgent", // Type assertion for status
          installDetails: {
            ...tyre.installDetails,
            position: newPosition,
          },
        });

        alert(`Tyre rotated from ${tyre.installDetails.position} to ${newPosition}`);
      } else {
        alert("Tyre is already in the final position and cannot be rotated further");
      }
    } catch (error) {
      console.error("Error rotating tyre:", error);
      setError("Failed to rotate tyre. Please try again.");
    }
  };

  // Handle CSV export with Firebase data
  const handleExportCSV = () => {
    if (showInventory) {
      const fields = [
        "id",
        "brand",
        "pattern",
        "size",
        "position",
        "quantity",
        "cost",
        "supplierId",
        "storeLocation",
      ];
      const csv = convertToCSV(workshopInventory, fields);
      downloadCSV(csv, "tyre_inventory.csv");
    } else {
      const fields = [
        "id",
        "brand",
        "model",
        "size",
        "serialNumber",
        "dotCode",
        "installDetails.vehicle",
        "installDetails.position",
        "installDetails.mileage",
        "installDetails.date",
        "treadDepth",
        "pressure",
        "status",
        "cost",
        "estimatedLifespan",
        "costPerKm",
      ];
      const csv = convertToCSV(tyres, fields);
      downloadCSV(csv, "active_tyres.csv");
    }
  };

  // Filter inventory items based on criteria
  const filteredInventory =
    filterCriteria.brand ||
    filterCriteria.size ||
    filterCriteria.pattern ||
    filterCriteria.storeLocation
      ? workshopInventory.filter((item) => {
          if (filterCriteria.brand && item.brand !== filterCriteria.brand) return false;
          if (filterCriteria.size && item.size !== filterCriteria.size) return false;
          if (filterCriteria.pattern && item.pattern !== filterCriteria.pattern) return false;
          if (filterCriteria.storeLocation && item.storeLocation !== filterCriteria.storeLocation)
            return false;
          return true;
        })
      : workshopInventory;

  // Handle CSV import with Firebase integration
  const handleImportCSV = () => {
    // Show file selector and process CSV
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvText = event.target?.result as string;
        try {
          // Process CSV and import to Firebase
          if (showInventory) {
            // Import inventory items
            const inventoryItems = processInventoryCSV(csvText);
            for (const item of inventoryItems) {
              await syncService.addInventoryItem(item);
            }
          } else {
            // Import tyres
            const tyreItems = processTyreCSV(csvText);
            for (const tyre of tyreItems) {
              await syncService.addTyre(tyre);
            }
          }

          // Refresh data
          if (showInventory) {
            refreshWorkshopInventory();
          } else {
            syncService.subscribeToAllTyres();
          }

          alert("CSV import completed successfully!");
        } catch (error) {
          console.error("Error importing CSV:", error);
          setError("Failed to import CSV. Please check the file format and try again.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
    // In a real implementation, this would open a file picker and process the CSV
  };

  // Simple CSV processors (placeholder implementations)
  const processInventoryCSV = (csvText: string): Omit<TyreInventoryItem, "id">[] => {
    // Basic CSV parsing logic - in a real app, use a robust CSV parser
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const item: Record<string, any> = {};

        headers.forEach((header, index) => {
          // Clean up header and handle special cases
          const cleanHeader = header.trim();
          const value = values[index]?.trim();

          if (
            cleanHeader === "quantity" ||
            cleanHeader === "reorderLevel" ||
            cleanHeader === "cost"
          ) {
            item[cleanHeader] = parseFloat(value) || 0;
          } else {
            item[cleanHeader] = value;
          }
        });

        // Ensure required fields have default values
        return {
          brand: item.brand || "Unknown",
          pattern: item.pattern || "Standard",
          size: item.size || "315/80R22.5",
          position: item.position || "standard",
          quantity: item.quantity || 0,
          reorderLevel: item.reorderLevel || 5,
          cost: item.cost || 0,
          supplierId: item.supplierId || "unknown",
          storeLocation: item.storeLocation || TyreStoreLocation.VICHELS_STORE,
          status: (item.status as "in_stock" | "installed" | "scrapped") || "in_stock",
          purchaseDate: item.purchaseDate || new Date().toISOString(),
          notes: item.notes || "",
          // Add required fields for TyreInventoryItem
          tyreRef: {
            brand: item.brand || "Unknown",
            pattern: item.pattern || "Standard",
            size: item.size || "315/80R22.5",
            position: item.position || "standard",
          },
          serialNumber: item.serialNumber || `SN-${Date.now()}`,
          dotCode: item.dotCode || `DOT-${Date.now()}`,
          supplier: VENDORS.find((v) => v.id === item.supplierId) || VENDORS[0],
          ...item, // Keep any other fields from the CSV
        };
      });
  };

  const processTyreCSV = (csvText: string): Omit<Tyre, "id">[] => {
    // Similar parsing logic for tyres
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");

    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = line.split(",");
        const tyreData: Record<string, any> = {
          installDetails: {},
        };

        headers.forEach((header, index) => {
          const cleanHeader = header.trim();
          const value = values[index]?.trim();

          // Handle nested properties
          if (cleanHeader.startsWith("installDetails.")) {
            const nestedProp = cleanHeader.split(".")[1];
            if (nestedProp === "mileage") {
              tyreData.installDetails[nestedProp] = parseInt(value) || 0;
            } else {
              tyreData.installDetails[nestedProp] = value;
            }
          } else if (
            cleanHeader === "treadDepth" ||
            cleanHeader === "pressure" ||
            cleanHeader === "cost" ||
            cleanHeader === "estimatedLifespan"
          ) {
            tyreData[cleanHeader] = parseFloat(value) || 0;
          } else {
            tyreData[cleanHeader] = value;
          }
        });

        // Ensure required fields have default values
        const now = new Date().toISOString();
        return {
          brand: tyreData.brand || "Unknown",
          model: tyreData.model || "Standard",
          size: tyreData.size || "315/80R22.5",
          serialNumber: tyreData.serialNumber || `SN-${Date.now()}`,
          dotCode: tyreData.dotCode || `DOT-${Date.now()}`,
          manufactureDate: tyreData.manufactureDate || now,
          treadDepth: tyreData.treadDepth || 8.0,
          pressure: tyreData.pressure || 35,
          status: (tyreData.status as "good" | "worn" | "urgent") || "good",
          cost: tyreData.cost || 0,
          // Add missing required fields
          lastInspection: tyreData.lastInspection || now,
          estimatedLifespan: tyreData.estimatedLifespan || 100000,
          installDetails: {
            date: tyreData.installDetails.date || now,
            position: tyreData.installDetails.position || "spare",
            vehicle: tyreData.installDetails.vehicle || "unknown",
            mileage: tyreData.installDetails.mileage || 0,
            ...tyreData.installDetails,
          },
          ...tyreData, // Keep any other fields from the CSV
        };
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tyre Dashboard</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            icon={<BarChart3 className="w-4 h-4" />}
          >
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowInventory(!showInventory)}
            icon={<Package className="w-4 h-4" />}
          >
            {showInventory ? "Show Active Tyres" : "Show Inventory"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilterActive(!filterActive)}
            icon={<Filter className="w-4 h-4" />}
          >
            {filterActive ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log("Export CSV")}
            icon={<FileDown className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log("Import CSV")}
            icon={<Upload className="w-4 h-4" />}
          >
            Import CSV
          </Button>
        </div>
      </div>
      {/* Error message display */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold mr-1">Error:</strong>
          <span className="block sm:inline">{error}</span>
          <button
            className="absolute top-0 right-0 mt-2 mr-2"
            onClick={() => console.log("Close error")}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
      {/* Filter Panel */}
      {filterActive && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {showInventory ? (
              // Inventory-specific filters
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.brand || "all"}
                    onChange={(e) => updateFilter("brand", e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {tyreBrands.map((brand: string) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.size || "all"}
                    onChange={(e) => updateFilter("size", e.target.value)}
                  >
                    <option value="all">All Sizes</option>
                    {tyreSizes.map((size: string) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {filterCriteria.brand && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={filterCriteria.pattern || "all"}
                      onChange={(e) => updateFilter("pattern", e.target.value)}
                    >
                      <option value="all">All Patterns</option>
                      {TYRE_REFERENCES.filter(
                        (ref: TyreReference) =>
                          !filterCriteria.brand || ref.brand === filterCriteria.brand
                      )
                        .map((ref: TyreReference) => ref.pattern)
                        .filter(
                          (pattern: string, index: number, self: string[]) =>
                            pattern && self.indexOf(pattern) === index
                        )
                        .map((pattern: string) => (
                          <option key={pattern} value={pattern}>
                            {pattern}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Location
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.storeLocation || "all"}
                    onChange={(e) => updateFilter("storeLocation", e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    {Object.values(TyreStoreLocation).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              // Active tyres filters
              <>
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.status || "all"}
                    onChange={(e) => updateFilter("status", e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="good">Good</option>
                    <option value="worn">Worn</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Vehicle Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.vehicle || "all"}
                    onChange={(e) => updateFilter("vehicle", e.target.value)}
                  >
                    <option value="all">All Vehicles</option>
                    <option value="21H">21H - Volvo FH16</option>
                    <option value="22H">22H - Afrit Side Tipper</option>
                    <option value="23H">23H - Mercedes Actros</option>
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.size || "all"}
                    onChange={(e) => updateFilter("size", e.target.value)}
                  >
                    <option value="all">All Sizes</option>
                    {tyreSizes.map((size: string) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.brand || "all"}
                    onChange={(e) => updateFilter("brand", e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {tyreBrands.map((brand: string) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={filterCriteria.position || "all"}
                    onChange={(e) => updateFilter("position", e.target.value)}
                  >
                    <option value="all">All Positions</option>
                    <option value="front">Front</option>
                    <option value="drive">Drive</option>
                    <option value="trailer">Trailer</option>
                    <option value="left">Left Side</option>
                    <option value="right">Right Side</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => console.log("Clear Filters")} size="sm">
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {showInventory ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Total Inventory</h3>
            <p className="text-3xl font-bold mt-2">{inventoryStats.total} units</p>
            <p className="text-sm text-gray-500 mt-1">{inventoryStats.items} different items</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Brands in Stock</h3>
            <p className="text-3xl font-bold mt-2">
              {new Set(workshopInventory.map((item) => item.brand)).size}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
            <h3 className="text-lg font-medium">Low Stock Items</h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">{inventoryStats.lowStock}</p>
            <p className="text-sm text-gray-500 mt-1">Below reorder level</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-lg font-medium">Out of Stock</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{inventoryStats.outOfStock}</p>
            <p className="text-sm text-gray-500 mt-1">Need immediate reordering</p>
          </div>
        </div>
      ) : showAnalytics ? (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium mb-4">Brand Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Cost
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Lifespan
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost per KM
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ROI Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(brandPerformance).map(([brand, stats]) => (
                    <tr key={brand}>
                      <td className="py-3 px-3 whitespace-nowrap">{brand}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{stats.count}</td>
                      <td className="py-3 px-3 whitespace-nowrap">${stats.avgCost.toFixed(2)}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {stats.avgLifespan.toLocaleString()} km
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        ${stats.avgCostPerKm.toFixed(4)}/km
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            stats.avgCostPerKm < 0.013
                              ? "bg-green-100 text-green-800"
                              : stats.avgCostPerKm < 0.014
                                ? "bg-blue-100 text-blue-800"
                                : stats.avgCostPerKm < 0.015
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stats.avgCostPerKm < 0.013
                            ? "Excellent"
                            : stats.avgCostPerKm < 0.014
                              ? "Good"
                              : stats.avgCostPerKm < 0.015
                                ? "Average"
                                : "Poor"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium mb-4">Tyre Size Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-medium mb-2">By Width</h4>
                {/* Simple visual representation */}
                <div className="space-y-2">
                  {Array.from(new Set(tyres.map((t) => (t as any).tyreSize?.width))).map(
                    (width) => {
                      if (!width) return null;
                      const count = tyres.filter(
                        (t) => (t as any).tyreSize?.width === width
                      ).length;
                      const percentage = (count / tyres.length) * 100;
                      return (
                        <div key={`width-${width}`} className="relative">
                          <div className="flex items-center">
                            <span className="w-16 text-sm">{width} mm</span>
                            <div className="flex-grow bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-600 rounded-full h-4"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{count}</span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-2">By Aspect Ratio</h4>
                <div className="space-y-2">
                  {Array.from(new Set(tyres.map((t) => (t as any).tyreSize?.aspectRatio))).map(
                    (ratio) => {
                      if (!ratio) return null;
                      const count = tyres.filter(
                        (t) => (t as any).tyreSize?.aspectRatio === ratio
                      ).length;
                      const percentage = (count / tyres.length) * 100;
                      return (
                        <div key={`ratio-${ratio}`} className="relative">
                          <div className="flex items-center">
                            <span className="w-16 text-sm">{ratio}%</span>
                            <div className="flex-grow bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-green-600 rounded-full h-4"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm">{count}</span>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium mb-4">Position Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Wear Rate
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rotation Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Group by position type (front, drive, trailer) */}
                  {["front", "drive", "trailer"].map((posType) => {
                    const positionTyres = tyres.filter((t) =>
                      t.installDetails.position.includes(posType)
                    );
                    if (positionTyres.length === 0) return null;

                    // Calculate average tread depth
                    const avgTreadDepth =
                      positionTyres.reduce((sum, t) => sum + t.treadDepth, 0) /
                      positionTyres.length;

                    // Get earliest inspection date for these tyres
                    const allDates = positionTyres
                      .flatMap((t) => (t as any).inspectionHistory || [])
                      .map((insp) => new Date(insp.timestamp).getTime());
                    const minDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : null;

                    // Simple wear rate calculation (mm/month)
                    let wearRate = "N/A";
                    if (minDate) {
                      const monthsDiff =
                        (Date.now() - minDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
                      if (monthsDiff > 0) {
                        // Assuming new tyres start at around 10mm tread depth
                        const totalWear = 10 - avgTreadDepth;
                        const monthlyWear = totalWear / monthsDiff;
                        wearRate = `${monthlyWear.toFixed(2)} mm/month`;
                      }
                    }

                    // Rotation recommendation
                    let recommendation = "N/A";
                    if (posType === "front" && avgTreadDepth < 6) {
                      recommendation = "Rotate to drive position";
                    } else if (posType === "drive" && avgTreadDepth < 5) {
                      recommendation = "Rotate to trailer position";
                    } else if (posType === "trailer" && avgTreadDepth < 4) {
                      recommendation = "Replace";
                    } else {
                      recommendation = "No action needed";
                    }

                    return (
                      <tr key={posType}>
                        <td className="py-3 px-3 whitespace-nowrap capitalize">
                          {posType} Position
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{positionTyres.length}</td>
                        <td className="py-3 px-3 whitespace-nowrap">{wearRate}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              recommendation === "No action needed"
                                ? "bg-green-100 text-green-800"
                                : recommendation.includes("Rotate")
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {recommendation}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium">Total Tyres</h3>
            <p className="text-3xl font-bold mt-2">{stats.total}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-lg font-medium">Good Condition</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{stats.good}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.good / stats.total) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
            <h3 className="text-lg font-medium">Worn</h3>
            <p className="text-3xl font-bold mt-2 text-amber-600">{stats.worn}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.worn / stats.total) * 100) : 0}% of total
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <h3 className="text-lg font-medium">Urgent</h3>
            <p className="text-3xl font-bold mt-2 text-red-600">{stats.urgent}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.total > 0 ? Math.round((stats.urgent / stats.total) * 100) : 0}% of total
            </p>
          </div>
        </div>
      )}

      {/* Inspection History Modal */}
      {showInspectionHistory && selectedTyre && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Tyre Inspection History
                    </h3>
                    <div className="mt-2">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">
                          <strong>Brand:</strong> {selectedTyre.brand} <strong>Model:</strong>{" "}
                          {selectedTyre.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Size:</strong> {selectedTyre.size} <strong>Serial:</strong>{" "}
                          {selectedTyre.serialNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>Position:</strong> {selectedTyre.installDetails.position}{" "}
                          <strong>Vehicle:</strong> {selectedTyre.installDetails.vehicle}
                        </p>
                      </div>

                      {/* Tread Depth Chart */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">Tread Depth History</h4>
                        <div className="h-20 flex items-end space-x-1">
                          {(selectedTyre as any).inspectionHistory?.map(
                            (insp: any, index: number) => {
                              const height = Math.min(100, (insp.treadDepth / 10) * 100);
                              return (
                                <div key={index} className="flex flex-col items-center">
                                  <div
                                    className={`w-12 rounded-t transition-all ${
                                      insp.treadDepth > 6
                                        ? "bg-green-500"
                                        : insp.treadDepth > 3
                                          ? "bg-yellow-500"
                                          : "bg-red-500"
                                    }`}
                                    style={{ height: `${height}%` }}
                                  ></div>
                                  <div className="text-xs mt-1 w-12 text-center">
                                    {new Date(insp.date).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Inspection List */}
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Date
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Inspector
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tread Depth
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Pressure
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Sidewall
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {(selectedTyre as any).inspectionHistory?.map(
                              (insp: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {new Date(insp.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {insp.inspector}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {insp.treadDepth} mm
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    {insp.pressure} PSI
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm capitalize">
                                    {insp.sidewallCondition?.replace("_", " ") || "N/A"}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                                    <span
                                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                    ${
                                      insp.status === "good"
                                        ? "bg-green-100 text-green-800"
                                        : insp.status === "worn"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                    >
                                      {insp.status}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => console.log("Close Modal")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Based on View */}
      {loading || (showInventory && contextLoading?.loadWorkshopInventory) ? (
        <div className="flex justify-center items-center h-40">
          <LoadingIndicator />
        </div>
      ) : showInventory ? (
        // Inventory View
        filteredInventory.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">No inventory items match the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className={`
                  bg-white p-5 rounded-lg shadow-sm border
                  ${
                    item.quantity === 0
                      ? "border-red-300"
                      : item.quantity <= item.reorderLevel
                        ? "border-amber-300"
                        : "border-green-300"
                  }
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      {item.brand} {item.pattern}
                    </h3>
                    <p className="text-sm text-gray-500">{item.size}</p>
                  </div>
                  <div
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center
                      ${
                        item.quantity === 0
                          ? "bg-red-100 text-red-600"
                          : item.quantity <= item.reorderLevel
                            ? "bg-amber-100 text-amber-600"
                            : "bg-green-100 text-green-600"
                      }
                    `}
                  >
                    {item.quantity === 0 ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : item.quantity <= item.reorderLevel ? (
                      <TrendingDown className="h-5 w-5" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Stock Level</p>
                    <p className="text-xl font-bold">
                      {item.quantity} <span className="text-sm font-normal">units</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reorder Level</p>
                    <p className="text-sm font-medium">{item.reorderLevel} units</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Position Type</p>
                    <p className="text-sm font-medium capitalize">{item.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost per Unit</p>
                    <p className="text-sm font-medium">${item.cost.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Supplier</p>
                  <p className="text-sm font-medium">
                    {VENDORS.find((v) => v.id === item.supplierId)?.name || "Unknown"}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-500">Store Location</p>
                  <p className="text-sm font-medium">{item.storeLocation}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={item.quantity === 0}
                    onClick={() => console.log("Use in Job Card", item)}
                  >
                    Use in Job Card
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log("View Details", item)}
                  >
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : // Tyre Cards View
      tyres.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">No tyres match the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tyres.map((tyre) => (
            <div
              key={tyre.id}
              className={`
                  bg-white p-5 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow
                  ${
                    tyre.status === "urgent"
                      ? "border-red-300"
                      : tyre.status === "worn"
                        ? "border-amber-300"
                        : "border-green-300"
                  }
                `}
              onClick={() => console.log("Tyre clicked", tyre)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    {tyre.brand} {tyre.model}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>{tyre.size}</span>
                    <Ruler className="w-3 h-3" />
                    <span className="text-xs">
                      {(tyre as any).tyreSize
                        ? `${(tyre as any).tyreSize.width}/${(tyre as any).tyreSize.aspectRatio}R${(tyre as any).tyreSize.rimDiameter}`
                        : tyre.size}
                    </span>
                  </div>
                </div>
                <div
                  className={`
                      h-8 w-8 rounded-full flex items-center justify-center
                      ${
                        tyre.status === "urgent"
                          ? "bg-red-100 text-red-600"
                          : tyre.status === "worn"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-green-100 text-green-600"
                      }
                    `}
                >
                  {tyre.status === "urgent" ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : tyre.status === "worn" ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Serial Number</p>
                  <p className="text-sm font-medium">{tyre.serialNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">DOT Code</p>
                  <p className="text-sm font-medium">{tyre.dotCode}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-500">Vehicle</p>
                <p className="text-sm font-medium">{tyre.installDetails.vehicle}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-medium capitalize">
                    {tyre.installDetails.position.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Install Date</p>
                  <p className="text-sm font-medium">
                    {new Date(tyre.installDetails.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Tread Depth</p>
                  <div className="flex items-center">
                    <p
                      className={`text-sm font-medium ${tyre.treadDepth < 3 ? "text-red-600" : tyre.treadDepth < 5 ? "text-amber-600" : "text-green-600"}`}
                    >
                      {tyre.treadDepth} mm
                    </p>
                    <div className="w-12 ml-2 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          tyre.treadDepth < 3
                            ? "bg-red-500"
                            : tyre.treadDepth < 5
                              ? "bg-amber-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(100, (tyre.treadDepth / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pressure</p>
                  <p className="text-sm font-medium">{tyre.pressure} PSI</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Last Inspection</p>
                  <div className="flex items-center">
                    <Timer className="w-3 h-3 mr-1 text-gray-400" />
                    <p className="text-sm">
                      {new Date((tyre as any).lastInspection || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cost per KM</p>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">
                      ${(tyre as any).costPerKm?.toFixed(4) || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="xs"
                  icon={<RotateCcw className="w-3 h-3" />}
                  onClick={() => console.log("Rotation clicked")}
                >
                  Rotation
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TyreDashboard;
