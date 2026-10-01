const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

/**
 * Redimensionne et recompresse une image côté client avant envoi à l'API,
 * pour limiter la bande passante et le coût d'analyse.
 */
export async function compressImageFile(file: File): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(originalDataUrl);

  const { width, height } = fitWithinMaxDimension(image.width, image.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossible de préparer l'image (canvas indisponible).");
  }
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function fitWithinMaxDimension(
  width: number,
  height: number,
): { width: number; height: number } {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height };
  }
  const scale = MAX_DIMENSION / Math.max(width, height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible ou corrompue."));
    img.src = src;
  });
}
