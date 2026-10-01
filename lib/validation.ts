import { MAX_VOLUME_M3, MIN_VOLUME_M3 } from "./constants";
import type { AnalyzePhotoResult, AnalyzePhotoResultObject } from "./types";

/**
 * Nettoie et valide le JSON renvoyé par le modèle : quantités entières >= 1,
 * volumes bornés entre MIN_VOLUME_M3 et MAX_VOLUME_M3, noms non vides.
 * Ne jamais faire confiance aux valeurs brutes du modèle avant affichage/email.
 */
export function sanitizeAnalyzeResult(raw: unknown): AnalyzePhotoResult {
  const r = raw as Partial<AnalyzePhotoResult> | null;
  const piece = typeof r?.piece === "string" && r.piece.trim() ? r.piece.trim() : "Pièce";
  const remarque = typeof r?.remarque === "string" ? r.remarque.trim() : "";

  const objetsRaw = Array.isArray(r?.objets) ? r.objets : [];
  const objets: AnalyzePhotoResultObject[] = [];

  for (const o of objetsRaw) {
    const nom = typeof o?.nom === "string" ? o.nom.trim() : "";
    if (!nom) continue;

    const quantiteBrute = Number(o?.quantite);
    const quantite = Number.isFinite(quantiteBrute)
      ? Math.max(1, Math.round(quantiteBrute))
      : 1;

    const volumeBrut = Number(o?.volume_unitaire_m3);
    const volume_unitaire_m3 = Number.isFinite(volumeBrut)
      ? clamp(roundToHundredth(volumeBrut), MIN_VOLUME_M3, MAX_VOLUME_M3)
      : 0.1;

    objets.push({ nom, quantite, volume_unitaire_m3 });
  }

  return { piece, objets, remarque };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundToHundredth(value: number): number {
  return Math.round(value * 100) / 100;
}
