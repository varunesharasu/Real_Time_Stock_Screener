import { memo } from "react";
import clsx from "clsx";
import { formatCurrency, formatMarketCap, formatPercent, formatVolume } from "../../lib/formatters";

export const PriceCell = memo(function PriceCell({ value }: { value: number }) {
  return <span className="font-mono text-ink-50">{formatCurrency(value)}</span>;
});

export const ChangeCell = memo(function ChangeCell({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 font-mono",
        isPositive ? "text-positive-500" : "text-negative-500"
      )}
    >
      <span>{isPositive ? "▲" : "▼"}</span>
      {formatPercent(value)}
    </span>
  );
});

export const VolumeCell = memo(function VolumeCell({ value }: { value: number }) {
  return <span className="font-mono text-ink-100">{formatVolume(value)}</span>;
});

export const MarketCapCell = memo(function MarketCapCell({ value }: { value: number }) {
  return <span className="font-mono text-ink-100">{formatMarketCap(value)}</span>;
});

export const RSICell = memo(function RSICell({ value }: { value: number }) {
  const tone = value < 30 ? "bg-positive-600/30" : value > 70 ? "bg-negative-600/30" : "bg-warning-500/20";
  return (
    <span className={clsx("rounded-md px-2 py-1 font-mono text-xs", tone)}>
      {value.toFixed(1)}
    </span>
  );
});
