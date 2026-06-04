import { createColumnHelper } from "@tanstack/react-table";
import type { Stock } from "../../types";
import { ChangeCell, MarketCapCell, PriceCell, RSICell, VolumeCell } from "./cells";

const columnHelper = createColumnHelper<Stock>();

export const stockColumns = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    size: 110,
    cell: (info) => (
      <span className="font-mono font-semibold text-brand-300">{info.getValue()}</span>
    ),
    enableSorting: true,
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("companyName", {
    header: "Company",
    size: 220,
    cell: (info) => <span className="text-ink-100">{info.getValue()}</span>,
  }),
  columnHelper.accessor("lastPrice", {
    header: "LTP",
    size: 120,
    cell: (info) => <PriceCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("changePercent", {
    header: "% Change",
    size: 120,
    cell: (info) => <ChangeCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("volume", {
    header: "Volume",
    size: 120,
    cell: (info) => <VolumeCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    size: 140,
    cell: (info) => <MarketCapCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("sector", {
    header: "Sector",
    size: 120,
    cell: (info) => <span className="text-ink-200">{info.getValue()}</span>,
  }),
  columnHelper.accessor("rsi14", {
    header: "RSI",
    size: 90,
    cell: (info) => <RSICell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("sma50", {
    header: "SMA 50",
    size: 110,
    cell: (info) => <PriceCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("sma200", {
    header: "SMA 200",
    size: 110,
    cell: (info) => <PriceCell value={info.getValue()} />,
    sortingFn: "basic",
  }),
  columnHelper.accessor("pe", {
    header: "P/E",
    size: 90,
    cell: (info) => <span className="font-mono text-ink-100">{info.getValue() ?? "-"}</span>,
    sortingFn: "basic",
  }),
  columnHelper.accessor("roe", {
    header: "ROE",
    size: 90,
    cell: (info) => <span className="font-mono text-ink-100">{info.getValue().toFixed(1)}</span>,
    sortingFn: "basic",
  }),
  columnHelper.accessor("debtToEquity", {
    header: "Debt/Equity",
    size: 110,
    cell: (info) => <span className="font-mono text-ink-100">{info.getValue().toFixed(2)}</span>,
    sortingFn: "basic",
  }),
];
