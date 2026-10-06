import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildClientConfirmationEmailHtml,
  buildEstimateEmailHtml,
  computeTotalVolume,
} from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { ContactInfo, EstimateRoom } from "@/lib/types";
import { getDictionary, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";

const MAX_TOTAL_ATTACHMENTS_BYTES = 18 * 1024 * 1024; // marge sous la limite Resend (40 Mo)
const SEND_LIMIT_PER_HOUR = 10;

interface SendEstimateBody {
  contact?: ContactInfo;
  rooms?: EstimateRoom[];
  locale?: Locale;
}

function isValidLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en" || value === "he";
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContact(contact: unknown): contact is ContactInfo {
  if (!contact || typeof contact !== "object") return false;
  const c = contact as Record<string, unknown>;
  return (
    typeof c.nom === "string" &&
    c.nom.trim().length > 0 &&
    typeof c.telephone === "string" &&
    c.telephone.trim().length > 0 &&
    typeof c.email === "string" &&
    isValidEmail(c.email) &&
    typeof c.villeDepart === "string" &&
    c.villeDepart.trim().length > 0 &&
    typeof c.dateSouhaitee === "string" &&
    c.dateSouhaitee.trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(ip, SEND_LIMIT_PER_HOUR, "send-estimate");
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes envoyées depuis cette connexion. Réessayez plus tard." },
      { status: 429 },
    );
  }

  let body: SendEstimateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { contact, rooms, locale } = body;
  const clientLocale: Locale = isValidLocale(locale) ? locale : "fr";

  if (!validateContact(contact)) {
    return NextResponse.json(
      { error: "Merci de renseigner nom, téléphone, email valide, ville et date." },
      { status: 400 },
    );
  }

  if (!Array.isArray(rooms) || rooms.length === 0) {
    return NextResponse.json(
      { error: "Ajoutez au moins une pièce avant d'envoyer l'estimation." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destinataire = process.env.EMAIL_DESTINATAIRE;
  if (!apiKey || !destinataire) {
    console.error("[send-estimate] RESEND_API_KEY ou EMAIL_DESTINATAIRE manquant.");
    return NextResponse.json(
      { error: "Configuration serveur incomplète pour l'envoi d'email." },
      { status: 500 },
    );
  }

  const attachments: { filename: string; content: string }[] = [];
  let totalBytes = 0;
  for (const room of rooms) {
    for (const photo of room.photos ?? []) {
      const match = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/.exec(
        photo.dataUrl ?? "",
      );
      if (!match) continue;
      const [, ext, base64] = match;
      const bytes = (base64.length * 3) / 4;
      if (totalBytes + bytes > MAX_TOTAL_ATTACHMENTS_BYTES) continue;
      totalBytes += bytes;
      attachments.push({
        filename: `${sanitizeFileName(room.nom)}-${attachments.length + 1}.${ext === "jpg" ? "jpeg" : ext}`,
        content: base64,
      });
    }
  }

  const html = buildEstimateEmailHtml(contact, rooms);
  const total = computeTotalVolume(rooms);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_EXPEDITEUR || "IJH Transport <estimation@ijhtransport.com>",
      to: destinataire,
      replyTo: contact.email,
      subject: `Estimation déménagement — ${contact.nom} — ${total.toFixed(1)} m³`,
      html,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("[send-estimate] Resend error:", error);
      return NextResponse.json(
        { error: "L'envoi de l'email a échoué. Réessayez dans un instant." },
        { status: 502 },
      );
    }

    // Email de confirmation au client, dans sa langue. Non bloquant : si ça
    // échoue, la demande est tout de même considérée comme envoyée (IJH l'a
    // déjà reçue).
    try {
      const confirmationHtml = buildClientConfirmationEmailHtml(contact, rooms, clientLocale);
      const dict = getDictionary(clientLocale);
      await resend.emails.send({
        from: process.env.EMAIL_EXPEDITEUR || "IJH Transport <estimation@ijhtransport.com>",
        to: contact.email,
        subject: dict.confirmationEmail.subject(total.toFixed(1)),
        html: confirmationHtml,
      });
    } catch (confirmationError) {
      console.error("[send-estimate] confirmation email error:", confirmationError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[send-estimate]", error);
    return NextResponse.json(
      { error: "L'envoi de l'email a échoué. Réessayez dans un instant." },
      { status: 500 },
    );
  }
}

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "photo";
}
