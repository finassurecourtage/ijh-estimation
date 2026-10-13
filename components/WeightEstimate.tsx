import type { Dictionary } from "@/lib/i18n";

interface WeightEstimateProps {
  totalKg: number;
  dict: Dictionary;
}

export function WeightEstimate({ totalKg, dict }: WeightEstimateProps) {
  if (totalKg <= 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
      <p className="text-xs uppercase tracking-wide text-steel-600 font-semibold">
        {dict.weightEstimate.label}
      </p>
      <p className="text-xl font-bold text-steel-900">{Math.round(totalKg)} kg</p>
    </div>
  );
}
