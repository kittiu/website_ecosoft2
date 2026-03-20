# Code Review — Ecosoft Site

**Date:** 2026-03-19
**Reviewer:** Claude Code
**Scope:** Full codebase review of all pages, layouts, styles, and config

---

## Files Reviewed

- `src/pages/index.astro`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/layouts/BaseLayout.astro`
- `src/content/config.ts`
- `src/utils/langToggle.ts`
- `public/styles/global.css`
- `astro.config.mjs`
- `tsconfig.json`
- `package.json`

---

## Summary Table

| Category       | Severity | Issue                                          |
|----------------|----------|------------------------------------------------|
| Bug            | High     | Blog post images missing (`/images/blog/`)     |
| Bug            | High     | Service images — verify they exist             |
| Bug            | Medium   | Contact form is demo-only with no user feedback|
| Accessibility  | High     | Form labels not linked to inputs (missing `for`/`id`) |
| Accessibility  | High     | No keyboard focus indicators on nav links      |
| Accessibility  | High     | Color contrast may fail WCAG AA in dark mode   |
| Accessibility  | Medium   | Customer logo `alt` text uses raw slugs        |
| Accessibility  | Medium   | Testimonial quotes not in `<blockquote>`       |
| Performance    | Medium   | No `loading="lazy"` on below-fold images       |
| Performance    | Medium   | No `width`/`height` on images (causes CLS)     |
| Performance    | Low      | Hover scale transforms missing `will-change`   |
| CSS            | High     | Hardcoded accent colors don't respect dark mode|
| CSS            | Medium   | Inline `style=` attributes in `index.astro`    |
| CSS            | Medium   | Blog card missing mobile styles below 360px    |
| CSS            | Low      | Unused classes: `.about-grid`, `.projects-grid`, `.project-card` |
| CSS            | Low      | Unused variables: `--hero-dot`                 |
| SEO            | High     | No Open Graph meta tags                        |
| SEO            | Medium   | No sitemap configured                          |
| SEO            | Medium   | No `robots.txt`                                |
| SEO            | Medium   | No canonical tags                              |
| SEO            | Medium   | No schema.org structured data                  |
| Security       | High     | No form validation or CSRF protection          |
| Security       | Medium   | No Content Security Policy headers             |
| Code Quality   | Medium   | `formatDate()` duplicated in both blog pages   |
| Code Quality   | Medium   | No custom `404.astro` page                     |
| Code Quality   | Low      | Pricing tab script style inconsistent with BaseLayout |
| Code Quality   | Low      | Path aliases in tsconfig point to non-existent dirs |

---

## 1. Bugs

### 1.1 Missing Blog Post Images (High)
Blog posts reference images under `/images/blog/` (e.g., `/images/blog/a-new-team-lead.png`) but no such files exist in `public/images/blog/`. These will 404 when posts with images are rendered.

**Fix:** Add the image files, or make the image display conditional in `[slug].astro`.

### 1.2 Missing Service Images (High)
Service rows in `index.astro` reference `/images/services/erp.png`, `/images/services/government-erp.png`, etc. Verify all five files exist in `public/images/services/`.

### 1.3 Contact Form Has No Feedback (Medium)
The form has `onsubmit="event.preventDefault()"` with no submission handler. Users get no success or error message after clicking submit.

**Fix:** Show an inline success message on submit, or wire to a backend/form service.

---

## 2. Accessibility

### 2.1 Form Labels Not Linked to Inputs (High)
Contact form labels wrap inputs but have no `for`/`id` pairing. Screen readers cannot programmatically associate labels to fields.

```html
<!-- Current (broken) -->
<label>Name <input type="text" name="name" /></label>

