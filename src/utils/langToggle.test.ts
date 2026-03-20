import { describe, it, expect } from 'vitest';
import { isTranslatedDomain, buildTranslateUrl, buildOriginalUrl } from './langToggle';

// ── isTranslatedDomain ────────────────────────────────────────────────────────

describe('isTranslatedDomain', () => {
  it('returns true for translate.goog hostnames', () => {
    expect(isTranslatedDomain('localhost-4321.translate.goog')).toBe(true);
    expect(isTranslatedDomain('ecosoft-co-th.translate.goog')).toBe(true);
  });

  it('returns false for normal hostnames', () => {
    expect(isTranslatedDomain('localhost')).toBe(false);
    expect(isTranslatedDomain('ecosoft.co.th')).toBe(false);
    expect(isTranslatedDomain('translate.goog.example.com')).toBe(false);
  });
});

// ── buildTranslateUrl ─────────────────────────────────────────────────────────

describe('buildTranslateUrl', () => {
  it('wraps a simple URL in the Google Translate proxy', () => {
    const result = buildTranslateUrl('http://localhost:4321/');
    expect(result).toBe(
      'https://translate.google.com/translate?sl=en&tl=th&u=http%3A%2F%2Flocalhost%3A4321%2F',
    );
  });

  it('encodes the full URL including path and query string', () => {
    const result = buildTranslateUrl('https://ecosoft.co.th/blog?page=2');
    expect(result).toContain('sl=en');
    expect(result).toContain('tl=th');
    expect(result).toContain(encodeURIComponent('https://ecosoft.co.th/blog?page=2'));
  });
});

// ── buildOriginalUrl ──────────────────────────────────────────────────────────

describe('buildOriginalUrl', () => {
  it('reconstructs localhost with port', () => {
    const result = buildOriginalUrl(
      'http:',
      'localhost-4321.translate.goog',
      '/',
      '',
    );
    expect(result).toBe('http://localhost:4321/');
  });

  it('reconstructs a production domain', () => {
    const result = buildOriginalUrl(
      'https:',
      'ecosoft-co-th.translate.goog',
      '/',
      '',
    );
    expect(result).toBe('https://ecosoft.co.th/');
  });

  it('preserves the original pathname', () => {
    const result = buildOriginalUrl(
      'https:',
      'ecosoft-co-th.translate.goog',
      '/blog/my-post',
      '',
    );
    expect(result).toBe('https://ecosoft.co.th/blog/my-post');
  });

  it('strips Google _x_tr_* query params', () => {
    const result = buildOriginalUrl(
      'https:',
      'ecosoft-co-th.translate.goog',
      '/blog',
      '?_x_tr_sl=en&_x_tr_tl=th&_x_tr_hl=en&_x_tr_pto=wapp',
    );
    expect(result).toBe('https://ecosoft.co.th/blog');
  });

  it('preserves non-Google query params while stripping Google ones', () => {
    const result = buildOriginalUrl(
      'https:',
      'ecosoft-co-th.translate.goog',
      '/blog',
      '?page=2&_x_tr_sl=en&_x_tr_tl=th',
    );
    expect(result).toContain('page=2');
    expect(result).not.toContain('_x_tr_');
  });

  it('handles a two-segment domain (e.g. example.com)', () => {
    const result = buildOriginalUrl(
      'https:',
      'example-com.translate.goog',
      '/',
      '',
    );
    expect(result).toBe('https://example.com/');
  });
});
