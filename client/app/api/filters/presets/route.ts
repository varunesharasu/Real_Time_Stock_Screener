import { NextResponse } from "next/server";
import { createApiResponse } from "../../../../lib/apiResponse";

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Array<{ field: string; operator: string; value: unknown }>;
}

const PRESETS: FilterPreset[] = [
  {
    id: "value-stocks",
    name: "Value Stocks",
    description: "Low P/E, strong ROE, low leverage, steady yield.",
    filters: [
      { field: "pe", operator: "lt", value: 15 },
      { field: "roe", operator: "gt", value: 15 },
      { field: "debtToEquity", operator: "lt", value: 0.5 },
      { field: "dividendYield", operator: "gt", value: 2 },
    ],
  },
  {
    id: "growth-momentum",
    name: "Growth Momentum",
    description: "Rising growth with healthy momentum signals.",
    filters: [
      { field: "revenueGrowthYoY", operator: "gt", value: 20 },
      { field: "profitGrowthYoY", operator: "gt", value: 20 },
      { field: "rsi14", operator: "between", value: [40, 70] },
      { field: "sma50", operator: "lt", value: 999999 },
    ],
  },
  {
    id: "large-cap-quality",
    name: "Large Cap Quality",
    description: "Quality large caps with solid efficiency ratios.",
    filters: [
      { field: "marketCap", operator: "gt", value: 20000 },
      { field: "roce", operator: "gt", value: 15 },
      { field: "promoterHolding", operator: "gt", value: 50 },
    ],
  },
  {
    id: "technical-breakout",
    name: "Technical Breakout",
    description: "Trend alignment with expanding volume.",
    filters: [
      { field: "sma200", operator: "lt", value: 999999 },
      { field: "rsi14", operator: "between", value: [50, 70] },
      { field: "volumeVsAvg", operator: "eq", value: "2x" },
      { field: "bollingerPosition", operator: "eq", value: "Within" },
    ],
  },
];

export async function GET() {
  const start = performance.now();
  return NextResponse.json(
    createApiResponse(PRESETS, {
      total: PRESETS.length,
      page: 1,
      pageSize: PRESETS.length,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}

export async function POST(request: Request) {
  const start = performance.now();
  const payload = (await request.json()) as Omit<FilterPreset, "id">;
  const preset: FilterPreset = {
    ...payload,
    id: `preset-${Date.now()}`,
  };
  PRESETS.push(preset);

  return NextResponse.json(
    createApiResponse(preset, {
      total: PRESETS.length,
      page: 1,
      pageSize: PRESETS.length,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
