import { NextResponse } from "next/server";
import { createApiResponse } from "../../../lib/apiResponse";
import { getStockUniverse } from "../../../lib/stockCache";

export async function GET(request: Request) {
  const start = performance.now();
  const { searchParams } = new URL(request.url);
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "5000", 10);

  const stocks = getStockUniverse();

  const startIndex = Math.max(page - 1, 0) * pageSize;
  const paginated = stocks.slice(startIndex, startIndex + pageSize);

  return NextResponse.json(
    createApiResponse(paginated, {
      total: stocks.length,
      page,
      pageSize,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
