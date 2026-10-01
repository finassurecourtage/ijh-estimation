import { estimatePrice } from "@/lib/pricing";

interface PriceEstimateProps {
  totalM3: number;
}

function formatEuros(value: number): string {
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

export function PriceEstimate({ totalM3 }: PriceEstimateProps) {
  if (totalM3 <= 0) return null;

  const { priceLow, priceHigh } = estimatePrice(totalM3);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-steel-600 font-semibold mb-1">
        Budget transport estimé
      </p>
      <p className="text-2xl font-bold text-steel-900">
        {formatEuros(priceLow)} – {formatEuros(priceHigh)}
      </p>
      <p className="text-xs text-steel-600 mt-1">
        Tarif indicatif groupage maritime France → Israël, porte à porte. Hors
        assurance et formalités douanières. Devis définitif établi par IJH
        Transport.
      </p>
    </div>
  );
}
