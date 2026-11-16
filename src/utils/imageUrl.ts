/**
 * Utility to convert Google Drive share links into direct embeddable image URLs
 * Handles:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Format: drive.google.com/file/d/<id>/...
  const fileDMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // Format: drive.google.com/open?id=<id> or drive.google.com/uc?id=<id>
  const idMatch = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return trimmed;
};

/**
 * Splits comma/newline-separated URLs or parses string arrays and normalizes every URL
 */
export const normalizeImageUrlList = (input: string | string[]): string[] => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(normalizeImageUrl).filter(Boolean);
  }
  return input
    .split(/[\n,]+/)
    .map(normalizeImageUrl)
    .filter(Boolean);
};

