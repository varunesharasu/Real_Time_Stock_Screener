import type { OHLCV } from "../types";
import { normalRandom, randomBetween } from "./random";

export function generateOHLCV(
  startPrice: number,
  days = 252,
  volatility = 0.02,
  avgVolume = 1000000
): OHLCV[] {
  const candles: OHLCV[] = [];
  let currentPrice = startPrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i += 1) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }

    const dailyReturn = normalRandom() * volatility;
    const open = currentPrice;
    const intraday1 = open * (1 + normalRandom() * volatility * 0.5);
    const intraday2 = open * (1 + normalRandom() * volatility * 0.5);
    const close = open * (1 + dailyReturn);
    const high = Math.max(open, close, intraday1, intraday2) * (1 + Math.abs(normalRandom()) * 0.005);
    const low = Math.min(open, close, intraday1, intraday2) * (1 - Math.abs(normalRandom()) * 0.005);

    const volumeMultiplier = 1 + Math.abs(dailyReturn) * 10;
    const volume = Math.round(avgVolume * volumeMultiplier * randomBetween(0.5, 1.2));

    candles.push({
      time: Math.floor(date.getTime() / 1000),
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
      volume,
    });

    currentPrice = close;
  }

  return candles;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
