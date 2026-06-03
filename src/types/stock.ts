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
  | "Infrastructure";

export interface Stock {
  symbol: string;
  companyName: string;

  sector: Sector;
  industry: string;

  marketCap: number;

  price: number;

  pe: number;
  pb: number;
  eps: number;

  roe: number;
  roce: number;

  debtToEquity: number;

  dividendYield: number;

  revenueGrowth: number;
  profitGrowth: number;

  promoterHolding: number;

  volume: number;
  avgVolume20d: number;

  beta: number;

  dayChange: number;

  high52Week: number;
  low52Week: number;

  rsi14: number;

  atr: number;

  sma50: number;
  sma200: number;

  updatedAt: number;
}