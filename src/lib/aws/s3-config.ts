export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export function isValidFileType(fileType: string): fileType is AllowedFileType {
  return ALLOWED_FILE_TYPES.includes(fileType as AllowedFileType);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
