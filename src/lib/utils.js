/**
 * Ensures a URL has a protocol prefix (https://).
 * If the URL doesn't start with http:// or https://, prepend https://.
 * Returns the URL as-is if it already has a protocol, or null/empty values unchanged.
 */
export function ensureUrl(url) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}
