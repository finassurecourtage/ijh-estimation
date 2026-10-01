import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { analyzeRoomPhoto } from "@/lib/anthropic";
import { sanitizeAnalyzeResult } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

export const runtime = "nodejs";

interface AnalyzeRequestBody {
  photoDataUrl?: string;
  roomName?: string;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Trop de photos analysées depuis cette connexion. Merci de réessayer dans un peu moins d'une heure.",
      },
      { status: 429 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { photoDataUrl, roomName } = body;

  if (!photoDataUrl || typeof photoDataUrl !== "string") {
    return NextResponse.json({ error: "Aucune photo reçue." }, { status: 400 });
  }

  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(photoDataUrl)) {
    return NextResponse.json(
      { error: "Le fichier envoyé n'est pas une image valide (JPEG, PNG ou WebP)." },
      { status: 400 },
    );
  }

  // data URL ~= 4/3 de la taille binaire réelle.
  const approxBytes = (photoDataUrl.length * 3) / 4;
  if (approxBytes > MAX_IMAGE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image trop volumineuse (8 Mo maximum)." },
      { status: 413 },
    );
  }

  try {
    const raw = await analyzeRoomPhoto(photoDataUrl, roomName);
    const result = sanitizeAnalyzeResult(raw);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("[analyze-photo]", error);

    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Configuration serveur invalide (clé API Anthropic)." },
        { status: 500 },
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Service temporairement surchargé, merci de réessayer." },
        { status: 503 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "Le service d'analyse a rencontré une erreur. Réessayez." },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { error: "Impossible d'analyser cette photo. Réessayez." },
      { status: 500 },
    );
  }
}
