/** Volume utile indicatif des conteneurs maritimes standards, en m3. */
export const CONTAINER_20_PIEDS_M3 = 28;
export const CONTAINER_40_PIEDS_M3 = 58;

export const MAX_PHOTOS_PER_HOUR_PER_IP = 30;
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8 Mo avant compression client

export const MIN_VOLUME_M3 = 0.01;
export const MAX_VOLUME_M3 = 10;

export const LOCAL_STORAGE_KEY = "ijh-estimation-v1";

export interface StandardObjectDef {
  nom: string;
  volumeUnitaireM3: number;
}

/** Liste standard pour l'ajout manuel d'objets, triée par catégorie usuelle. */
export const STANDARD_OBJECTS: StandardObjectDef[] = [
  { nom: "Canapé 3 places", volumeUnitaireM3: 2 },
  { nom: "Canapé 2 places", volumeUnitaireM3: 1.5 },
  { nom: "Fauteuil", volumeUnitaireM3: 0.5 },
  { nom: "Table basse", volumeUnitaireM3: 0.3 },
  { nom: "Table à manger", volumeUnitaireM3: 1 },
  { nom: "Chaise", volumeUnitaireM3: 0.2 },
  { nom: "Buffet / bahut", volumeUnitaireM3: 1.5 },
  { nom: "Bibliothèque", volumeUnitaireM3: 1 },
  { nom: "Bureau", volumeUnitaireM3: 0.8 },
  { nom: "Lit double", volumeUnitaireM3: 2 },
  { nom: "Lit simple", volumeUnitaireM3: 1 },
  { nom: "Matelas", volumeUnitaireM3: 0.5 },
  { nom: "Armoire 2 portes", volumeUnitaireM3: 1.5 },
  { nom: "Armoire 3 portes", volumeUnitaireM3: 2 },
  { nom: "Commode", volumeUnitaireM3: 0.5 },
  { nom: "Réfrigérateur", volumeUnitaireM3: 1 },
  { nom: "Congélateur", volumeUnitaireM3: 0.8 },
  { nom: "Lave-linge", volumeUnitaireM3: 0.5 },
  { nom: "Lave-vaisselle", volumeUnitaireM3: 0.4 },
  { nom: "Four / cuisinière", volumeUnitaireM3: 0.3 },
  { nom: "Micro-ondes", volumeUnitaireM3: 0.1 },
  { nom: "Téléviseur", volumeUnitaireM3: 0.3 },
  { nom: "Vélo", volumeUnitaireM3: 0.4 },
  { nom: "Valise", volumeUnitaireM3: 0.15 },
  { nom: "Miroir / tableau", volumeUnitaireM3: 0.1 },
  { nom: "Plante", volumeUnitaireM3: 0.2 },
  { nom: "Carton standard", volumeUnitaireM3: 0.1 },
];

export const DEFAULT_ROOM_NAMES = [
  "Salon",
  "Cuisine",
  "Chambre 1",
  "Chambre 2",
  "Chambre 3",
  "Salle de bain",
  "Bureau",
  "Garage / cave",
  "Jardin / terrasse",
  "Autre pièce",
];
