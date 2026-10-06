import { CONTAINER_20_PIEDS_M3, CONTAINER_40_PIEDS_M3 } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";

interface VolumeGaugeProps {
  totalM3: number;
  dict: Dictionary;
}

function ContainerBar({
  label,
  capacity,
  totalM3,
  usableSuffix,
}: {
  label: string;
  capacity: number;
  totalM3: number;
  usableSuffix: string;
}) {
  const ratio = totalM3 / capacity;
  const pct = Math.min(100, Math.round(ratio * 100));
  const overflow = ratio > 1;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between text-xs mb-1">
        <span className="font-medium text-white/90">{label}</span>
        <span className={overflow ? "text-danger font-semibold" : "text-signal font-semibold"}>
          {Math.round(ratio * 100)}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-white/15 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: overflow ? "var(--danger)" : "var(--signal-yellow)",
          }}
        />
      </div>
      <p className="text-[11px] text-steel-100/70 mt-0.5">
        {capacity} {usableSuffix}
      </p>
    </div>
  );
}

export function VolumeGauge({ totalM3, dict }: VolumeGaugeProps) {
  return (
    <div className="bg-steel-700 text-white rounded-xl p-4 shadow-md">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-steel-100/80">
            {dict.volumeGauge.totalLabel}
          </p>
          <p className="text-3xl font-bold leading-tight">
            {totalM3.toFixed(2)} <span className="text-lg font-medium">m³</span>
          </p>
        </div>
      </div>
      <div className="flex gap-4 bg-steel-800/60 rounded-lg p-3">
        <ContainerBar
          label={dict.volumeGauge.container20}
          capacity={CONTAINER_20_PIEDS_M3}
          totalM3={totalM3}
          usableSuffix={dict.volumeGauge.usableSuffix}
        />
        <ContainerBar
          label={dict.volumeGauge.container40}
          capacity={CONTAINER_40_PIEDS_M3}
          totalM3={totalM3}
          usableSuffix={dict.volumeGauge.usableSuffix}
        />
      </div>
    </div>
  );
}
