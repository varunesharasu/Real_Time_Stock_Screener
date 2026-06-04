export function ChartShell({ symbol }: { symbol?: string }) {
  return (
    <section className="glass-panel flex min-h-[340px] flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">Chart</p>
          <h3 className="text-lg font-semibold text-ink-50">
            {symbol ? `${symbol} Momentum` : "Select a stock"}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-300">
          <span className="rounded-full border border-white/10 px-3 py-1">1D</span>
          <span className="rounded-full border border-white/10 px-3 py-1">1W</span>
          <span className="rounded-full border border-white/10 px-3 py-1">1M</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/10 bg-surface-900 text-ink-400">
        Candlestick chart surface (Lightweight Charts integration pending)
      </div>
    </section>
  );
}
