export type Locale = "fr" | "en" | "he";

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_STORAGE_KEY = "ijh-estimation-locale";

export interface LocaleMeta {
  code: Locale;
  label: string;
  flag: string;
  dir: "ltr" | "rtl";
  intl: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr", intl: "fr-FR" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr", intl: "en-US" },
  { code: "he", label: "עברית", flag: "🇮🇱", dir: "rtl", intl: "he-IL" },
];

export function getLocaleMeta(locale: Locale): LocaleMeta {
  return LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
}

export interface Dictionary {
  header: {
    title: string;
  };
  disclaimer: string;
  volumeGauge: {
    totalLabel: string;
    container20: string;
    container40: string;
    usableSuffix: string;
  };
  priceEstimate: {
    label: string;
    disclaimer: string;
  };
  room: {
    takePhoto: string;
    gallery: string;
    noObjectsYet: string;
    addManually: string;
    deleteRoomAria: (name: string) => string;
    perUnit: string;
    decreaseAria: (name: string) => string;
    increaseAria: (name: string) => string;
    removeObjectAria: (name: string) => string;
    photoError: string;
    photoRetry: string;
    removePhotoAria: string;
    unknownFileError: string;
  };
  addRoom: {
    title: string;
    placeholder: string;
    addButton: string;
  };
  submitBar: {
    analyzing: string;
    sendRequest: (volume: string) => string;
  };
  contactForm: {
    title: string;
    closeAria: string;
    volumeLabel: string;
    budgetLabel: string;
    fullName: string;
    phone: string;
    email: string;
    departureCity: string;
    desiredDate: string;
    comment: string;
    sending: string;
    submit: string;
    genericError: string;
  };
  success: {
    title: string;
    message: string;
    newEstimate: string;
  };
  whatsapp: {
    message: string;
  };
  errors: {
    unknown: string;
    analyzeFailed: string;
    sendFailed: string;
  };
  onboarding: {
    title: string;
    steps: { title: string; text: string }[];
    start: string;
  };
  confirmationEmail: {
    subject: (volume: string) => string;
    greeting: (name: string) => string;
    intro: string;
    footer: string;
  };
}

