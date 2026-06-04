import { NextResponse } from "next/server";
import { createApiResponse } from "../../../lib/apiResponse";

const SECTOR_TREE = [
  { sector: "IT", industries: ["IT Core", "Software Services", "Cloud", "AI"] },
  {
    sector: "Banking",
    industries: ["Private Banks", "Public Banks", "NBFC", "Fintech"],
  },
  {
    sector: "Pharma",
    industries: ["Formulations", "API", "Biotech", "Healthcare Services"],
  },
  { sector: "Auto", industries: ["OEM", "Auto Components", "EV", "Logistics"] },
  { sector: "FMCG", industries: ["Packaged Foods", "Home Care", "Beverages"] },
  { sector: "Metal", industries: ["Steel", "Aluminium", "Mining"] },
  { sector: "Energy", industries: ["Oil & Gas", "Power", "Renewables"] },
  { sector: "Realty", industries: ["Residential", "Commercial", "REITs"] },
  { sector: "Telecom", industries: ["Telecom", "Fiber", "Satellite"] },
  { sector: "Infrastructure", industries: ["Capital Goods", "Construction"] },
  { sector: "Media", industries: ["Broadcast", "Streaming", "Gaming"] },
  { sector: "Others", industries: ["Chemicals", "Textiles", "Misc"] },
];

export async function GET() {
  const start = performance.now();
  return NextResponse.json(
    createApiResponse(SECTOR_TREE, {
      total: SECTOR_TREE.length,
      page: 1,
      pageSize: SECTOR_TREE.length,
      executionTimeMs: Math.round(performance.now() - start),
    })
  );
}
