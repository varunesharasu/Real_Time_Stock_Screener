import type {
  BollingerPosition,
  MacdSignal,
  MarketCapCategory,
  Sector,
  Stock,
  VolumeVsAvg,
} from "../types";
import { clamp, normalRandom, randomBetween, randomFromArray, randomInt } from "./random";

const SECTOR_PROFILES: Record<
  Sector,
  { companies: string[]; avgPE: number; avgBeta: number; avgDividend: number }
> = {
  IT: {
    companies: ["TCS", "Infosys", "Wipro", "HCL Tech", "Tech Mahindra"],
    avgPE: 25,
    avgBeta: 0.85,
    avgDividend: 1.5,
  },
  Banking: {
    companies: ["HDFC Bank", "ICICI Bank", "SBI", "Kotak", "Axis Bank"],
    avgPE: 18.5,
    avgBeta: 1.1,
    avgDividend: 1.2,
  },
  Pharma: {
    companies: ["Sun Pharma", "Dr Reddy", "Cipla", "Divi Labs", "Aurobindo"],
    avgPE: 30,
    avgBeta: 0.7,
    avgDividend: 0.8,
  },
  Auto: {
    companies: ["Maruti", "Tata Motors", "M&M", "Bajaj Auto", "Eicher"],
    avgPE: 22,
    avgBeta: 1.05,
    avgDividend: 1,
  },
  FMCG: {
    companies: ["HUL", "ITC", "Nestle", "Britannia", "Dabur"],
    avgPE: 35,
    avgBeta: 0.6,
    avgDividend: 1.8,
  },
  Metal: {
    companies: ["Tata Steel", "JSW Steel", "Hindalco", "SAIL", "NMDC"],
    avgPE: 12,
    avgBeta: 1.4,
    avgDividend: 2.5,
  },
  Energy: {
    companies: ["Reliance", "ONGC", "NTPC", "Power Grid", "BPCL"],
    avgPE: 14,
    avgBeta: 0.95,
    avgDividend: 3,
  },
  Realty: {
    companies: ["DLF", "Godrej Prop", "Oberoi Realty", "Phoenix", "Prestige"],
    avgPE: 20,
    avgBeta: 1.3,
    avgDividend: 0.5,
  },
  Telecom: {
    companies: ["Bharti Airtel", "Vodafone Idea", "Tata Comm", "HFCL", "RailTel"],
    avgPE: 28,
    avgBeta: 0.9,
    avgDividend: 0.3,
  },
  Infrastructure: {
    companies: ["L&T", "IRB Infra", "NCC", "KEC", "Kalpataru"],
    avgPE: 18,
    avgBeta: 1.15,
    avgDividend: 1,
  },
  Media: {
    companies: ["Zee", "Sun TV", "PVR", "Inox", "Network18"],
    avgPE: 24,
    avgBeta: 1.1,
    avgDividend: 0.6,
  },
  Others: {
    companies: ["SRF", "Astral", "Cera", "Page", "Aarti"],
    avgPE: 16,
    avgBeta: 1,
    avgDividend: 1.2,
  },
};

const SECTOR_WEIGHTS: { sector: Sector; weight: number }[] = [
  { sector: "Banking", weight: 15 },
  { sector: "IT", weight: 12 },
  { sector: "Pharma", weight: 10 },
  { sector: "FMCG", weight: 8 },
  { sector: "Auto", weight: 7 },
  { sector: "Metal", weight: 6 },
  { sector: "Energy", weight: 6 },
  { sector: "Realty", weight: 7 },
  { sector: "Telecom", weight: 4 },
  { sector: "Infrastructure", weight: 8 },
  { sector: "Media", weight: 4 },
  { sector: "Others", weight: 10 },
];

const INDEX_MEMBERSHIP = [
  "NIFTY 50",
  "NIFTY Next 50",
  "NIFTY Midcap 100",
  "NIFTY Smallcap 250",
  "BSE Sensex",
];

const MARKET_CAP_WEIGHTS: { category: MarketCapCategory; weight: number }[] = [
  { category: "Large Cap", weight: 2 },
  { category: "Mid Cap", weight: 8 },
  { category: "Small Cap", weight: 30 },
  { category: "Micro Cap", weight: 60 },
];

