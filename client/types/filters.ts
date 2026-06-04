import type { Stock } from "./stock";

export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in"
  | "notIn"
  | "contains"
  | "startsWith";

export type FilterValue =
  | number
  | string
  | boolean
  | [number, number]
  | number[]
  | string[];

export interface FilterConfig {
  id: string;
  field: keyof Stock;
  operator: FilterOperator;
  value: FilterValue;
  enabled: boolean;
}

export type FilterGroup = {
  id: string;
  type: "and" | "or";
  children: FilterNode[];
};

export type FilterNode = FilterGroup | FilterConfig;

export interface SortConfig {
  column: keyof Stock;
  direction: "asc" | "desc";
}
