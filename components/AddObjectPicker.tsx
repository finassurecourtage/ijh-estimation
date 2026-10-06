"use client";

import { useState } from "react";
import type { Dictionary, LocalizedStandardObject } from "@/lib/i18n";

interface AddObjectPickerProps {
  dict: Dictionary;
  standardObjects: LocalizedStandardObject[];
  onAdd: (nom: string, volumeUnitaireM3: number) => void;
}

export function AddObjectPicker({ dict, standardObjects, onAdd }: AddObjectPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium text-steel-700 flex items-center gap-1 py-1"
      >
        <span className="text-lg leading-none">{open ? "−" : "+"}</span>
        {dict.room.addManually}
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {standardObjects.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAdd(item.nom, item.volumeUnitaireM3)}
              className="text-left text-xs bg-steel-100 hover:bg-steel-100/70 active:scale-95 transition-transform rounded-lg px-2.5 py-2"
            >
              <span className="block font-medium text-steel-800 truncate">{item.nom}</span>
              <span className="text-steel-600">{item.volumeUnitaireM3} m³</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
