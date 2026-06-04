import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage } from "zustand/middleware";
import type { FilterConfig, SortConfig } from "../types";
import type { PriceUpdate } from "../types";

export type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

interface StockStore {
  activeFilters: FilterConfig[];
  setFilter: (filter: FilterConfig) => void;
  removeFilter: (filterId: string) => void;
  clearAllFilters: () => void;

  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;

  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;

  livePrices: Map<string, PriceUpdate>;
  batchUpdatePrices: (updates: Map<string, PriceUpdate>) => void;

  watchlist: Set<string>;
  toggleWatchlist: (symbol: string) => void;

  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;

  markRecentlyUpdated: (symbol: string) => void;
  clearRecentUpdates: () => void;
}

export const useStockStore = create<StockStore>()(
  immer(
    devtools(
      persist(
        (set) => ({
          activeFilters: [],
          setFilter: (filter) =>
            set((state) => {
              const existing = state.activeFilters.find((item) => item.id === filter.id);
              if (existing) {
                Object.assign(existing, filter);
              } else {
                state.activeFilters.push(filter);
              }
            }),
          removeFilter: (filterId) =>
            set((state) => {
              state.activeFilters = state.activeFilters.filter((item) => item.id !== filterId);
            }),
          clearAllFilters: () =>
            set((state) => {
              state.activeFilters = [];
            }),
          sortConfig: { column: "marketCap", direction: "desc" },
          setSortConfig: (config) =>
            set((state) => {
              state.sortConfig = config;
            }),
          selectedSymbol: null,
          setSelectedSymbol: (symbol) =>
            set((state) => {
              state.selectedSymbol = symbol;
            }),
          livePrices: new Map(),
          batchUpdatePrices: (updates) =>
            set((state) => {
              updates.forEach((update, symbol) => {
                state.livePrices.set(symbol, update);
              });
            }),
          watchlist: new Set(),
          toggleWatchlist: (symbol) =>
            set((state) => {
              if (state.watchlist.has(symbol)) {
                state.watchlist.delete(symbol);
              } else {
                state.watchlist.add(symbol);
              }
            }),
          connectionStatus: "disconnected",
          setConnectionStatus: (status) =>
            set((state) => {
              state.connectionStatus = status;
            }),
          markRecentlyUpdated: (symbol) =>
            set((state) => {
              state.livePrices.set(symbol, {
                symbol,
                lastPrice: state.livePrices.get(symbol)?.lastPrice ?? 0,
                previousClose: state.livePrices.get(symbol)?.previousClose ?? 0,
                timestamp: Date.now(),
              });
            }),
          clearRecentUpdates: () =>
            set((state) => {
              const threshold = Date.now() - 15000;
              for (const [symbol, update] of state.livePrices) {
                if (update.timestamp < threshold) {
                  state.livePrices.delete(symbol);
                }
              }
            }),
        }),
        {
          name: "stock-store",
          partialize: (state) => ({
            watchlist: Array.from(state.watchlist),
          }),
          storage: createJSONStorage(() => localStorage),
          merge: (persisted, current) => {
            const typed = persisted as { watchlist?: string[] };
            return {
              ...current,
              watchlist: new Set(typed.watchlist ?? []),
            };
          },
        }
      )
    )
  )
);
