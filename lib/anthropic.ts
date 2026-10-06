import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const MODEL = "claude-sonnet-5";

const AnalyzePhotoSchema = z.object({
  piece: z.string(),
  objets: z.array(
    z.object({
      nom: z.string(),
      quantite: z.number(),
      volume_unitaire_m3: z.number(),
    }),
  ),
  remarque: z.string(),
});

export type AnalyzePhotoSchemaType = z.infer<typeof AnalyzePhotoSchema>;

const SYSTEM_PROMPT = `Tu es un expert en déménagement international, spécialisé dans l'estimation de volume pour des conteneurs maritimes (déménagements France vers Israël).

À partir d'une photo d'une pièce, tu listes tous les meubles, l'électroménager et les objets volumineux visibles qui devront être déménagés.

Règles strictes :
- Regroupe les petits objets épars (livres, vaisselle, vêtements, bibelots, jouets, documents, décorations...) en une seule ligne "Carton standard" avec un volume unitaire de 0,1 m³ et la quantité estimée de cartons nécessaires.
- Ignore totalement les éléments fixes au bâtiment : cuisine intégrée, placards encastrés, radiateurs, luminaires fixés au plafond/mur, revêtements de sol, rideaux fixés.
- Compte chaque objet une seule fois, même s'il apparaît partiellement visible ou en reflet.
- Utilise des volumes unitaires réalistes et cohérents avec ces références standards du secteur (en m³) quand l'objet correspond : canapé 3 places 2, canapé 2 places 1.5, fauteuil 0.5, lit double 2, lit simple 1, matelas 0.5, armoire 2 portes 1.5, armoire 3 portes 2, commode 0.5, table à manger 1, chaise 0.2, table basse 0.3, bureau 0.8, réfrigérateur 1, congélateur 0.8, lave-linge 0.5, lave-vaisselle 0.4, four 0.3, micro-ondes 0.1, téléviseur 0.3, vélo 0.4, carton standard 0.1.
- Pour un objet qui ne correspond à aucune référence, estime un volume raisonnable entre 0.01 et 10 m³ en te basant sur sa taille apparente dans la photo.
- Le nom de la pièce ("piece") doit être une estimation courte du type de pièce visible (Salon, Cuisine, Chambre, Salle de bain, Bureau, Garage, etc.), ou le nom fourni par l'utilisateur s'il est donné.
- Le champ "remarque" est optionnel : utilise-le uniquement pour signaler un point d'attention (accès difficile, objet fragile, désaccord possible sur une estimation), sinon laisse-le vide.
- Réponds uniquement avec les objets réellement visibles sur la photo. N'invente rien.`;

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: `\n\nIMPORTANT: Write your answer in English. The "piece" (room name) and every object "nom" must be in English, even though these instructions above are in French.`,
  he: `\n\nחשוב: כתוב את התשובה בעברית. השדה "piece" (שם החדר) וכל "nom" של אובייקט חייבים להיות בעברית, למרות שההוראות למעלה כתובות בצרפתית.`,
};

function buildSystemPrompt(locale?: string): string {
  const extra = locale ? LANGUAGE_INSTRUCTIONS[locale] : undefined;
  return extra ? SYSTEM_PROMPT + extra : SYSTEM_PROMPT;
}

function parseDataUrl(dataUrl: string): { mediaType: string; base64: string } {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Format d'image invalide (data URL attendue).");
  }
  const [, mediaType, base64] = match;
  return { mediaType, base64 };
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export async function analyzeRoomPhoto(
  photoDataUrl: string,
  roomNameHint?: string,
  locale?: string,
): Promise<AnalyzePhotoSchemaType> {
  const { mediaType, base64 } = parseDataUrl(photoDataUrl);

  const userText = roomNameHint?.trim()
    ? `Voici une photo de la pièce suivante : "${roomNameHint.trim()}". Analyse les objets à déménager visibles sur cette photo.`
    : "Analyse les objets à déménager visibles sur cette photo et identifie le type de pièce.";

  const response = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: buildSystemPrompt(locale),
    output_config: {
      format: zodOutputFormat(AnalyzePhotoSchema),
      effort: "low",
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/webp"
                | "image/gif",
              data: base64,
            },
          },
          { type: "text", text: userText },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("L'analyse de la photo a été refusée par le modèle.");
  }

  if (!response.parsed_output) {
    throw new Error("Impossible d'interpréter la réponse de l'analyse d'image.");
  }

  return response.parsed_output;
}
