import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a value that might be an array or pipe-separated string to an array
 * @param value - The value to convert (array or string)
 * @returns Array of trimmed strings
 */
export function ensureArray(value: string | string[] | undefined | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => String(item).trim());
  return String(value).split('|').filter(Boolean).map(item => item.trim());
}

/**
 * Checks if a value has content (either non-empty array or non-empty string)
 * @param value - The value to check
 * @returns boolean indicating if value has content
 */
export function hasContent(value: string | string[] | undefined | null): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  return String(value).trim().length > 0;
}
