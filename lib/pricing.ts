/**
 * Tarif de référence pour un transport maritime groupage (LCL) France -> Israël,
 * porte à porte, calibré sur des devis réels du marché. Hors assurance et
 * formalités douanières. A ajuster depuis la grille tarifaire propre à IJH
 * Transport dès qu'elle est disponible.
 */
export const PRICE_BASE_VOLUME_M3 = 20;
export const PRICE_BASE_EUR = 6360;
export const PRICE_PER_EXTRA_M3_EUR = 290;

export interface PriceEstimate {
  price: number;
  priceLow: number;
  priceHigh: number;
}

function priceForVolume(volumeM3: number): number {
  if (volumeM3 <= 0) return 0;
  if (volumeM3 <= PRICE_BASE_VOLUME_M3) {
    return (PRICE_BASE_EUR / PRICE_BASE_VOLUME_M3) * volumeM3;
  }
  return PRICE_BASE_EUR + (volumeM3 - PRICE_BASE_VOLUME_M3) * PRICE_PER_EXTRA_M3_EUR;
}

function roundToTen(value: number): number {
  return Math.round(value / 10) * 10;
}

/** Fourchette de prix dérivée de la même incertitude de ±20 % appliquée au volume. */
export function estimatePrice(volumeM3: number): PriceEstimate {
  return {
    price: roundToTen(priceForVolume(volumeM3)),
    priceLow: roundToTen(priceForVolume(volumeM3 * 0.8)),
    priceHigh: roundToTen(priceForVolume(volumeM3 * 1.2)),
  };
}
