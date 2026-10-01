"use client";

import { useState } from "react";
import type { ContactInfo } from "@/lib/types";
import { estimatePrice } from "@/lib/pricing";

function formatEuros(value: number): string {
  return value.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €";
}

interface ContactFormModalProps {
  totalM3: number;
  sending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (contact: ContactInfo) => void;
}

const emptyContact: ContactInfo = {
  nom: "",
  telephone: "",
  email: "",
  villeDepart: "",
  dateSouhaitee: "",
  commentaire: "",
};

export function ContactFormModal({
  totalM3,
  sending,
  errorMessage,
  onClose,
  onSubmit,
}: ContactFormModalProps) {
  const [contact, setContact] = useState<ContactInfo>(emptyContact);
  const { priceLow, priceHigh } = estimatePrice(totalM3);

  function update<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setContact((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(contact);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card w-full sm:max-w-md sm:rounded-xl rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-steel-900">Finaliser la demande</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full bg-steel-100 flex items-center justify-center text-steel-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <p className="text-sm text-steel-700 bg-steel-100 rounded-lg px-3 py-2">
            Volume estimé : <strong>{totalM3.toFixed(2)} m³</strong>
            <br />
            Budget estimé : <strong>{formatEuros(priceLow)} – {formatEuros(priceHigh)}</strong>
          </p>

          <Field label="Nom complet" required>
            <input
              required
              value={contact.nom}
              onChange={(e) => update("nom", e.target.value)}
              className="input"
              autoComplete="name"
            />
          </Field>

          <Field label="Téléphone" required>
            <input
              required
              type="tel"
              value={contact.telephone}
              onChange={(e) => update("telephone", e.target.value)}
              className="input"
              autoComplete="tel"
            />
          </Field>

          <Field label="Email" required>
            <input
              required
              type="email"
              value={contact.email}
              onChange={(e) => update("email", e.target.value)}
              className="input"
              autoComplete="email"
            />
          </Field>

          <Field label="Ville de départ (France)" required>
            <input
              required
              value={contact.villeDepart}
              onChange={(e) => update("villeDepart", e.target.value)}
              className="input"
              autoComplete="address-level2"
            />
          </Field>

          <Field label="Date souhaitée de déménagement" required>
            <input
              required
              type="date"
              value={contact.dateSouhaitee}
              onChange={(e) => update("dateSouhaitee", e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Commentaire (optionnel)">
            <textarea
              value={contact.commentaire}
              onChange={(e) => update("commentaire", e.target.value)}
              className="input resize-none"
              rows={3}
            />
          </Field>

          {errorMessage && (
            <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-signal text-steel-900 font-bold rounded-lg py-3 mt-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {sending ? "Envoi en cours…" : "Envoyer ma demande d'estimation"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.95rem;
          background: white;
          color: var(--foreground);
        }
        .input:focus {
          outline: 2px solid var(--steel-500);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-steel-800 mb-1">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      {children}
    </label>
  );
}
