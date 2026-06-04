import type { Stock } from "../types";
import { generateMockStocks } from "./mockDataGenerator";

const CACHE_TTL = 5 * 60 * 1000;
let cache: { data: Stock[]; timestamp: number } | null = null;

export function getStockUniverse(): Stock[] {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }
  const data = generateMockStocks(5000);
  cache = { data, timestamp: Date.now() };
  return data;
}