const fr: Dictionary = {
  header: { title: "Estimation de volume de déménagement" },
  disclaimer: "Estimation indicative à ±20 %, volume confirmé lors du devis.",
  volumeGauge: {
    totalLabel: "Volume total estimé",
    container20: "Conteneur 20 pieds",
    container40: "Conteneur 40 pieds",
    usableSuffix: "m³ utiles",
  },
  priceEstimate: {
    label: "Budget transport estimé",
    disclaimer:
      "Tarif indicatif groupage maritime France → Israël, porte à porte. Hors assurance et formalités douanières. Devis définitif établi par IJH Transport.",
  },
  room: {
    takePhoto: "Prendre une photo",
    gallery: "Galerie",
    noObjectsYet: "Aucun objet pour l'instant. Prenez une photo ou ajoutez un objet manuellement.",
    addManually: "Ajouter un objet manuellement",
    deleteRoomAria: (name) => `Supprimer la pièce ${name}`,
    perUnit: "m³ / unité",
    decreaseAria: (name) => `Diminuer la quantité de ${name}`,
    increaseAria: (name) => `Augmenter la quantité de ${name}`,
    removeObjectAria: (name) => `Supprimer ${name}`,
    photoError: "Erreur",
    photoRetry: "Relancer",
    removePhotoAria: "Supprimer la photo",
    unknownFileError: "Ce fichier n'a pas pu être traité comme une image.",
  },
  addRoom: {
    title: "Ajouter une pièce",
    placeholder: "Nom de la pièce",
    addButton: "Ajouter",
  },
  submitBar: {
    analyzing: "Analyse des photos en cours…",
    sendRequest: (volume) => `Envoyer ma demande d'estimation (${volume} m³)`,
  },
  contactForm: {
    title: "Finaliser la demande",
    closeAria: "Fermer",
    volumeLabel: "Volume estimé",
    budgetLabel: "Budget estimé",
    fullName: "Nom complet",
    phone: "Téléphone",
    email: "Email",
    departureCity: "Ville de départ (France)",
    desiredDate: "Date souhaitée de déménagement",
    comment: "Commentaire (optionnel)",
    sending: "Envoi en cours…",
    submit: "Envoyer ma demande d'estimation",
    genericError: "Erreur inconnue.",
  },
  success: {
    title: "Demande envoyée !",
    message:
      "Merci, votre estimation a bien été transmise à IJH Transport. Nous vous recontacterons rapidement pour confirmer votre devis.",
    newEstimate: "Nouvelle estimation",
  },
  whatsapp: {
    message: "Bonjour, je souhaite plus de renseignements sur mon estimation de déménagement.",
  },
  errors: {
    unknown: "Erreur inconnue",
    analyzeFailed: "Analyse impossible.",
    sendFailed: "Envoi impossible.",
  },
  onboarding: {
    title: "Comment ça marche ?",
    steps: [
      {
        title: "1. Photographiez chaque pièce",
        text: "Prenez une photo (ou plusieurs) de chaque pièce à déménager, directement avec l'appareil photo ou depuis votre galerie.",
      },
      {
        title: "2. L'IA détecte les objets",
        text: "Chaque photo est analysée automatiquement : meubles, électroménager et cartons sont listés avec leur volume.",
      },
      {
        title: "3. Recevez votre estimation",
        text: "Volume total et budget indicatif s'affichent immédiatement. Envoyez votre demande, IJH Transport vous recontacte pour le devis définitif.",
      },
    ],
    start: "Commencer",
  },
  confirmationEmail: {
    subject: (volume) => `Votre estimation IJH Transport — ${volume} m³`,
    greeting: (name) => `Bonjour ${name},`,
    intro: "Nous avons bien reçu votre demande d'estimation. Voici un récapitulatif :",
    footer: "IJH Transport vous recontactera prochainement pour confirmer votre devis définitif.",
  },
};

const en: Dictionary = {
  header: { title: "Moving Volume Estimate" },
  disclaimer: "Indicative estimate ±20%, volume confirmed with your final quote.",
  volumeGauge: {
    totalLabel: "Estimated Total Volume",
    container20: "20ft Container",
    container40: "40ft Container",
    usableSuffix: "m³ usable",
  },
  priceEstimate: {
    label: "Estimated Transport Budget",
    disclaimer:
      "Indicative rate for sea freight groupage France → Israel, door to door. Excludes insurance and customs fees. Final quote issued by IJH Transport.",
  },
  room: {
    takePhoto: "Take a photo",
    gallery: "Gallery",
    noObjectsYet: "No items yet. Take a photo or add an item manually.",
    addManually: "Add an item manually",
    deleteRoomAria: (name) => `Delete room ${name}`,
    perUnit: "m³ / unit",
    decreaseAria: (name) => `Decrease quantity of ${name}`,
    increaseAria: (name) => `Increase quantity of ${name}`,
    removeObjectAria: (name) => `Remove ${name}`,
    photoError: "Error",
    photoRetry: "Retry",
    removePhotoAria: "Remove photo",
    unknownFileError: "This file could not be processed as an image.",
  },
  addRoom: {
    title: "Add a room",
    placeholder: "Room name",
    addButton: "Add",
  },
  submitBar: {
    analyzing: "Analyzing photos…",
    sendRequest: (volume) => `Send my estimate request (${volume} m³)`,
  },
  contactForm: {
    title: "Finalize request",
    closeAria: "Close",
    volumeLabel: "Estimated volume",
    budgetLabel: "Estimated budget",
    fullName: "Full name",
    phone: "Phone",
    email: "Email",
    departureCity: "Departure city (France)",
    desiredDate: "Desired moving date",
    comment: "Comment (optional)",
    sending: "Sending…",
    submit: "Send my estimate request",
    genericError: "Unknown error.",
  },
  success: {
    title: "Request sent!",
    message:
      "Thank you, your estimate has been sent to IJH Transport. We will contact you shortly to confirm your quote.",
    newEstimate: "New estimate",
  },
  whatsapp: {
    message: "Hello, I would like more information about my moving estimate.",
  },
  errors: {
    unknown: "Unknown error",
    analyzeFailed: "Analysis failed.",
    sendFailed: "Could not send.",
  },
  onboarding: {
    title: "How does it work?",
    steps: [
      {
        title: "1. Photograph each room",
        text: "Take one or more photos of each room to be moved, straight from your camera or your gallery.",
      },
      {
        title: "2. AI detects the items",
        text: "Each photo is analyzed automatically: furniture, appliances and boxes are listed with their volume.",
      },
      {
        title: "3. Get your estimate",
        text: "Total volume and indicative budget appear instantly. Send your request and IJH Transport will contact you for the final quote.",
      },
    ],
    start: "Get started",
  },
  confirmationEmail: {
    subject: (volume) => `Your IJH Transport estimate — ${volume} m³`,
    greeting: (name) => `Hello ${name},`,
    intro: "We have received your estimate request. Here is a summary:",
    footer: "IJH Transport will contact you shortly to confirm your final quote.",
  },
};

