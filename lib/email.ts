import type { ContactInfo, EstimateRoom } from "./types";
import { CONTAINER_20_PIEDS_M3, CONTAINER_40_PIEDS_M3 } from "./constants";

export function computeTotalVolume(rooms: EstimateRoom[]): number {
  return rooms.reduce(
    (total, room) =>
      total +
      room.objets.reduce((sum, o) => sum + o.quantite * o.volumeUnitaireM3, 0),
    0,
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildEstimateEmailHtml(
  contact: ContactInfo,
  rooms: EstimateRoom[],
): string {
  const total = computeTotalVolume(rooms);
  const tauxC20 = Math.min(999, Math.round((total / CONTAINER_20_PIEDS_M3) * 100));
  const tauxC40 = Math.min(999, Math.round((total / CONTAINER_40_PIEDS_M3) * 100));

  const roomsHtml = rooms
    .map((room) => {
      const roomTotal = room.objets.reduce(
        (sum, o) => sum + o.quantite * o.volumeUnitaireM3,
        0,
      );
      const rows = room.objets
        .map(
          (o) => `
          <tr>
            <td style="padding:6px 10px;border-bottom:1px solid #e4ecf2;">${escapeHtml(o.nom)}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #e4ecf2;text-align:center;">${o.quantite}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #e4ecf2;text-align:center;">${o.volumeUnitaireM3} m³</td>
            <td style="padding:6px 10px;border-bottom:1px solid #e4ecf2;text-align:right;">${(o.quantite * o.volumeUnitaireM3).toFixed(2)} m³</td>
          </tr>`,
        )
        .join("");

      return `
      <h3 style="color:#1e3a5f;margin:24px 0 8px;">${escapeHtml(room.nom)} — ${roomTotal.toFixed(2)} m³</h3>
      ${
        room.remarqueIA
          ? `<p style="color:#c0392b;font-size:13px;margin:0 0 8px;">⚠ ${escapeHtml(room.remarqueIA)}</p>`
          : ""
      }
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#e4ecf2;">
            <th style="padding:6px 10px;text-align:left;">Objet</th>
            <th style="padding:6px 10px;">Qté</th>
            <th style="padding:6px 10px;">Vol. unitaire</th>
            <th style="padding:6px 10px;text-align:right;">Sous-total</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="4" style="padding:6px 10px;color:#888;">Aucun objet listé</td></tr>'}</tbody>
      </table>
      <p style="font-size:12px;color:#667;margin:6px 0 0;">${room.photos.length} photo(s) jointe(s) pour cette pièce</p>`;
    })
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#16232e;">
    <div style="background:#1e3a5f;padding:20px 24px;">
      <h1 style="color:#ffc72c;margin:0;font-size:20px;">IJH Transport — Nouvelle demande d'estimation</h1>
    </div>
    <div style="padding:20px 24px;">
      <h2 style="margin:0 0 12px;color:#1e3a5f;">Client</h2>
      <table style="font-size:14px;">
        <tr><td style="padding:2px 12px 2px 0;color:#667;">Nom</td><td><strong>${escapeHtml(contact.nom)}</strong></td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#667;">Téléphone</td><td>${escapeHtml(contact.telephone)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#667;">Email</td><td>${escapeHtml(contact.email)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#667;">Ville de départ</td><td>${escapeHtml(contact.villeDepart)}</td></tr>
        <tr><td style="padding:2px 12px 2px 0;color:#667;">Date souhaitée</td><td>${escapeHtml(contact.dateSouhaitee)}</td></tr>
        ${
          contact.commentaire
            ? `<tr><td style="padding:2px 12px 2px 0;color:#667;vertical-align:top;">Commentaire</td><td>${escapeHtml(contact.commentaire)}</td></tr>`
            : ""
        }
      </table>

      <div style="background:#e4ecf2;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-size:15px;">Volume total estimé : <strong style="color:#1e3a5f;font-size:20px;">${total.toFixed(2)} m³</strong></p>
        <p style="margin:6px 0 0;font-size:13px;color:#445;">≈ ${tauxC20}% d'un conteneur 20 pieds (28 m³) · ≈ ${tauxC40}% d'un conteneur 40 pieds (58 m³)</p>
        <p style="margin:6px 0 0;font-size:12px;color:#889;">Estimation indicative à ±20 %, volume confirmé lors du devis.</p>
      </div>

      ${roomsHtml}
    </div>
  </div>`;
}
