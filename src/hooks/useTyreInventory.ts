import { firestore } from "@/firebase";
import { tyreConverter } from "@/types/TyreFirestoreConverter";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Core Tyre shape used in Firestore (from legacy manager component)
export interface TyreDoc {
  id: string;
  brand: string;
  model: string;
  serialNumber: string;
  size: string;
  status: "new" | "in_use" | "worn" | "damaged" | "disposed";
  location: string;
  vehicleId?: string;
  vehicleReg?: string;
  position?: string;
  purchaseDate: string;
  purchasePrice: number;
  treadDepth?: number;
  lastInspection?: string;
  notes?: string;
  [key: string]: any; // flexible extension
}

export interface TyreInventoryUIRecord {
  id: string;
  tyreNumber: string; // mapped from serialNumber
  manufacturer: string; // mapped from brand
  condition: "New" | "Good" | "Fair" | "Poor" | "Retreaded";
  status: "In-Service" | "In-Stock" | "Repair" | "Scrap";
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
}

interface PendingAdd {
  type: "add";
  tempId: string;
  data: Omit<TyreDoc, "id">;
}
interface PendingUpdate {
  type: "update";
  id: string;
  data: Partial<Omit<TyreDoc, "id">>;
}
interface PendingDelete {
  type: "delete";
  id: string;
}

type PendingOp = PendingAdd | PendingUpdate | PendingDelete;

interface UseTyreInventoryOptions {
  pageSize?: number;
  cacheKey?: string;
  queueKey?: string;
}

