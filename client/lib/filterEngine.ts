import type { FilterConfig, FilterGroup, FilterNode, SortConfig } from "../types";
import type { Stock } from "../types";

export function filterStocks(
  stocks: Stock[],
  filters: FilterNode[],
  sortConfig?: SortConfig
): Stock[] {
  if (!filters.length) {
    return sortStocks(stocks, sortConfig);
  }

  const predicate = buildGroupPredicate({
    id: "root",
    type: "and",
    children: optimizeFilters(filters),
  });

  const filtered = stocks.filter((stock) => predicate(stock));
  return sortStocks(filtered, sortConfig);
}

function sortStocks(stocks: Stock[], sortConfig?: SortConfig): Stock[] {
  if (!sortConfig) return stocks;
  const { column, direction } = sortConfig;
  const multiplier = direction === "asc" ? 1 : -1;
  return [...stocks].sort((a, b) => {
    const aVal = a[column];
    const bVal = b[column];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * multiplier;
    }
    return String(aVal).localeCompare(String(bVal)) * multiplier;
  });
}

function buildGroupPredicate(group: FilterGroup): (stock: Stock) => boolean {
  const predicates = group.children.map((node) =>
    isGroup(node) ? buildGroupPredicate(node) : buildLeafPredicate(node)
  );

  return (stock) => {
    if (group.type === "and") {
      for (const predicate of predicates) {
        if (!predicate(stock)) return false;
      }
      return true;
    }

    for (const predicate of predicates) {
      if (predicate(stock)) return true;
    }
    return false;
  };
}

function buildLeafPredicate(filter: FilterConfig): (stock: Stock) => boolean {
  if (!filter.enabled) return () => true;

  return (stock) => {
    if (filter.id === "priceVsSma50") {
      const mode = String(filter.value);
      return mode === "Above" ? stock.lastPrice > stock.sma50 : stock.lastPrice < stock.sma50;
    }
    if (filter.id === "priceVsSma200") {
      const mode = String(filter.value);
      return mode === "Above" ? stock.lastPrice > stock.sma200 : stock.lastPrice < stock.sma200;
    }

    const value = stock[filter.field];
    if (value === null || value === undefined) return false;

    if (Array.isArray(value)) {
      if (filter.operator === "contains") {
        const list = Array.isArray(filter.value) ? filter.value : [filter.value];
        return list.some((item) => value.includes(item as string));
      }
      if (filter.operator === "in") {
        const list = filter.value as Array<string | number>;
        return list.some((item) => value.includes(item as string));
      }
    }

    switch (filter.operator) {
      case "eq":
        return value === filter.value;
      case "neq":
        return value !== filter.value;
      case "gt":
        return Number(value) > Number(filter.value);
      case "gte":
        return Number(value) >= Number(filter.value);
      case "lt":
        return Number(value) < Number(filter.value);
      case "lte":
        return Number(value) <= Number(filter.value);
      case "between": {
        const [min, max] = filter.value as [number, number];
        return Number(value) >= min && Number(value) <= max;
      }
      case "in": {
        const set = new Set(filter.value as Array<string | number>);
        return set.has(value as string | number);
      }
      case "notIn": {
        const set = new Set(filter.value as Array<string | number>);
        return !set.has(value as string | number);
      }
      case "contains":
        return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
      case "startsWith":
        return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
      default:
        return true;
    }
  };
}

function optimizeFilters(filters: FilterNode[]): FilterNode[] {
  return [...filters].sort((a, b) => filterWeight(a) - filterWeight(b));
}

function filterWeight(node: FilterNode): number {
  if (isGroup(node)) {
    return node.children.reduce((total, child) => total + filterWeight(child), 0);
  }

  switch (node.operator) {
    case "between":
    case "gt":
    case "gte":
    case "lt":
    case "lte":
      return 1;
    case "eq":
    case "neq":
      return 2;
    case "in":
    case "notIn":
      return 3;
    case "contains":
    case "startsWith":
      return 4;
    default:
      return 5;
  }
}

function isGroup(node: FilterNode): node is FilterGroup {
  return (node as FilterGroup).children !== undefined;
}