export function generateMockStocks(count = 5000): Stock[] {
  const stocks: Stock[] = [];

  for (let i = 0; i < count; i += 1) {
    const sector = pickWeightedSector();
    const marketCapCategory = pickWeightedCategory();
    const marketCap = generateMarketCap(marketCapCategory);
    const profile = SECTOR_PROFILES[sector];

    const companyName = `${randomFromArray(profile.companies)} ${i + 1}`;
    const symbol = generateSymbol(companyName, i);

    const beta = generateBeta(marketCapCategory, profile.avgBeta);
    const promoterHolding = generatePromoterHolding(marketCapCategory);
    const revenueGrowthYoY = clamp(normalRandom() * 20 + 12, -40, 120);
    const profitGrowthYoY = clamp(revenueGrowthYoY + normalRandom() * 10, -60, 180);

    const pe = generatePE(profile.avgPE, revenueGrowthYoY);
    const pb = clamp(normalRandom() * 2 + 2.4, 0.2, 8);
    const dividendYield = clamp(profile.avgDividend + normalRandom() * 0.8, 0, 8);
    const eps = clamp(normalRandom() * 40 + 80, -100, 400);
    const roe = clamp(normalRandom() * 8 + 15, -10, 35);
    const roce = clamp(roe + normalRandom() * 5, -10, 40);
    const debtToEquity = generateDebtToEquity(sector);
    const currentRatio = clamp(normalRandom() * 1.2 + 1.4, 0.3, 8);

    const lastPrice = generatePrice(marketCapCategory, marketCap, pe ?? 18);
    const previousClose = lastPrice * (1 + normalRandom() * 0.015);
    const changeAbsolute = lastPrice - previousClose;
    const changePercent = (changeAbsolute / previousClose) * 100;

    const dayOpen = previousClose * (1 + normalRandom() * 0.006);
    const dayHigh = Math.max(dayOpen, lastPrice) * (1 + Math.abs(normalRandom()) * 0.01);
    const dayLow = Math.min(dayOpen, lastPrice) * (1 - Math.abs(normalRandom()) * 0.01);

    const avgVolume20D = generateAvgVolume(marketCapCategory);
    const volume = Math.round(avgVolume20D * (1 + Math.abs(changePercent) / 10));

    const week52High = lastPrice * (1 + randomBetween(0.08, 0.45));
    const week52Low = lastPrice * (1 - randomBetween(0.08, 0.45));
    const week52HighProximity = clamp(
      ((week52High - lastPrice) / week52High) * 100,
      0,
      100
    );
    const week52LowProximity = clamp(
      ((lastPrice - week52Low) / week52Low) * 100,
      0,
      100
    );

    const rsi14 = clamp(50 + changePercent * 2 + normalRandom() * 8, 10, 90);
    const sma50 = lastPrice * (1 - normalRandom() * 0.05);
    const sma200 = lastPrice * (1 - normalRandom() * 0.12);
    const atr = clamp(Math.abs(dayHigh - dayLow) * 0.8, 0.5, lastPrice * 0.2);

    const macdSignal = pickMacdSignal(changePercent);
    const bollingerPosition = pickBollingerPosition(lastPrice, sma50);
    const volumeVsAvg = pickVolumeVsAvg(volume, avgVolume20D);

    stocks.push({
      symbol,
      companyName,
      sector,
      industry: `${sector} Core`,
      marketCapCategory,
      indexMembership: assignIndices(marketCap),
      lastPrice: round2(lastPrice),
      previousClose: round2(previousClose),
      dayOpen: round2(dayOpen),
      dayHigh: round2(dayHigh),
      dayLow: round2(dayLow),
      changePercent: round2(changePercent),
      changeAbsolute: round2(changeAbsolute),
      volume,
      avgVolume20D,
      week52High: round2(week52High),
      week52Low: round2(week52Low),
      week52HighProximity: round2(week52HighProximity),
      week52LowProximity: round2(week52LowProximity),
      marketCap: round2(marketCap),
      pe: pe === null ? null : round2(pe),
      pb: round2(pb),
      dividendYield: round2(dividendYield),
      eps: round2(eps),
      roe: round2(roe),
      roce: round2(roce),
      debtToEquity: round2(debtToEquity),
      currentRatio: round2(currentRatio),
      promoterHolding: round2(promoterHolding),
      revenueGrowthYoY: round2(revenueGrowthYoY),
      profitGrowthYoY: round2(profitGrowthYoY),
      rsi14: round2(rsi14),
      sma50: round2(sma50),
      sma200: round2(sma200),
      beta: round2(beta),
      atr: round2(atr),
      macdSignal,
      bollingerPosition,
      volumeVsAvg,
      watchlist: false,
      recentlyUpdated: false,
    });
  }

  return stocks;
}

function pickWeightedSector(): Sector {
  const total = SECTOR_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  const roll = Math.random() * total;
  let cursor = 0;
  for (const item of SECTOR_WEIGHTS) {
    cursor += item.weight;
    if (roll <= cursor) {
      return item.sector;
    }
  }
  return SECTOR_WEIGHTS[SECTOR_WEIGHTS.length - 1].sector;
}

function pickWeightedCategory(): MarketCapCategory {
  const total = MARKET_CAP_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  const roll = Math.random() * total;
  let cursor = 0;
  for (const item of MARKET_CAP_WEIGHTS) {
    cursor += item.weight;
    if (roll <= cursor) {
      return item.category;
    }
  }
  return MARKET_CAP_WEIGHTS[MARKET_CAP_WEIGHTS.length - 1].category;
}

