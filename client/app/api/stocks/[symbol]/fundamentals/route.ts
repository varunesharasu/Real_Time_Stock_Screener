import { NextResponse } from "next/server";
import { createApiResponse } from "../../../../../lib/apiResponse";
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
        data: null,
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

  const fundamentals = {
    symbol: stock.symbol,
    companyName: stock.companyName,
    ratios: {
      pe: stock.pe,
      pb: stock.pb,
      roe: stock.roe,
      roce: stock.roce,
      eps: stock.eps,
      dividendYield: stock.dividendYield,
    },
    balanceSheet: {
      debtToEquity: stock.debtToEquity,
      currentRatio: stock.currentRatio,
    },
    ownership: {
      promoterHolding: stock.promoterHolding,
    },
    growth: {
      revenueGrowthYoY: stock.revenueGrowthYoY,
      profitGrowthYoY: stock.profitGrowthYoY,
    },
  };

  return NextResponse.json(
    createApiResponse(fundamentals, {
      total: 1,
      page: 1,
      pageSize: 1,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
