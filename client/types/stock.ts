export type Sector =
  | "IT"
  | "Banking"
  | "Pharma"
  | "Auto"
  | "FMCG"
  | "Metal"
  | "Energy"
  | "Realty"
  | "Telecom"
  | "Infrastructure"
  | "Media"
  | "Others";

export type MarketCapCategory =
  | "Large Cap"
  | "Mid Cap"
  | "Small Cap"
  | "Micro Cap";

export type MacdSignal = "Bullish" | "Bearish" | "Neutral";
export type BollingerPosition = "Above" | "Within" | "Below";
export type VolumeVsAvg = "Below" | "Above" | "2x" | "3x";

export interface Stock {
  symbol: string;
  companyName: string;
  sector: Sector;
  industry: string;
  marketCapCategory: MarketCapCategory;
  indexMembership: string[];

  lastPrice: number;
  previousClose: number;
  dayOpen: number;
  dayHigh: number;
  dayLow: number;
  changePercent: number;
  changeAbsolute: number;
  volume: number;
  avgVolume20D: number;
  week52High: number;
  week52Low: number;
  week52HighProximity: number;
  week52LowProximity: number;

  marketCap: number;
  pe: number | null;
  pb: number;
  dividendYield: number;
  eps: number;
  roe: number;
  roce: number;
  debtToEquity: number;
  currentRatio: number;
  promoterHolding: number;
  revenueGrowthYoY: number;
  profitGrowthYoY: number;

  rsi14: number;
  sma50: number;
  sma200: number;
  beta: number;
  atr: number;
  macdSignal: MacdSignal;
  bollingerPosition: BollingerPosition;
  volumeVsAvg: VolumeVsAvg;

  watchlist: boolean;
  recentlyUpdated: boolean;
}

export interface PriceData {
  symbol: string;
  lastPrice: number;
  changePercent: number;
  changeAbsolute: number;
  updatedAt: number;
}

export interface PriceUpdate {
  symbol: string;
  lastPrice: number;
  previousClose: number;
  volume?: number;
  timestamp: number;
}