const he: Dictionary = {
  header: { title: "הערכת נפח הובלה" },
  disclaimer: "הערכה אינדיקטיבית ±20%, הנפח יאושר סופית בהצעת המחיר.",
  volumeGauge: {
    totalLabel: "נפח כולל משוער",
    container20: "מכולת 20 רגל",
    container40: "מכולת 40 רגל",
    usableSuffix: "מ״ק שימושיים",
  },
  priceEstimate: {
    label: "תקציב הובלה משוער",
    disclaimer:
      "תעריף אינדיקטיבי להובלה ימית בקבוצה צרפת → ישראל, מדלת לדלת. לא כולל ביטוח ועמלות מכס. הצעת מחיר סופית תינתן על ידי IJH Transport.",
  },
  room: {
    takePhoto: "צלם תמונה",
    gallery: "גלריה",
    noObjectsYet: "אין עדיין פריטים. צלמו תמונה או הוסיפו פריט ידנית.",
    addManually: "הוסף פריט ידנית",
    deleteRoomAria: (name) => `מחק את החדר ${name}`,
    perUnit: "מ״ק ליחידה",
    decreaseAria: (name) => `הפחת כמות של ${name}`,
    increaseAria: (name) => `הוסף כמות של ${name}`,
    removeObjectAria: (name) => `הסר ${name}`,
    photoError: "שגיאה",
    photoRetry: "נסה שוב",
    removePhotoAria: "הסר תמונה",
    unknownFileError: "לא ניתן היה לעבד קובץ זה כתמונה.",
  },
  addRoom: {
    title: "הוסף חדר",
    placeholder: "שם החדר",
    addButton: "הוסף",
  },
  submitBar: {
    analyzing: "מנתח תמונות…",
    sendRequest: (volume) => `שלח את בקשת ההערכה שלי (${volume} מ״ק)`,
  },
  contactForm: {
    title: "סיום הבקשה",
    closeAria: "סגור",
    volumeLabel: "נפח משוער",
    budgetLabel: "תקציב משוער",
    fullName: "שם מלא",
    phone: "טלפון",
    email: "אימייל",
    departureCity: "עיר יציאה (צרפת)",
    desiredDate: "תאריך הובלה רצוי",
    comment: "הערה (אופציונלי)",
    sending: "שולח…",
    submit: "שלח את בקשת ההערכה שלי",
    genericError: "שגיאה לא ידועה.",
  },
  success: {
    title: "הבקשה נשלחה!",
    message: "תודה, ההערכה שלך נשלחה ל-IJH Transport. ניצור איתך קשר בקרוב לאישור הצעת המחיר.",
    newEstimate: "הערכה חדשה",
  },
  whatsapp: {
    message: "שלום, אשמח לקבל מידע נוסף על הערכת ההובלה שלי.",
  },
  errors: {
    unknown: "שגיאה לא ידועה",
    analyzeFailed: "הניתוח נכשל.",
    sendFailed: "השליחה נכשלה.",
  },
  onboarding: {
    title: "איך זה עובד?",
    steps: [
      {
        title: "1. צלמו כל חדר",
        text: "צלמו תמונה אחת או יותר של כל חדר שצריך להעביר, ישירות מהמצלמה או מהגלריה שלכם.",
      },
      {
        title: "2. הבינה המלאכותית מזהה את הפריטים",
        text: "כל תמונה מנותחת אוטומטית: רהיטים, מכשירי חשמל וקרטונים מופיעים ברשימה עם הנפח שלהם.",
      },
      {
        title: "3. קבלו את ההערכה שלכם",
        text: "הנפח הכולל והתקציב המשוער מופיעים מיד. שלחו את הבקשה שלכם ו-IJH Transport תיצור איתכם קשר להצעת מחיר סופית.",
      },
    ],
    start: "בואו נתחיל",
  },
  confirmationEmail: {
    subject: (volume) => `ההערכה שלך מ-IJH Transport — ${volume} מ"ק`,
    greeting: (name) => `שלום ${name},`,
    intro: "קיבלנו את בקשת ההערכה שלך. הנה סיכום:",
    footer: "IJH Transport ייצור איתך קשר בקרוב לאישור הצעת המחיר הסופית.",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, he };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export interface LocalizedStandardObject {
  id: string;
  nom: string;
  volumeUnitaireM3: number;
}

interface StandardObjectSeed {
  id: string;
  volumeUnitaireM3: number;
  names: Record<Locale, string>;
}

const STANDARD_OBJECT_SEEDS: StandardObjectSeed[] = [
  { id: "sofa3", volumeUnitaireM3: 2, names: { fr: "Canapé 3 places", en: "3-seat sofa", he: "ספה תלת-מושבית" } },
  { id: "sofa2", volumeUnitaireM3: 1.5, names: { fr: "Canapé 2 places", en: "2-seat sofa", he: "ספה דו-מושבית" } },
  { id: "armchair", volumeUnitaireM3: 0.5, names: { fr: "Fauteuil", en: "Armchair", he: "כורסה" } },
  { id: "coffeeTable", volumeUnitaireM3: 0.3, names: { fr: "Table basse", en: "Coffee table", he: "שולחן סלון" } },
  { id: "diningTable", volumeUnitaireM3: 1, names: { fr: "Table à manger", en: "Dining table", he: "שולחן אוכל" } },
  { id: "chair", volumeUnitaireM3: 0.2, names: { fr: "Chaise", en: "Chair", he: "כיסא" } },
  { id: "sideboard", volumeUnitaireM3: 1.5, names: { fr: "Buffet / bahut", en: "Sideboard", he: "מזנון" } },
  { id: "bookcase", volumeUnitaireM3: 1, names: { fr: "Bibliothèque", en: "Bookcase", he: "ספרייה" } },
  { id: "desk", volumeUnitaireM3: 0.8, names: { fr: "Bureau", en: "Desk", he: "שולחן כתיבה" } },
  { id: "doubleBed", volumeUnitaireM3: 2, names: { fr: "Lit double", en: "Double bed", he: "מיטה זוגית" } },
  { id: "singleBed", volumeUnitaireM3: 1, names: { fr: "Lit simple", en: "Single bed", he: "מיטה יחיד" } },
  { id: "mattress", volumeUnitaireM3: 0.5, names: { fr: "Matelas", en: "Mattress", he: "מזרן" } },
  { id: "wardrobe2", volumeUnitaireM3: 1.5, names: { fr: "Armoire 2 portes", en: "2-door wardrobe", he: "ארון 2 דלתות" } },
  { id: "wardrobe3", volumeUnitaireM3: 2, names: { fr: "Armoire 3 portes", en: "3-door wardrobe", he: "ארון 3 דלתות" } },
  { id: "dresser", volumeUnitaireM3: 0.5, names: { fr: "Commode", en: "Dresser", he: "שידה" } },
  { id: "fridge", volumeUnitaireM3: 1, names: { fr: "Réfrigérateur", en: "Refrigerator", he: "מקרר" } },
  { id: "freezer", volumeUnitaireM3: 0.8, names: { fr: "Congélateur", en: "Freezer", he: "מקפיא" } },
  { id: "washer", volumeUnitaireM3: 0.5, names: { fr: "Lave-linge", en: "Washing machine", he: "מכונת כביסה" } },
  { id: "dishwasher", volumeUnitaireM3: 0.4, names: { fr: "Lave-vaisselle", en: "Dishwasher", he: "מדיח כלים" } },
  { id: "oven", volumeUnitaireM3: 0.3, names: { fr: "Four / cuisinière", en: "Oven / stove", he: "תנור / כיריים" } },
  { id: "microwave", volumeUnitaireM3: 0.1, names: { fr: "Micro-ondes", en: "Microwave", he: "מיקרוגל" } },
  { id: "tv", volumeUnitaireM3: 0.3, names: { fr: "Téléviseur", en: "TV", he: "טלוויזיה" } },
  { id: "bike", volumeUnitaireM3: 0.4, names: { fr: "Vélo", en: "Bicycle", he: "אופניים" } },
  { id: "suitcase", volumeUnitaireM3: 0.15, names: { fr: "Valise", en: "Suitcase", he: "מזוודה" } },
  { id: "mirror", volumeUnitaireM3: 0.1, names: { fr: "Miroir / tableau", en: "Mirror / painting", he: "מראה / ציור" } },
  { id: "plant", volumeUnitaireM3: 0.2, names: { fr: "Plante", en: "Plant", he: "צמח" } },
  { id: "box", volumeUnitaireM3: 0.1, names: { fr: "Carton standard", en: "Standard box", he: "קרטון סטנדרטי" } },
];

export function getStandardObjects(locale: Locale): LocalizedStandardObject[] {
  return STANDARD_OBJECT_SEEDS.map((seed) => ({
    id: seed.id,
    nom: seed.names[locale],
    volumeUnitaireM3: seed.volumeUnitaireM3,
  }));
}

interface RoomNameSeed {
  id: string;
  names: Record<Locale, string>;
}

const ROOM_NAME_SEEDS: RoomNameSeed[] = [
  { id: "living", names: { fr: "Salon", en: "Living room", he: "סלון" } },
  { id: "kitchen", names: { fr: "Cuisine", en: "Kitchen", he: "מטבח" } },
  { id: "bedroom1", names: { fr: "Chambre 1", en: "Bedroom 1", he: "חדר שינה 1" } },
  { id: "bedroom2", names: { fr: "Chambre 2", en: "Bedroom 2", he: "חדר שינה 2" } },
  { id: "bedroom3", names: { fr: "Chambre 3", en: "Bedroom 3", he: "חדר שינה 3" } },
  { id: "bathroom", names: { fr: "Salle de bain", en: "Bathroom", he: "חדר אמבטיה" } },
  { id: "office", names: { fr: "Bureau", en: "Office", he: "משרד" } },
  { id: "garage", names: { fr: "Garage / cave", en: "Garage / basement", he: "מוסך / מרתף" } },
  { id: "garden", names: { fr: "Jardin / terrasse", en: "Garden / terrace", he: "גינה / מרפסת" } },
  { id: "other", names: { fr: "Autre pièce", en: "Other room", he: "חדר אחר" } },
];

export function getDefaultRoomNames(locale: Locale): string[] {
  return ROOM_NAME_SEEDS.map((seed) => seed.names[locale]);
}
