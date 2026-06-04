import { NextResponse } from "next/server";
import { createApiResponse } from "../../../../../lib/apiResponse";
import { generateOHLCV } from "../../../../../lib/ohlcvGenerator";
import { getStockUniverse } from "../../../../../lib/stockCache";

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
        data: [],
        meta: {
          total: 0,
          page: 1,
          pageSize: 0,
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

  const candles = generateOHLCV(stock.lastPrice, 252, 0.02, stock.avgVolume20D);

  return NextResponse.json(
    createApiResponse(candles, {
      total: candles.length,
      page: 1,
      pageSize: candles.length,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