export function useTyreInventory(opts: UseTyreInventoryOptions = {}) {
  const { pageSize = 10, cacheKey = "tyres_cache_v1", queueKey = "tyres_op_queue_v1" } = opts;
  const [tyres, setTyres] = useState<TyreDoc[]>([]);
  const [filtered, setFiltered] = useState<TyreDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const processingRef = useRef(false);

  // --- Offline Queue Helpers ---
  const loadQueue = (): PendingOp[] => {
    try {
      return JSON.parse(localStorage.getItem(queueKey) || "[]");
    } catch {
      return [];
    }
  };
  const saveQueue = (q: PendingOp[]) => localStorage.setItem(queueKey, JSON.stringify(q));
  const enqueue = (op: PendingOp) => {
    const q = loadQueue();
    q.push(op);
    saveQueue(q);
  };

  const processQueue = useCallback(async () => {
    if (!navigator.onLine || processingRef.current) return;
    const q = loadQueue();
    if (!q.length) return;
    processingRef.current = true;
    const remain: PendingOp[] = [];
    for (const op of q) {
      try {
        if (op.type === "add") {
          const ref = await addDoc(collection(firestore, "tyres"), {
            ...op.data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setTyres((prev) => prev.map((t) => (t.id === op.tempId ? { ...t, id: ref.id } : t)));
        } else if (op.type === "update") {
          await updateDoc(doc(firestore, "tyres", op.id), {
            ...op.data,
            updatedAt: new Date().toISOString(),
          });
        } else if (op.type === "delete") {
          await deleteDoc(doc(firestore, "tyres", op.id));
        }
      } catch (e) {
        console.warn("Retry later op failed", op, e);
        remain.push(op);
      }
    }
    saveQueue(remain);
    processingRef.current = false;
  }, [queueKey]);

  // --- Cache helpers ---
  const loadCache = (): TyreDoc[] => {
    try {
      return JSON.parse(localStorage.getItem(cacheKey) || "[]");
    } catch {
      return [];
    }
  };
  const saveCache = (list: TyreDoc[]) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(list));
    } catch {
      /*ignore*/
    }
  };

  // Initial subscribe
  useEffect(() => {
    const cached = loadCache();
    if (cached.length) {
      setTyres(cached);
      setFiltered(cached);
      setLoading(false);
    }
    const ref = collection(firestore, "tyres").withConverter(tyreConverter as any);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const live = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setTyres(live);
        applyFilters(live, searchTerm, statusFilter, brandFilter, sizeFilter);
        saveCache(live);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Tyres subscribe error", err);
        setError("Failed to load tyres");
        setLoading(false);
      }
    );
    window.addEventListener("online", processQueue);
    processQueue();
    return () => {
      unsub();
      window.removeEventListener("online", processQueue);
    };
  }, []);

  const applyFilters = useCallback(
    (
      list: TyreDoc[],
      search = searchTerm,
      status = statusFilter,
      brand = brandFilter,
      size = sizeFilter
    ) => {
      let f = list;
      if (search) {
        const s = search.toLowerCase();
        f = f.filter(
          (t) =>
            t.serialNumber.toLowerCase().includes(s) ||
            t.brand.toLowerCase().includes(s) ||
            t.model.toLowerCase().includes(s) ||
            t.vehicleReg?.toLowerCase().includes(s)
        );
      }
      if (status !== "all") f = f.filter((t) => t.status === status);
      if (brand !== "all") f = f.filter((t) => t.brand === brand);
      if (size !== "all") f = f.filter((t) => t.size === size);
      setFiltered(f);
      setPage(1);
    },
    [searchTerm, statusFilter, brandFilter, sizeFilter]
  );

  // Handlers
  const onSearchChange = (v: string) => {
    setSearchTerm(v);
    applyFilters(tyres, v);
  };
  const onStatusChange = (v: string) => {
    setStatusFilter(v);
    applyFilters(tyres, searchTerm, v);
  };
  const onBrandChange = (v: string) => {
    setBrandFilter(v);
    applyFilters(tyres, searchTerm, statusFilter, v);
  };
  const onSizeChange = (v: string) => {
    setSizeFilter(v);
    applyFilters(tyres, searchTerm, statusFilter, brandFilter, v);
  };
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setBrandFilter("all");
    setSizeFilter("all");
    applyFilters(tyres, "", "all", "all", "all");
  };

  // CRUD (optimistic with queue)
  const addTyre = async (data: Omit<TyreDoc, "id">) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic: TyreDoc = { id: tempId, ...data } as TyreDoc;
    setTyres((prev) => [optimistic, ...prev]);
    enqueue({ type: "add", tempId, data });
    applyFilters([optimistic, ...tyres]);
    processQueue();
  };
  const updateTyre = async (id: string, data: Partial<Omit<TyreDoc, "id">>) => {
    setTyres((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    enqueue({ type: "update", id, data });
    applyFilters(tyres.map((t) => (t.id === id ? { ...t, ...data } : t)));
    processQueue();
  };
  const deleteTyre = async (id: string) => {
    const backup = tyres;
    setTyres((prev) => prev.filter((t) => t.id !== id));
    enqueue({ type: "delete", id });
    applyFilters(tyres.filter((t) => t.id !== id));
    try {
      await processQueue();
    } catch {
      setTyres(backup);
      applyFilters(backup);
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  );
  const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const gotoPage = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

  // UI mapping for existing dashboard expecting TyreInventoryUIRecord
  const uiRecords: TyreInventoryUIRecord[] = useMemo(
    () =>
      filtered.map((t) => ({
        id: t.id,
        tyreNumber: t.serialNumber || t.id,
        manufacturer: t.brand,
        condition: ((): TyreInventoryUIRecord["condition"] => {
          if (t.status === "new") return "New";
          const tread = t.treadDepth ?? 0;
          if (tread > 10) return "Good";
          if (tread > 6) return "Fair";
          if (tread > 3) return "Poor";
          return "Retreaded";
        })(),
        status: ((): TyreInventoryUIRecord["status"] => {
          switch (t.status) {
            case "new":
              return "In-Stock";
            case "in_use":
              return "In-Service";
            case "damaged":
              return "Repair";
            case "disposed":
              return "Scrap";
            default:
              return "In-Service";
          }
        })(),
        vehicleAssignment: t.vehicleReg || "",
        km: t.kmRun || 0,
        kmLimit: t.kmRunLimit || 60000,
        treadDepth: t.treadDepth || 0,
        mountStatus: t.position ? "Mounted" : "Not Mounted",
        axlePosition: t.position,
        lastInspection: t.lastInspection,
        datePurchased: t.purchaseDate,
        size: t.size,
        pattern: t.model,
      })),
    [filtered]
  );

  return {
    // raw
    tyres,
    loading,
    error,
    // filters
    searchTerm,
    statusFilter,
    brandFilter,
    sizeFilter,
    setSearchTerm: onSearchChange,
    setStatusFilter: onStatusChange,
    setBrandFilter: onBrandChange,
    setSizeFilter: onSizeChange,
    clearFilters,
    // pagination
    page,
    totalPages,
    pageItems,
    nextPage,
    prevPage,
    gotoPage,
    // ui mapping
    uiRecords,
    // crud
    addTyre,
    updateTyre,
    deleteTyre,
  };
}
