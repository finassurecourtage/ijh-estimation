"use client";

import { useCallback, useEffect, useState } from "react";
import { generateId } from "@/lib/id";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import type {
  AnalyzePhotoResult,
  EstimateObject,
  EstimatePhoto,
  EstimateRoom,
  EstimateState,
} from "@/lib/types";

const EMPTY_STATE: EstimateState = { rooms: [] };

function loadFromStorage(): EstimateState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as EstimateState;
    if (!parsed || !Array.isArray(parsed.rooms)) return EMPTY_STATE;
    return parsed;
  } catch {
    return EMPTY_STATE;
  }
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function useEstimate() {
  const [state, setState] = useState<EstimateState>(EMPTY_STATE);
  // État (et non une ref) : doit participer au même cycle de rendu que `state`
  // pour que l'effet de sauvegarde ci-dessous ne voie jamais une valeur de
  // `state` périmée pendant qu'il lit un flag déjà à jour (sinon on risque
  // d'écraser le localStorage avec l'état vide initial avant l'hydratation,
  // en particulier avec le double rendu du Strict Mode en développement).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydratation depuis localStorage après le montage, pour éviter tout
    // mismatch de rendu serveur/client (le serveur n'a pas accès au storage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Stockage plein ou indisponible (navigation privée) : on continue sans persister.
    }
  }, [state, hydrated]);

  const addRoom = useCallback((nom: string) => {
    const room: EstimateRoom = { id: generateId(), nom, objets: [], photos: [] };
    setState((prev) => ({ rooms: [...prev.rooms, room] }));
    return room.id;
  }, []);

  const removeRoom = useCallback((roomId: string) => {
    setState((prev) => ({ rooms: prev.rooms.filter((r) => r.id !== roomId) }));
  }, []);

  const renameRoom = useCallback((roomId: string, nom: string) => {
    setState((prev) => ({
      rooms: prev.rooms.map((r) => (r.id === roomId ? { ...r, nom } : r)),
    }));
  }, []);

  const addPendingPhoto = useCallback(
    (roomId: string, dataUrl: string, fileName: string) => {
      const photo: EstimatePhoto = {
        id: generateId(),
        dataUrl,
        fileName,
        status: "pending",
      };
      setState((prev) => ({
        rooms: prev.rooms.map((r) =>
          r.id === roomId ? { ...r, photos: [...r.photos, photo] } : r,
        ),
      }));
      return photo.id;
    },
    [],
  );

  const setPhotoStatus = useCallback(
    (roomId: string, photoId: string, status: EstimatePhoto["status"], errorMessage?: string) => {
      setState((prev) => ({
        rooms: prev.rooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                photos: r.photos.map((p) =>
                  p.id === photoId ? { ...p, status, errorMessage } : p,
                ),
              }
            : r,
        ),
      }));
    },
    [],
  );

  const removePhoto = useCallback((roomId: string, photoId: string) => {
    setState((prev) => ({
      rooms: prev.rooms.map((r) =>
        r.id === roomId
          ? { ...r, photos: r.photos.filter((p) => p.id !== photoId) }
          : r,
      ),
    }));
  }, []);

  /** Fusionne le résultat d'analyse IA dans la pièce : additionne les quantités des objets déjà présents (par nom). */
  const mergeAnalysisIntoRoom = useCallback(
    (roomId: string, analysis: AnalyzePhotoResult) => {
      setState((prev) => ({
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const objets = [...r.objets];
          for (const o of analysis.objets) {
            const existing = objets.find(
              (existingObj) =>
                existingObj.source === "ia" &&
                normalizeName(existingObj.nom) === normalizeName(o.nom),
            );
            if (existing) {
              existing.quantite += o.quantite;
            } else {
              objets.push({
                id: generateId(),
                nom: o.nom,
                quantite: o.quantite,
                volumeUnitaireM3: o.volume_unitaire_m3,
                source: "ia",
              });
            }
          }
          return { ...r, objets, remarqueIA: analysis.remarque || r.remarqueIA };
        }),
      }));
    },
    [],
  );

  const addManualObject = useCallback(
    (roomId: string, nom: string, volumeUnitaireM3: number) => {
      setState((prev) => ({
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const existing = r.objets.find(
            (o) => o.source === "manuel" && normalizeName(o.nom) === normalizeName(nom),
          );
          if (existing) {
            return {
              ...r,
              objets: r.objets.map((o) =>
                o.id === existing.id ? { ...o, quantite: o.quantite + 1 } : o,
              ),
            };
          }
          const newObject: EstimateObject = {
            id: generateId(),
            nom,
            quantite: 1,
            volumeUnitaireM3,
            source: "manuel",
          };
          return { ...r, objets: [...r.objets, newObject] };
        }),
      }));
    },
    [],
  );

  const updateObjectQuantity = useCallback(
    (roomId: string, objectId: string, delta: number) => {
      setState((prev) => ({
        rooms: prev.rooms.map((r) => {
          if (r.id !== roomId) return r;
          const objets = r.objets
            .map((o) =>
              o.id === objectId ? { ...o, quantite: o.quantite + delta } : o,
            )
            .filter((o) => o.quantite > 0);
          return { ...r, objets };
        }),
      }));
    },
    [],
  );

  const removeObject = useCallback((roomId: string, objectId: string) => {
    setState((prev) => ({
      rooms: prev.rooms.map((r) =>
        r.id === roomId
          ? { ...r, objets: r.objets.filter((o) => o.id !== objectId) }
          : r,
      ),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState(EMPTY_STATE);
  }, []);

  return {
    rooms: state.rooms,
    addRoom,
    removeRoom,
    renameRoom,
    addPendingPhoto,
    setPhotoStatus,
    removePhoto,
    mergeAnalysisIntoRoom,
    addManualObject,
    updateObjectQuantity,
    removeObject,
    clearAll,
  };
}
