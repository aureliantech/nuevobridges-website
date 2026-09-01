# NuevoBridges Law — client preview

One folder that works two ways: **double-click `index.html`** to view the site
off disk, or **deploy the folder as-is** to Vercel.

## What's what

Nine pages, one file each, at the top level:

| Page file | Its stylesheet | Deployed URL |
| --- | --- | --- |
| `index.html` | — | `/` |
| `about.html` | `assets/css/page-about.css` | `/about/` |
| `practice-areas.html` | `assets/css/page-practice-areas.css` | `/practice-areas/` |
| `h2a-visas.html` | `assets/css/page-h2a-visas.css` | `/h2a-visas/` |
| `ice-detention-habeas.html` | `assets/css/page-ice-detention-habeas.css` | `/ice-detention-habeas/` |
| `truck-accidents.html` | `assets/css/page-truck-accidents.css` | `/truck-accidents/` |
| `faq.html` | `assets/css/page-faq.css` | `/faq/` |
| `contact.html` | `assets/css/page-contact.css` | `/contact/` |

Everything else lives under `assets/`:

```
assets/css/     tokens.css, fonts.css, site.css  ← shared by every page
                page-*.css                       ← one per page, named to match
assets/js/      loader, drawer, hero, reviews, faq, reveal, cursor
assets/fonts/   Lora + Switzer woff2, plus both licences
assets/images/  h2a/ crop photos
assets/logo/    lockups and monograms
assets/favicons/, assets/og/
```

Every page loads `tokens.css`, `fonts.css`, `site.css`, then its own
`page-*.css`. Change something in `site.css` and it moves everywhere; change a
`page-*.css` and it only moves that page.

## Deploying

Push the folder contents to a repo root and import in Vercel. Framework preset
**Other**, no build command. `vercel.json` sets `cleanUrls`, which is what
turns `about.html` into `/about/` — that's why no page needs its own folder.

Note: the three practice-area pages now sit at `/h2a-visas/` rather than
`/practice-areas/h2a-visas/`. Say the word if you want the nesting back.

## Still placeholder

- **Phone `575-000-0000`** (`tel:+15750000000`). Every link carries
  `data-placeholder="phone"` — search that to find them all.
- **Photography** — planes marked "Placeholder," including the founder
  portrait. Only the H-2A page has real photos.
- Pages carry `noindex, nofollow` and `robots.txt` disallows crawling. Remove
  both before launch.

## Two things that look odd but are deliberate

- **Links point at `about.html`, not `/about/`.** A browser opening a file off
  disk can't turn `/about/` into a real file. Relative `.html` links work both
  locally and on the server, where `cleanUrls` redirects them to the clean URL.
- **Fonts are embedded as data URIs in `assets/css/fonts.css`.** Chrome blocks
  `@font-face` files loaded over `file://`, so a linked woff2 would silently
  fall back to Helvetica when you open a page locally. The loose woff2 files
  are still in `assets/fonts/` if you'd rather serve them normally.
