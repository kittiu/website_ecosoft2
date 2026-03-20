# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 4321
npm run build     # Production build
npm run preview   # Preview production build
npm run check     # Astro type/config checks
npm run lint      # Run ESLint
npm run test      # Run tests with vitest
npm run test:watch  # Run tests in watch mode
```

## Architecture

This is an **Astro 5** static marketing website for Ecosoft (open source ERP consulting).

### Routing & Pages

File-based routing under `src/pages/`:
- `index.astro` — Homepage: hero, services, pricing, methodology, testimonials, customer logos, contact form
- `erpnext.astro` — ERPNext product/service page
- `odoo.astro` — Odoo product/service page
- `404.astro` — Custom 404 page
- `blog/index.astro` — Blog listing
- `blog/[slug].astro` — Dynamic blog post pages (slug derived from filename)

### Layout

`src/layouts/BaseLayout.astro` wraps all pages. Accepts `title` and `description` props for SEO. Contains:
- Sticky header with logo (`/images/ecosoft-logo.png`), nav links, dark mode toggle (🌙/☀️), language toggle (TH/EN)
- Footer with logo, office info, quick links
- Two `<script is:inline>` blocks at the bottom for dark mode and language switching

**Nav anchor links use `/#section` format** (not `#section`) so they work from any page, not just the homepage.

### Content Collections (Blog)

Blog posts live in `src/content/blog/` as Markdown files. Schema defined in `src/content/config.ts` — required: `title`, `date`, `author`, `category`, `description`; optional: `image`, `tags`.

### Utilities (`src/utils/`)

- `formatDate.ts` — date formatting helper for blog posts
- `langToggle.ts` — language toggle logic (extracted for testability)
- `langToggle.test.ts` — vitest unit tests for language toggle logic

### Styling

- **No Tailwind** — custom CSS only via `public/styles/global.css`
- Scoped styles via `<style>` blocks in Astro files (`where()` strategy in `astro.config.mjs`)
- **Dark mode** via CSS custom properties: `:root` defines light tokens, `html[data-theme="dark"]` overrides them. All colors in `global.css` use `var(--token)` — never hardcode colors when editing.
- Key tokens: `--bg`, `--bg-card`, `--bg-card-blue`, `--text`, `--text-muted`, `--text-faint`, `--text-subtle`, `--border`, `--border-blue`
- Fixed accent colors (not themed): orange `#f97316`, blue `#1d4ed8`/`#2563eb`
- Base font size: `18px` on `html` (all sizing in `rem`)
- Key utility classes: `.container`, `.btn`/`.btn-primary`/`.btn-outline`, `.section`/`.section-alt`/`.section-accent`, `.eyebrow`, `.cards-grid`, `.pricing-card`, `.pricing-tab`

### Dark Mode

Toggled by `#theme-toggle` button. State saved in `localStorage('theme')`. Falls back to `prefers-color-scheme`. Sets `data-theme="dark"` on `<html>`. Implemented via `is:inline` script in `BaseLayout.astro`.

### Language Toggle (Thai/English)

Uses Google Translate URL proxy — no widget or cookies:
- On the normal site: button shows "TH", click redirects to `https://translate.google.com/translate?sl=en&tl=th&u=CURRENT_URL`
- On the translated page (`.translate.goog` domain): button shows "EN", click reconstructs and navigates to the original URL
- Implemented via `is:inline` script in `BaseLayout.astro` — **do not use TypeScript types inside `is:inline` scripts** (causes 500 errors).

### Pricing Section

Homepage has a tabbed pricing section (`#pricing`). Two tabs: **Standard** (4 cards in a grid) and **Enterprise** (single featured card). Tab switching uses vanilla JS in a `<script>` block at the bottom of `index.astro`.

### TypeScript Path Aliases

- `@layouts/*` → `src/layouts/*`

### Integrations

- `@astrojs/sitemap` — auto-generates `sitemap.xml` on build (site URL: `https://ecosoft.co.th`)
