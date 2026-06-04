import { NextResponse } from "next/server";
import { createApiResponse } from "../../../../lib/apiResponse";
import { getStockUniverse } from "../../../../lib/stockCache";

export async function GET(
  _request: Request,
  { params }: { params: { symbol: string } }
) {
  const start = performance.now();
  const stocks = getStockUniverse();
  const stock = stocks.find(
    (item) => item.symbol.toLowerCase() === params.symbol.toLowerCase()
  );

  if (!stock) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        meta: {
          total: stocks.length,
          page: 1,
          pageSize: stocks.length,
          timestamp: new Date().toISOString(),
          executionTimeMs: Math.round(performance.now() - start),
        },
        error: {
          code: "NOT_FOUND",
          message: "Stock symbol not found.",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    createApiResponse(stock, {
      total: 1,
      page: 1,
      pageSize: 1,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