function generateMarketCap(category: MarketCapCategory): number {
  switch (category) {
    case "Large Cap":
      return randomBetween(50000, 2000000);
    case "Mid Cap":
      return randomBetween(10000, 49999);
    case "Small Cap":
      return randomBetween(1000, 9999);
    case "Micro Cap":
    default:
      return randomBetween(50, 999);
  }
}

function generatePrice(category: MarketCapCategory, marketCap: number, pe: number): number {
  const base = Math.sqrt(marketCap) * randomBetween(1.2, 2.1);
  const qualityBoost = pe ? Math.min(pe / 25, 2.5) : 1;
  const tierBoost =
    category === "Large Cap"
      ? 1.4
      : category === "Mid Cap"
        ? 1.1
        : category === "Small Cap"
          ? 0.9
          : 0.75;
  return clamp(base * qualityBoost * tierBoost, 12, 4500);
}

function generatePE(avgPE: number, revenueGrowthYoY: number): number | null {
  if (revenueGrowthYoY < -10 && Math.random() < 0.15) {
    return null;
  }
  const growthBoost = revenueGrowthYoY > 25 ? randomBetween(20, 60) : 0;
  const base = clamp(avgPE + normalRandom() * 6 + growthBoost, 4, 90);
  return Math.round(base * 10) / 10;
}

function generateBeta(category: MarketCapCategory, base: number): number {
  const range =
    category === "Large Cap"
      ? [0.5, 1.2]
      : category === "Mid Cap"
        ? [0.7, 1.6]
        : category === "Small Cap"
          ? [0.6, 2.0]
          : [0.3, 2.5];
  const value = base + normalRandom() * 0.2;
  return clamp(value, range[0], range[1]);
}

function generatePromoterHolding(category: MarketCapCategory): number {
  const range =
    category === "Large Cap"
      ? [40, 75]
      : category === "Mid Cap"
        ? [35, 80]
        : category === "Small Cap"
          ? [25, 85]
          : [20, 90];
  return clamp(randomBetween(range[0], range[1]) + normalRandom() * 3, range[0], range[1]);
}

function generateDebtToEquity(sector: Sector): number {
  if (sector === "Banking") {
    return clamp(randomBetween(5, 15) + normalRandom(), 4, 18);
  }
  if (sector === "IT" || sector === "FMCG") {
    return clamp(randomBetween(0, 0.6) + normalRandom() * 0.1, 0, 1);
  }
  if (sector === "Infrastructure" || sector === "Realty") {
    return clamp(randomBetween(0.5, 2) + normalRandom() * 0.2, 0.2, 3);
  }
  return clamp(randomBetween(0.4, 1.5) + normalRandom() * 0.2, 0, 3);
}

function generateAvgVolume(category: MarketCapCategory): number {
  if (category === "Large Cap") {
    return randomInt(2000000, 12000000);
  }
  if (category === "Mid Cap") {
    return randomInt(800000, 6000000);
  }
  if (category === "Small Cap") {
    return randomInt(150000, 2000000);
  }
  return randomInt(50000, 500000);
}

function pickMacdSignal(changePercent: number): MacdSignal {
  if (changePercent > 1.2) return "Bullish";
  if (changePercent < -1.2) return "Bearish";
  return "Neutral";
}

function pickBollingerPosition(lastPrice: number, sma50: number): BollingerPosition {
  if (lastPrice > sma50 * 1.04) return "Above";
  if (lastPrice < sma50 * 0.96) return "Below";
  return "Within";
}

function pickVolumeVsAvg(volume: number, avgVolume: number): VolumeVsAvg {
  const ratio = volume / avgVolume;
  if (ratio >= 3) return "3x";
  if (ratio >= 2) return "2x";
  if (ratio >= 1.05) return "Above";
  return "Below";
}

function assignIndices(marketCap: number): string[] {
  const memberships: string[] = [];
  if (marketCap > 50000 && Math.random() > 0.3) {
    memberships.push("NIFTY 50");
  }
  if (marketCap > 20000 && Math.random() > 0.5) {
    memberships.push("BSE Sensex");
  }
  if (marketCap > 10000 && Math.random() > 0.4) {
    memberships.push("NIFTY Midcap 100");
  }
  if (marketCap < 10000 && Math.random() > 0.6) {
    memberships.push("NIFTY Smallcap 250");
  }
  if (memberships.length === 0) {
    memberships.push(randomFromArray(INDEX_MEMBERSHIP));
  }
  return memberships;
}

function generateSymbol(companyName: string, index: number): string {
  const parts = companyName
    .replace(/[^A-Z0-9 ]/gi, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.slice(0, 2).toUpperCase());
  const seed = parts.join("");
  return `${seed}${String(index % 90).padStart(2, "0")}`.slice(0, 8);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
