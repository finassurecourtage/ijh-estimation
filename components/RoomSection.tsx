"use client";

import { useRef, useState } from "react";
import type { EstimateRoom } from "@/lib/types";
import type { Dictionary, LocalizedStandardObject } from "@/lib/i18n";
import { ObjectRow } from "./ObjectRow";
import { PhotoThumb } from "./PhotoThumb";
import { AddObjectPicker } from "./AddObjectPicker";

interface RoomSectionProps {
  room: EstimateRoom;
  dict: Dictionary;
  standardObjects: LocalizedStandardObject[];
  onRename: (nom: string) => void;
  onRemoveRoom: () => void;
  onPhotosSelected: (files: FileList) => void;
  onRetryPhoto: (photoId: string) => void;
  onRemovePhoto: (photoId: string) => void;
  onIncrementObject: (objectId: string) => void;
  onDecrementObject: (objectId: string) => void;
  onRemoveObject: (objectId: string) => void;
  onAddManualObject: (nom: string, volumeUnitaireM3: number) => void;
}

export function RoomSection({
  room,
  dict,
  standardObjects,
  onRename,
  onRemoveRoom,
  onPhotosSelected,
  onRetryPhoto,
  onRemovePhoto,
  onIncrementObject,
  onDecrementObject,
  onRemoveObject,
  onAddManualObject,
}: RoomSectionProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(room.nom);

  const roomTotal = room.objets.reduce((sum, o) => sum + o.quantite * o.volumeUnitaireM3, 0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onPhotosSelected(e.target.files);
    }
    e.target.value = "";
  }

  function commitName() {
    const trimmed = nameDraft.trim();
    onRename(trimmed || room.nom);
    setEditingName(false);
  }

  return (
    <section className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-3 bg-steel-100/60">
        {editingName ? (
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => e.key === "Enter" && commitName()}
            className="flex-1 min-w-0 bg-white border border-steel-500 rounded px-2 py-1 text-base font-semibold text-steel-900"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setNameDraft(room.nom);
              setEditingName(true);
            }}
            className="flex-1 min-w-0 text-left text-base font-semibold text-steel-900 truncate"
          >
            {room.nom}
          </button>
        )}
        <span className="text-sm font-medium text-steel-700 shrink-0">
          {roomTotal.toFixed(2)} m³
        </span>
        <button
          type="button"
          onClick={onRemoveRoom}
          aria-label={dict.room.deleteRoomAria(room.nom)}
          className="shrink-0 w-8 h-8 rounded-full text-steel-600 flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
          </svg>
        </button>
      </header>

      <div className="p-4">
        <div className="flex gap-2 mb-3">
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 bg-steel-700 text-white rounded-lg py-2.5 text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            {dict.room.takePhoto}
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 bg-steel-100 text-steel-800 rounded-lg py-2.5 text-sm font-semibold active:scale-[0.98] transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            {dict.room.gallery}
          </button>
        </div>

        {room.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-3 -mx-1 px-1">
            {room.photos.map((photo) => (
              <PhotoThumb
                key={photo.id}
                photo={photo}
                dict={dict}
                onRetry={() => onRetryPhoto(photo.id)}
                onRemove={() => onRemovePhoto(photo.id)}
              />
            ))}
          </div>
        )}

        {room.remarqueIA && (
          <p className="text-xs text-danger bg-danger/10 rounded-lg px-3 py-2 mb-3">
            ⚠ {room.remarqueIA}
          </p>
        )}

        {room.objets.length > 0 ? (
          <div>{room.objets.map((o) => (
            <ObjectRow
              key={o.id}
              object={o}
              dict={dict}
              onIncrement={() => onIncrementObject(o.id)}
              onDecrement={() => onDecrementObject(o.id)}
              onRemove={() => onRemoveObject(o.id)}
            />
          ))}</div>
        ) : (
          <p className="text-sm text-steel-600 italic py-2">{dict.room.noObjectsYet}</p>
        )}

        <AddObjectPicker dict={dict} standardObjects={standardObjects} onAdd={onAddManualObject} />
      </div>
    </section>
  );
}
