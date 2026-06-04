import type { Stock } from "../types";
import { normalRandom } from "./random";

export function simulateNextPrice(
  currentPrice: number,
  volatility = 0.02,
  drift = 0.0001,
  dt = 1 / 252
): number {
  const randomShock = Math.sqrt(dt) * normalRandom();
  const priceChange = drift * dt + volatility * randomShock;
  return currentPrice * (1 + priceChange);
}

export function simulateSectorMovement(
  stocks: Stock[],
  sectorCorrelation = 0.6
): Map<string, number> {
  const sectorShock = normalRandom();
  const updates = new Map<string, number>();

  for (const stock of stocks) {
    const idiosyncratic = normalRandom();
    const combinedShock =
      sectorCorrelation * sectorShock +
      Math.sqrt(1 - sectorCorrelation ** 2) * idiosyncratic;
    const updatedPrice = stock.lastPrice * (1 + combinedShock * stock.beta * 0.01);
    updates.set(stock.symbol, updatedPrice);
  }

  return updates;
}
