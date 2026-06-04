"use client";

import { useMemo } from "react";
import clsx from "clsx";
import type { FilterConfig } from "../../types";
import { FILTER_DEFINITIONS } from "../../lib/filterDefinitions";
import { useStockStore } from "../../stores/stockStore";

interface FilterPanelProps {
  totalCount: number;
  filteredCount: number;
}

export function FilterPanel({ totalCount, filteredCount }: FilterPanelProps) {
  const filters = useStockStore((state) => state.activeFilters);
  const setFilter = useStockStore((state) => state.setFilter);
  const clearAll = useStockStore((state) => state.clearAllFilters);

  const grouped = useMemo(() => {
    return FILTER_DEFINITIONS.reduce<Record<string, typeof FILTER_DEFINITIONS>>(
      (acc, def) => {
        acc[def.category] = acc[def.category] ?? [];
        acc[def.category].push(def);
        return acc;
      },
      {}
    );
  }, []);

  const filterMap = useMemo(() => {
    return new Map(filters.map((filter) => [filter.id, filter]));
  }, [filters]);

  const updateFilter = (next: FilterConfig) => {
    setFilter(next);
  };

  return (
    <aside className="glass-panel w-full max-w-[320px] rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-ink-400">Filters</p>
          <h2 className="text-xl font-semibold text-ink-50">Filter Forge</h2>
          <p className="mt-1 text-sm text-ink-300">
            Showing {filteredCount} of {totalCount} stocks
          </p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-ink-300 transition hover:border-brand-400 hover:text-ink-50"
        >
          Clear All
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {Object.entries(grouped).map(([category, definitions]) => (
          <section key={category} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
              {category}
            </h3>
            <div className="space-y-4">
              {definitions.map((definition) => (
                <FilterRow
                  key={definition.id}
                  definition={definition}
                  activeFilter={filterMap.get(definition.id)}
                  onChange={updateFilter}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}

interface FilterRowProps {
  definition: (typeof FILTER_DEFINITIONS)[number];
  activeFilter?: FilterConfig;
  onChange: (filter: FilterConfig) => void;
}

function FilterRow({ definition, activeFilter, onChange }: FilterRowProps) {
  const baseFilter: FilterConfig = {
    id: definition.id,
    field: definition.field,
    operator: definition.operator,
    value:
      definition.kind === "range"
        ? [definition.min ?? 0, definition.max ?? 100]
        : definition.kind === "boolean"
          ? false
          : definition.options?.[0] ?? "",
    enabled: true,
  };

  if (definition.kind === "range") {
    const value = (activeFilter?.value ?? baseFilter.value) as [number, number];
    return (
      <div className="rounded-xl border border-white/5 bg-surface-900 p-3">
        <label className="text-xs font-semibold text-ink-300">{definition.label}</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            value={value[0]}
            min={definition.min}
            max={definition.max}
            onChange={(event) =>
              onChange({
                ...baseFilter,
                value: [Number(event.target.value), value[1]],
                enabled: true,
              })
            }
            className="w-full rounded-lg border border-white/10 bg-surface-800 px-2 py-1 text-xs text-ink-100"
          />
          <input
            type="number"
            value={value[1]}
            min={definition.min}
            max={definition.max}
            onChange={(event) =>
              onChange({
                ...baseFilter,
                value: [value[0], Number(event.target.value)],
                enabled: true,
              })
            }
            className="w-full rounded-lg border border-white/10 bg-surface-800 px-2 py-1 text-xs text-ink-100"
          />
        </div>
      </div>
    );
  }

  if (definition.kind === "boolean") {
    const value = (activeFilter?.value ?? false) as boolean;
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-surface-900 px-3 py-2">
        <span className="text-xs font-semibold text-ink-300">{definition.label}</span>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...baseFilter,
              value: !value,
              enabled: !value,
            })
          }
          className={clsx(
            "h-6 w-11 rounded-full border border-white/10 p-1 transition",
            value ? "bg-brand-500" : "bg-surface-800"
          )}
        >
          <span
            className={clsx(
              "block h-4 w-4 rounded-full bg-white transition",
              value && "translate-x-5"
            )}
          />
        </button>
      </div>
    );
  }

  if (definition.kind === "multi") {
    const value = (activeFilter?.value ?? []) as string[];
    return (
      <div className="rounded-xl border border-white/5 bg-surface-900 p-3">
        <label className="text-xs font-semibold text-ink-300">{definition.label}</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {definition.options?.map((option) => {
            const active = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  const next = active
                    ? value.filter((item) => item !== option)
                    : [...value, option];
                  onChange({
                    ...baseFilter,
                    value: next,
                    enabled: next.length > 0,
                  });
                }}
                className={clsx(
                  "rounded-full border px-2 py-1 text-xs transition",
                  active
                    ? "border-brand-400 bg-brand-500/20 text-ink-50"
                    : "border-white/10 text-ink-300 hover:border-brand-300"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const value = (activeFilter?.value ?? definition.options?.[0] ?? "") as string;
  return (
    <div className="rounded-xl border border-white/5 bg-surface-900 p-3">
      <label className="text-xs font-semibold text-ink-300">{definition.label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {definition.options?.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange({
                  ...baseFilter,
                  value: option,
                  enabled: true,
                })
              }
              className={clsx(
                "rounded-full border px-2 py-1 text-xs transition",
                active
                  ? "border-brand-400 bg-brand-500/20 text-ink-50"
                  : "border-white/10 text-ink-300 hover:border-brand-300"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
