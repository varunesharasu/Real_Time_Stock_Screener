import { NextResponse } from "next/server";
import { createApiResponse } from "../../../lib/apiResponse";
import { getStockUniverse } from "../../../lib/stockCache";

const INDEX_LIST = [
  { name: "NIFTY 50", size: 50 },
  { name: "NIFTY Next 50", size: 50 },
  { name: "NIFTY Midcap 100", size: 100 },
  { name: "NIFTY Smallcap 250", size: 250 },
  { name: "BSE Sensex", size: 30 },
];

export async function GET() {
  const start = performance.now();
  const stocks = getStockUniverse();
  const sorted = [...stocks].sort((a, b) => b.marketCap - a.marketCap);

  const indices = INDEX_LIST.map((index) => ({
    name: index.name,
    constituents: sorted.slice(0, index.size).map((stock) => stock.symbol),
  }));

  return NextResponse.json(
    createApiResponse(indices, {
      total: indices.length,
      page: 1,
      pageSize: indices.length,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
