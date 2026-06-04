"use client";

import { useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import clsx from "clsx";
import type { Stock } from "../../types";
import { useStockStore } from "../../stores/stockStore";
import { stockColumns } from "./columns";

interface StockGridProps {
  data: Stock[];
  totalCount: number;
}

export function StockGrid({ data, totalCount }: StockGridProps) {
  const sortConfig = useStockStore((state) => state.sortConfig);
  const setSortConfig = useStockStore((state) => state.setSortConfig);
  const setSelectedSymbol = useStockStore((state) => state.setSelectedSymbol);

  const sorting = useMemo<SortingState>(
    () => [
      {
        id: sortConfig.column,
        desc: sortConfig.direction === "desc",
      },
    ],
    [sortConfig]
  );

  const table = useReactTable({
    data,
    columns: stockColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (!next.length) return;
      const [first] = next;
      setSortConfig({
        column: first.id as keyof Stock,
        direction: first.desc ? "desc" : "asc",
      });
    },
    enableColumnResizing: true,
    columnResizeMode: "onChange",
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-400">Universe</p>
          <h2 className="text-lg font-semibold text-ink-50">Screener Grid</h2>
        </div>
        <div className="text-sm text-ink-300">
          {data.length} of {totalCount} stocks
        </div>
      </div>

      <div className="mt-4" role="grid" aria-label="Stock Screener Results" aria-rowcount={data.length}>
        <div className="grid grid-cols-[repeat(13,minmax(90px,1fr))] gap-3 text-xs font-semibold uppercase tracking-wider text-ink-400">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                role="columnheader"
                aria-sort={
                  header.column.getIsSorted()
                    ? header.column.getIsSorted() === "desc"
                      ? "descending"
                      : "ascending"
                    : "none"
                }
                className="cursor-pointer select-none"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            ))
          )}
        </div>

        <div ref={parentRef} className="mt-3 h-[520px] overflow-auto rounded-xl border border-white/5">
          <div style={{ height: `${totalSize}px`, position: "relative" }}>
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <div
                  key={row.id}
                  role="row"
                  aria-rowindex={virtualRow.index + 2}
                  className={clsx(
                    "absolute left-0 right-0 grid grid-cols-[repeat(13,minmax(90px,1fr))] items-center gap-3 px-3 text-sm transition hover:bg-white/10 cursor-pointer",
                    virtualRow.index % 2 === 0 ? "bg-white/0" : "bg-white/5"
                  )}
                  onClick={() => setSelectedSymbol(row.original.symbol)}
                  style={{
                    top: 0,
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} role="gridcell" className="truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
