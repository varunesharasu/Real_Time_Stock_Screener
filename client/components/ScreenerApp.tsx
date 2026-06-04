"use client";

import { AppHeader } from "./Layout/AppHeader";
import { FilterPanel } from "./FilterPanel/FilterPanel";
import { StockGrid } from "./DataGrid/StockGrid";
import { ChartShell } from "./Chart/ChartShell";
import { useStockStore } from "../stores/stockStore";
import { useStockScreener } from "../hooks/useStockScreener";

export function ScreenerApp() {
  const status = useStockStore((state) => state.connectionStatus);
  const selectedSymbol = useStockStore((state) => state.selectedSymbol);
  const { stocks, isLoading, totalCount } = useStockScreener();

  return (
    <div className="min-h-screen grid-overlay">
      <AppHeader status={status} />
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-6 py-8">
        <section className="glass-panel animate-rise rounded-2xl px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-ink-400">Market Pulse</p>
              <h2 className="text-2xl font-semibold text-ink-50">
                High velocity screening for 5,000+ equities
              </h2>
              <p className="mt-2 text-sm text-ink-300">
                Filter response targets under 200ms. Live price updates and chart overlays
                coming online as we wire the data feed.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MetricCard label="Filter Latency" value="< 200ms" />
              <MetricCard label="Scroll FPS" value="> 55" />
              <MetricCard label="Universe" value="5,000" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_minmax(320px,420px)]">
          <FilterPanel totalCount={totalCount} filteredCount={stocks.length} />
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <div className="glass-panel flex min-h-[520px] items-center justify-center rounded-2xl text-ink-300">
                Loading stock universe...
              </div>
            ) : (
              <StockGrid data={stocks} totalCount={totalCount} />
            )}
          </div>
          <ChartShell symbol={selectedSymbol ?? undefined} />
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-900 px-4 py-3 text-sm">
      <p className="text-ink-400">{label}</p>
      <p className="text-lg font-semibold text-ink-50">{value}</p>
    </div>
  );
}