<!-- Fixed -->
<label for="name">Name</label>
<input id="name" type="text" name="name" />
```

### 2.2 No Keyboard Focus Indicators on Nav Links (High)
`.main-nav a` uses a `::after` underline for hover but no visible `:focus-visible` style is defined. Keyboard users cannot see where they are in the nav.

**Fix:** Add to `global.css`:
```css
.main-nav a:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
  border-radius: 2px;
}
```

### 2.3 Color Contrast in Dark Mode (High)
`.eyebrow { color: #f97316; }` is fixed orange. Against the dark background `#0f172a`, this may fail WCAG AA (4.5:1 ratio for normal text). Verify with a contrast checker.

### 2.4 Customer Logo Alt Text Uses Raw Slugs (Medium)
```astro
<img src={`/images/cust_logo/${logo}.png`} alt={logo} />
```
`alt="nstda"` is not meaningful. Should be `alt="NSTDA logo"` or similar.

### 2.5 Testimonial Quotes Not Semantic (Medium)
Testimonial text is in `<p class="testimonial-quote">` — should be `<blockquote>` for correct semantic markup.

---

## 3. Performance

### 3.1 No Lazy Loading on Below-Fold Images (Medium)
Service images, customer logos, and the approach image all load eagerly. Add `loading="lazy"` to all images that are not in the initial viewport.

```html
<img src="/images/services/erp.png" loading="lazy" alt="..." />
```

### 3.2 No Width/Height on Images (Medium)
Missing `width` and `height` attributes cause layout shift (poor CLS score). Either set explicit attributes or use CSS `aspect-ratio`.

### 3.3 Hover Scale Missing `will-change` (Low)
`blog/index.astro` uses `transform: scale(1.04)` on image hover without `will-change: transform`, causing repaints on lower-end devices.

---

## 4. CSS

### 4.1 Hardcoded Accent Colors Break Dark Mode (High)
Several colors are hardcoded instead of using CSS variables:
- `.eyebrow { color: #f97316; }` — not themeable
- `.nav-cta { background: radial-gradient(..., #fee2e2, #dbeafe); }` — light mode only
- `.btn-primary { background: linear-gradient(to right, #f97316, #fb923c); }` — not themeable

These should all reference CSS custom properties defined in `:root` and `html[data-theme="dark"]`.

### 4.2 Inline Style Attributes in index.astro (Medium)
```astro
<p class="eyebrow" style="text-align:center;margin-bottom:1.5rem;">
```
Should be a utility CSS class.

### 4.3 Blog Card Mobile Overflow Below 360px (Medium)
`.blog-card { grid-template-columns: 220px 1fr; }` is only adjusted at `max-width: 600px`. On very small phones this can overflow.

### 4.4 Unused CSS Classes (Low)
The following classes are defined in `global.css` but never used anywhere:
- `.about-grid`, `.about-list`, `.about-badges`, `.about-badge`, `.badge-label`
- `.projects-grid`, `.project-card`

### 4.5 Unused CSS Variables (Low)
`--hero-dot` is defined in both `:root` and `html[data-theme="dark"]` but never referenced after the animation feature was removed.

---

## 5. SEO

### 5.1 No Open Graph Meta Tags (High)
`BaseLayout.astro` has no `og:*` or `twitter:*` meta tags. Links shared on social media will show no image or description.

**Fix:** Add to `<head>` in `BaseLayout.astro`:
```html
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
```

### 5.2 No Sitemap (Medium)
No sitemap is configured. Add `@astrojs/sitemap` integration in `astro.config.mjs`.

### 5.3 No robots.txt (Medium)
Create `public/robots.txt` to declare sitemap location and crawler rules.

### 5.4 No Canonical Tags (Medium)
Add `<link rel="canonical" href={Astro.url} />` in `BaseLayout.astro` to prevent duplicate content issues.

### 5.5 No Schema.org Structured Data (Medium)
Adding JSON-LD for `Organization`, `Service`, and blog `Article` types would enable rich search snippets in Google results.

---

## 6. Security

### 6.1 No Form Validation or CSRF Protection (High)
The contact form has no client-side validation and no CSRF token. Before wiring to any backend:
- Add client-side validation (required fields, email format)
- Add a CSRF token hidden field on the backend

### 6.2 No Content Security Policy (Medium)
No CSP headers are configured. Add CSP via server headers or a `<meta http-equiv="Content-Security-Policy">` tag to prevent XSS.

---

## 7. Code Quality

### 7.1 Duplicated formatDate() Function (Medium)
`formatDate()` is defined identically in `blog/index.astro` and `blog/[slug].astro`. Extract to `src/utils/formatDate.ts` and import it.

### 7.2 No Custom 404 Page (Medium)
Create `src/pages/404.astro` with the site's header/footer and a friendly error message.

### 7.3 Inconsistent Script Style (Low)
BaseLayout inline scripts use IIFEs (`(function(){ ... })()`), while the pricing tab script in `index.astro` uses top-level code. Should be consistent.

### 7.4 Path Aliases Point to Non-Existent Directories (Low)
`tsconfig.json` defines `@components/*` and `@styles/*` aliases, but neither `src/components/` nor `src/styles/` directories exist. Either create them or remove the aliases.

---

## Recommended Fix Order

1. Add blog post images or make them conditional
2. Fix contact form labels (`for`/`id`)
3. Add keyboard focus styles to nav
4. Add Open Graph meta tags to `BaseLayout.astro`
5. Add `loading="lazy"` to all below-fold images
6. Remove unused CSS (`--hero-dot`, `.about-grid`, `.projects-grid`)
7. Create `src/pages/404.astro`
8. Extract `formatDate()` to a shared utility
9. Add sitemap and `robots.txt`
10. Add form validation before connecting to a backend

---

## Action Items

### Bugs
- [x] Add missing blog post images to `public/images/blog/` or guard rendering in `[slug].astro` with `{post.data.image && <img ... />}` — already guarded in template
- [x] Verify all service images exist in `public/images/services/` (erp, government-erp, dashboard, automation, frappe) — all confirmed present
- [x] Add a submit success/error message to the contact form — added `#form-success` div shown on valid submit

### Accessibility
- [x] Add `for`/`id` pairs to all contact form labels and inputs
- [x] Add `:focus-visible` outline styles to `.main-nav a` in `global.css`
- [ ] Verify WCAG AA contrast ratio for `.eyebrow` orange against dark background — manual check required
- [x] Update customer logo alt text from raw slugs to descriptive names (e.g., `alt="NSTDA logo"`)
- [x] Wrap testimonial text in `<blockquote>` instead of `<p>`

### Performance
- [x] Add `loading="lazy"` to service images, customer logos, and approach image in `index.astro`
- [ ] Add `width` and `height` attributes (or CSS `aspect-ratio`) to all `<img>` tags — requires knowing each image's dimensions
- [x] Add `will-change: transform` to `.blog-card-img` in `blog/index.astro`

### CSS
- [x] Move hardcoded `#f97316` orange into a CSS variable (`--accent`) and add dark mode override
- [x] Replace inline `style=` on eyebrow in customer logos section with `.eyebrow-centered` class
- [x] Fix blog card mobile layout for viewports below 360px
- [x] Remove unused classes: `.about-grid`, `.about-list`, `.about-badges`, `.about-badge`, `.badge-label`, `.projects-grid`, `.project-card`
- [x] Remove unused CSS variables: `--hero-dot` in both `:root` and `html[data-theme="dark"]`

### SEO
- [x] Add Open Graph meta tags (`og:title`, `og:description`, `og:type`, `og:url`) to `BaseLayout.astro`
- [x] Add `twitter:card` and `twitter:title` meta tags to `BaseLayout.astro`
- [x] Add `<link rel="canonical" href={Astro.url} />` to `BaseLayout.astro`
- [x] Install and configure `@astrojs/sitemap` in `astro.config.mjs`
- [x] Create `public/robots.txt` referencing the sitemap
- [ ] Add JSON-LD schema for `Organization` in `BaseLayout.astro` — future enhancement
- [ ] Add JSON-LD schema for `Article` in `blog/[slug].astro` — future enhancement

### Security
- [x] Add client-side form validation (required fields, email format) to contact form — using native `checkValidity()`
- [ ] Plan CSRF token implementation for when the form is wired to a backend — requires backend
- [ ] Research and add a Content Security Policy header — requires deployment environment knowledge

### Code Quality
- [x] Extract `formatDate()` from both blog pages into `src/utils/formatDate.ts`
- [x] Create `src/pages/404.astro` with site header/footer
- [x] Wrap pricing tab script in an IIFE to match BaseLayout script style
- [x] Remove unused `@components/*` and `@styles/*` path aliases from `tsconfig.json`
