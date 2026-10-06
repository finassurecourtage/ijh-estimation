"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useEstimate } from "@/hooks/useEstimate";
import { useLocale } from "@/hooks/useLocale";
import { compressImageFile } from "@/lib/compress-image";
import { VolumeGauge } from "@/components/VolumeGauge";
import { PriceEstimate } from "@/components/PriceEstimate";
import { RoomSection } from "@/components/RoomSection";
import { ContactFormModal } from "@/components/ContactFormModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { OnboardingGuide } from "@/components/OnboardingGuide";
import type { AnalyzePhotoResult, ContactInfo, EstimateRoom } from "@/lib/types";

export default function Home() {
  const estimate = useEstimate();
  const { locale, setLocale, dir, intl, dict, standardObjects, defaultRoomNames } = useLocale();
  const [showContactForm, setShowContactForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  const totalM3 = useMemo(
    () =>
      estimate.rooms.reduce(
        (sum, r) => sum + r.objets.reduce((s, o) => s + o.quantite * o.volumeUnitaireM3, 0),
        0,
      ),
    [estimate.rooms],
  );

  const suggestedNames = useMemo(() => {
    const used = new Set(estimate.rooms.map((r) => r.nom));
    return defaultRoomNames.filter((n) => !used.has(n));
  }, [estimate.rooms, defaultRoomNames]);

  async function analyzeAndMerge(room: EstimateRoom, photoId: string, dataUrl: string) {
    estimate.setPhotoStatus(room.id, photoId, "analyzing");
    try {
      const res = await fetch("/api/analyze-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoDataUrl: dataUrl, roomName: room.nom, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || dict.errors.analyzeFailed);
      }
      const result = data.result as AnalyzePhotoResult;
      estimate.mergeAnalysisIntoRoom(room.id, result);
      estimate.setPhotoStatus(room.id, photoId, "done");
    } catch (err) {
      estimate.setPhotoStatus(
        room.id,
        photoId,
        "error",
        err instanceof Error ? err.message : dict.errors.unknown,
      );
    }
  }

  async function handlePhotosSelected(room: EstimateRoom, files: FileList) {
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await compressImageFile(file);
        const photoId = estimate.addPendingPhoto(room.id, dataUrl, file.name);
        void analyzeAndMerge(room, photoId, dataUrl);
      } catch {
        const photoId = estimate.addPendingPhoto(room.id, "", file.name);
        estimate.setPhotoStatus(room.id, photoId, "error", dict.room.unknownFileError);
      }
    }
  }

  function handleRetryPhoto(room: EstimateRoom, photoId: string) {
    const photo = room.photos.find((p) => p.id === photoId);
    if (!photo || !photo.dataUrl) return;
    void analyzeAndMerge(room, photoId, photo.dataUrl);
  }

  function handleAddRoom(nom: string) {
    const trimmed = nom.trim();
    if (!trimmed) return;
    estimate.addRoom(trimmed);
    setNewRoomName("");
  }

  async function handleSubmitContact(contact: ContactInfo) {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/send-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, rooms: estimate.rooms, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || dict.errors.sendFailed);
      }
      setSendSuccess(true);
      setShowContactForm(false);
      estimate.clearAll();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : dict.contactForm.genericError);
    } finally {
      setSending(false);
    }
  }

  const hasAnyObject = estimate.rooms.some((r) => r.objets.length > 0);
  const anyPhotoAnalyzing = estimate.rooms.some((r) =>
    r.photos.some((p) => p.status === "pending" || p.status === "analyzing"),
  );

  if (sendSuccess) {
    return (
      <main dir={dir} className="flex-1 flex items-center justify-center p-6 bg-background">
        <WhatsAppButton dict={dict} />
        <div className="max-w-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-steel-900 mb-2">{dict.success.title}</h1>
          <p className="text-steel-700 text-sm mb-6">{dict.success.message}</p>
          <button
            type="button"
            onClick={() => setSendSuccess(false)}
            className="bg-steel-700 text-white font-semibold rounded-lg px-5 py-2.5"
          >
            {dict.success.newEstimate}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir={dir} className="flex-1 bg-background pb-28">
      <WhatsAppButton dict={dict} />
      <OnboardingGuide dict={dict} dir={dir} />
      <header className="bg-steel-800 text-white px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <Image
            src="/ijh-logo.png"
            alt="IJH Transport"
            width={40}
            height={40}
            className="rounded bg-white/10 object-contain shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-signal font-semibold tracking-wide uppercase">
              IJH Transport
            </p>
            <h1 className="text-lg font-bold leading-tight">{dict.header.title}</h1>
          </div>
          <LanguageSwitcher locale={locale} onChange={setLocale} />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-4 space-y-4">
        <VolumeGauge totalM3={totalM3} dict={dict} />

        <PriceEstimate totalM3={totalM3} dict={dict} intl={intl} />

        <p className="text-xs text-steel-700 bg-steel-100 rounded-lg px-3 py-2">
          {dict.disclaimer}
        </p>

        {estimate.rooms.map((room) => (
          <RoomSection
            key={room.id}
            room={room}
            dict={dict}
            standardObjects={standardObjects}
            onRename={(nom) => estimate.renameRoom(room.id, nom)}
            onRemoveRoom={() => estimate.removeRoom(room.id)}
            onPhotosSelected={(files) => handlePhotosSelected(room, files)}
            onRetryPhoto={(photoId) => handleRetryPhoto(room, photoId)}
            onRemovePhoto={(photoId) => estimate.removePhoto(room.id, photoId)}
            onIncrementObject={(objectId) => estimate.updateObjectQuantity(room.id, objectId, 1)}
            onDecrementObject={(objectId) => estimate.updateObjectQuantity(room.id, objectId, -1)}
            onRemoveObject={(objectId) => estimate.removeObject(room.id, objectId)}
            onAddManualObject={(nom, vol) => estimate.addManualObject(room.id, nom, vol)}
          />
        ))}

        <section className="bg-card rounded-xl border border-dashed border-steel-500 p-4">
          <h2 className="text-sm font-semibold text-steel-800 mb-2">{dict.addRoom.title}</h2>
          {suggestedNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedNames.slice(0, 6).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleAddRoom(name)}
                  className="text-xs bg-steel-100 text-steel-800 rounded-full px-3 py-1.5 font-medium active:scale-95 transition-transform"
                >
                  + {name}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddRoom(newRoomName)}
              placeholder={dict.addRoom.placeholder}
              className="input flex-1 min-w-0"
            />
            <button
              type="button"
              onClick={() => handleAddRoom(newRoomName)}
              className="bg-steel-700 text-white rounded-lg px-4 font-semibold shrink-0 whitespace-nowrap"
            >
              {dict.addRoom.addButton}
            </button>
          </div>
        </section>
      </div>

      {estimate.rooms.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-card border-t border-border p-4 z-20">
          <div className="max-w-xl mx-auto">
            <button
              type="button"
              disabled={!hasAnyObject || anyPhotoAnalyzing}
              onClick={() => setShowContactForm(true)}
              className="w-full bg-signal text-steel-900 font-bold rounded-lg py-3.5 text-base disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              {anyPhotoAnalyzing
                ? dict.submitBar.analyzing
                : dict.submitBar.sendRequest(totalM3.toFixed(2))}
            </button>
          </div>
        </div>
      )}

      {showContactForm && (
        <ContactFormModal
          totalM3={totalM3}
          sending={sending}
          errorMessage={sendError}
          dict={dict}
          intl={intl}
          onClose={() => setShowContactForm(false)}
          onSubmit={handleSubmitContact}
        />
      )}

      <style jsx global>{`
        .input {
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
    </main>
  );
}
