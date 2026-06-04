import clsx from "clsx";

type ConnectionStatus = "connected" | "reconnecting" | "disconnected";

const STATUS_STYLES: Record<ConnectionStatus, string> = {
  connected: "bg-positive-500",
  reconnecting: "bg-warning-500",
  disconnected: "bg-negative-500",
};

export function AppHeader({ status = "disconnected" }: { status?: ConnectionStatus }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            EP
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-ink-300">EquityPulse</p>
            <h1 className="text-xl font-semibold text-ink-50">Real-Time Stock Screener</h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-surface-900 px-4 py-2 text-sm text-ink-200 md:flex">
            <span className="text-ink-400">Universe</span>
            <span className="font-semibold text-ink-50">5,000+</span>
            <span className="text-ink-400">stocks</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-300">
            <span className={clsx("h-2.5 w-2.5 rounded-full", STATUS_STYLES[status])} />
            <span className="capitalize">{status}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
