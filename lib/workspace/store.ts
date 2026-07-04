import { create } from "zustand";

export interface ColumnMeta {
  name: string;
  type: "numeric" | "categorical" | "date" | "text";
  uniqueValues?: number;
  min?: number;
  max?: number;
}

export interface Insights {
  summary: string;
  keyTrends: string[];
  outliers: string[];
  correlations: string[];
  recommendations: string[];
}

interface WorkspaceState {
  fileName: string;
  data: any[];
  columns: ColumnMeta[];
  insights: Insights | null;
  loading: boolean;
  loadingInsights: boolean;
  filters: Record<string, string>;
  sortBy: { column: string; direction: "asc" | "desc" } | null;
  searchQuery: string;
  setFile: (name: string, data: any[], columns: ColumnMeta[]) => void;
  setInsights: (insights: Insights) => void;
  setLoadingInsights: (loading: boolean) => void;
  setFilter: (column: string, value: string) => void;
  clearFilter: () => void;
  setSort: (sort: { column: string; direction: "asc" | "desc" } | null) => void;
  setSearch: (q: string) => void;
  clear: () => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
  fileName: "",
  data: [],
  columns: [],
  insights: null,
  loading: false,
  loadingInsights: false,
  filters: {},
  sortBy: null,
  searchQuery: "",
  setFile: (fileName, data, columns) => set({ fileName, data, columns, insights: null }),
  setInsights: (insights) => set({ insights }),
  setLoadingInsights: (loadingInsights) => set({ loadingInsights }),
  setFilter: (column, value) => set((s) => ({ filters: { ...s.filters, [column]: value } })),
  clearFilter: () => set({ filters: {} }),
  setSort: (sortBy) => set({ sortBy }),
  setSearch: (searchQuery) => set({ searchQuery }),
  clear: () => set({ fileName: "", data: [], columns: [], insights: null, filters: {}, sortBy: null, searchQuery: "" })
}));
