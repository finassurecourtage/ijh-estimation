import type { EstimatePhoto } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n";

interface PhotoThumbProps {
  photo: EstimatePhoto;
  dict: Dictionary;
  onRetry: () => void;
  onRemove: () => void;
}

export function PhotoThumb({ photo, dict, onRetry, onRemove }: PhotoThumbProps) {
  return (
    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border bg-steel-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.dataUrl} alt={photo.fileName} className="w-full h-full object-cover" />

      {(photo.status === "pending" || photo.status === "analyzing") && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {photo.status === "error" && (
        <div className="absolute inset-0 bg-danger/80 flex flex-col items-center justify-center gap-1 p-1">
          <p className="text-white text-[9px] text-center leading-tight line-clamp-2">
            {photo.errorMessage || dict.room.photoError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="text-[10px] bg-white text-danger rounded px-1.5 py-0.5 font-semibold"
          >
            {dict.room.photoRetry}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label={dict.room.removePhotoAria}
        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>
  );
}
