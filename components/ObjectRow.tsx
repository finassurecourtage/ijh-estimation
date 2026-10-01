import type { EstimateObject } from "@/lib/types";

interface ObjectRowProps {
  object: EstimateObject;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function ObjectRow({ object, onIncrement, onDecrement, onRemove }: ObjectRowProps) {
  const sousTotal = object.quantite * object.volumeUnitaireM3;

  return (
    <div className="flex items-center gap-2 py-2 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{object.nom}</p>
        <p className="text-xs text-steel-600">
          {object.volumeUnitaireM3} m³ / unité · {sousTotal.toFixed(2)} m³
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDecrement}
          aria-label={`Diminuer la quantité de ${object.nom}`}
          className="w-8 h-8 rounded-full bg-steel-100 text-steel-700 text-lg font-bold flex items-center justify-center active:scale-95 transition-transform"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums">
          {object.quantite}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          aria-label={`Augmenter la quantité de ${object.nom}`}
          className="w-8 h-8 rounded-full bg-steel-100 text-steel-700 text-lg font-bold flex items-center justify-center active:scale-95 transition-transform"
        >
          +
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Supprimer ${object.nom}`}
          className="w-8 h-8 rounded-full text-danger flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
