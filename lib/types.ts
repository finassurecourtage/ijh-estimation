export type PhotoStatus = "pending" | "analyzing" | "done" | "error";

export interface EstimatePhoto {
  id: string;
  /** Compressed JPEG as a data URL, used for preview and email attachment. */
  dataUrl: string;
  fileName: string;
  status: PhotoStatus;
  errorMessage?: string;
}

export interface EstimateObject {
  id: string;
  nom: string;
  quantite: number;
  volumeUnitaireM3: number;
  source: "ia" | "manuel";
}

export interface EstimateRoom {
  id: string;
  nom: string;
  objets: EstimateObject[];
  photos: EstimatePhoto[];
  remarqueIA?: string;
}

export interface ContactInfo {
  nom: string;
  telephone: string;
  email: string;
  villeDepart: string;
  dateSouhaitee: string;
  commentaire?: string;
}

export interface EstimateState {
  rooms: EstimateRoom[];
}

/** Raw shape returned by the vision analysis API for a single photo. */
export interface AnalyzePhotoResultObject {
  nom: string;
  quantite: number;
  volume_unitaire_m3: number;
}

export interface AnalyzePhotoResult {
  piece: string;
  objets: AnalyzePhotoResultObject[];
  remarque: string;
}
