import { estimatePrice } from "@/lib/pricing";
import type { Dictionary } from "@/lib/i18n";

interface PriceEstimateProps {
  totalM3: number;
  dict: Dictionary;
  intl: string;
}

function formatEuros(value: number, intl: string): string {
  return value.toLocaleString(intl, { maximumFractionDigits: 0 }) + " €";
}

export function PriceEstimate({ totalM3, dict, intl }: PriceEstimateProps) {
  if (totalM3 <= 0) return null;

  const { priceLow, priceHigh } = estimatePrice(totalM3);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-steel-600 font-semibold mb-1">
        {dict.priceEstimate.label}
      </p>
      <p className="text-2xl font-bold text-steel-900">
        {formatEuros(priceLow, intl)} – {formatEuros(priceHigh, intl)}
      </p>
      <p className="text-xs text-steel-600 mt-1">{dict.priceEstimate.disclaimer}</p>
    </div>
  );
}
