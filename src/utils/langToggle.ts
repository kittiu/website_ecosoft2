/**
 * Language toggle utilities — shared between BaseLayout and tests.
 * Pure functions only; no DOM or browser globals.
 */

/** Returns true when the page is being served through Google Translate proxy. */
export function isTranslatedDomain(hostname: string): boolean {
  return hostname.endsWith('.translate.goog');
}

/**
 * Builds the Google Translate proxy URL for the given page URL.
 * e.g. "http://localhost:4321/about" →
 *      "https://translate.google.com/translate?sl=en&tl=th&u=http%3A%2F%2F..."
 */
export function buildTranslateUrl(pageUrl: string): string {
  return 'https://translate.google.com/translate?sl=en&tl=th&u=' + encodeURIComponent(pageUrl);
}

/**
 * Reconstructs the original URL from a translate.goog location.
 *
 * Google encodes the original hostname in the subdomain, replacing dots with
 * dashes. A trailing numeric segment represents the port.
 *
 * Examples:
 *   hostname "localhost-4321.translate.goog", pathname "/", search ""
 *     → "http://localhost:4321/"
 *   hostname "ecosoft-co-th.translate.goog", pathname "/blog", search "?_x_tr_sl=en&_x_tr_tl=th"
 *     → "https://ecosoft.co.th/blog"
 */
export function buildOriginalUrl(
  protocol: string,
  hostname: string,
  pathname: string,
  search: string,
): string {
  const sub = hostname.replace('.translate.goog', '');
  const parts = sub.split('-');

  // If the last segment is all digits it is a port number
  const port = /^\d+$/.test(parts[parts.length - 1]) ? ':' + parts.pop() : '';
  const host = parts.join('.');

  // Strip all _x_tr_* params added by Google
  const qs = search
    .replace(/[?&]_x_tr_\w+=[^&]*/g, '')
    .replace(/^&/, '?')
    .replace(/\?$/, '');

  return protocol + '//' + host + port + pathname + qs;
}
