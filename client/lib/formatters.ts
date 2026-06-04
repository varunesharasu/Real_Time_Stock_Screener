const indianFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCurrency(value: number): string {
  return `INR ${formatNumber(value, 2)}`;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 10000000) {
    return `${formatNumber(value / 10000000, 2)}Cr`;
  }
  if (value >= 100000) {
    return `${formatNumber(value / 100000, 2)}L`;
  }
  if (value >= 1000) {
    return `${formatNumber(value / 1000, 1)}K`;
  }
  return indianFormatter.format(value);
}

export function formatMarketCap(value: number): string {
  return `${formatNumber(value, 2)}Cr`;
}
