import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { filterStocks } from "../lib/filterEngine";
import type { Stock } from "../types";
import { useStockStore } from "../stores/stockStore";

interface UseStockScreenerOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useStockScreener(options: UseStockScreenerOptions = {}) {
  const { enabled = true, refetchInterval = 30000 } = options;
  const filters = useStockStore((state) => state.activeFilters);
  const sortConfig = useStockStore((state) => state.sortConfig);
  const watchlist = useStockStore((state) => state.watchlist);
  const livePrices = useStockStore((state) => state.livePrices);
  const queryClient = useQueryClient();

  const { data: allStocks, isLoading, error } = useQuery({
    queryKey: ["stocks", "universe"],
    queryFn: async () => {
      const response = await fetch("/api/stocks");
      const payload = await response.json();
      return payload.data as Stock[];
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval,
    enabled,
  });

  const enrichedStocks = useMemo(() => {
    if (!allStocks) return [];
    const now = Date.now();
    return allStocks.map((stock) => {
      const update = livePrices.get(stock.symbol);
      const lastPrice = update?.lastPrice ?? stock.lastPrice;
      const previousClose = update?.previousClose ?? stock.previousClose;
      const changeAbsolute = lastPrice - previousClose;
      const changePercent = previousClose ? (changeAbsolute / previousClose) * 100 : 0;
      return {
        ...stock,
        lastPrice,
        previousClose,
        changeAbsolute,
        changePercent,
        watchlist: watchlist.has(stock.symbol),
        recentlyUpdated: update ? now - update.timestamp < 15000 : false,
      };
    });
  }, [allStocks, livePrices, watchlist]);

  const filteredStocks = useMemo(() => {
    if (!enrichedStocks.length) return [];
    return filterStocks(enrichedStocks, filters, sortConfig);
  }, [enrichedStocks, filters, sortConfig]);

  const prefetchStockDetail = (symbol: string) => {
    queryClient.prefetchQuery({
      queryKey: ["stock", symbol, "detail"],
      queryFn: async () => {
        const response = await fetch(`/api/stocks/${symbol}`);
        const payload = await response.json();
        return payload.data as Stock;
      },
    });
  };

  return {
    stocks: filteredStocks,
    totalCount: allStocks?.length ?? 0,
    isLoading,
    error,
    prefetchStockDetail,
  };
}
