# NuevoBridges Law — handover

Static site. No build step: open `index.html`, or drop the folder on any
host. `vercel.json` sets `cleanUrls` and `trailingSlash`, so
`h2a-visas.html` serves as `/h2a-visas/`.

---

## Blockers before launch

These will break things or create real exposure if missed.

**1. The phone number is a placeholder.**
Every client-facing page uses `575-000-0000` / `tel:+15750000000`. Find
them all by searching `data-placeholder="phone"` — the attribute exists
for exactly this purpose. The legal interns page deliberately uses the
real firm number, `+1 771-888-4739`, because its CTAs are about the
internship rather than client intake.

**2. The site is set to noindex.**
`robots.txt` disallows everything, and every page carries
`<meta name="robots" content="noindex, nofollow, noarchive">`. Both are
correct while previewing and both must be removed to go live.

**3. Three photographs load from a CDN.**
Search `TEMPORARY:` in the HTML. Hotlinking is fine for review and wrong
for a law firm's live site — a third party can change or remove the file.
Download each at full resolution, drop it in `assets/images/`, and swap
the `src`. All are free for commercial use (Unsplash / Pexels licences).

**4. The testimonial form has no endpoint.**
`submit-a-testimonial.html` posts to `#`. Point it at Clio, Formspree, or
a mail script. Field names are `name`, `email`, `phone`, `testimonial`,
`rating`, `consent`.

**5. Reviews are still sample copy.**
`reviews.html` carries four quotes marked SAMPLE. Publishing invented
testimonials is a bar-rules problem, not a taste one. Replace with real
ones, or take the page out of the nav, before launch.

---

## Needs the attorney's sign-off

Nothing on the site is flagged in the markup any more, but these claims
were written from the bio and the market brief rather than confirmed:

- **Detention facilities.** Naming Otero, Cibola and Torrance commits her
  to working them, and to filing in the District of New Mexico.
- **Out-of-district filings.** The habeas page implies she files
  elsewhere; the trucking page says New Mexico crashes only.
- **Fee language.** "No fee unless we recover" appears in the trucking
  hero and ledger. Most bars require a companion disclosure about whether
  the client owes case expenses regardless of outcome. That sentence is
  not yet on the page.
- **Trucking statute of limitations.** Deliberately not stated as a
  number anywhere.
- **Credentials.** Tenth Circuit, D.N.M., and "J.D. and M.B.A., American
  University" came from the bio document. Worth confirming they are
  current.
- **Outcome language.** The H-2A headline "We do the paperwork. You get
  workers." and the hero "We bring in legal farm workers" are outcome
  claims of the kind most bars restrict. The three numbered steps below
  them were already rewritten from "we get" to "we handle"; these two
  were left as approved but flagged.
- **"Se habla español"** appears on several pages. Confirm intake really
  does answer Spanish calls, since the promise is made before anyone
  picks up.

---

## Still missing

**Gina's portrait.** The plate is built and waiting on four pages —
homepage, H-2A, habeas, trucking. It holds the firm's monogram on the
navy portrait grade rather than a grey PLACEHOLDER box, so the pages read
as finished rather than unfinished. When the photograph arrives, swap the
`<img class="gina-frame__mark">` for the real image; nothing else moves.

This is the single most valuable missing asset on the site.

**Real client photography.** The farm, courthouse and highway images are
stock.
One photograph from an actual client operation would outperform all of
them, and it is the only imagery a competitor cannot also be using.

---

## Structure

```
index.html                  Homepage — routing and a phone call
practice-areas.html         The same routing cards, as a landing page
h2a-visas.html              Farm labor (nationwide)
ice-detention-habeas.html   ICE detention (nationwide)
truck-accidents.html        Truck accidents (New Mexico only)
about.html                  Gina, the through-line, credentials
contact.html                Phone, hours, coverage
faq.html                    20 questions across five clusters
legal-interns.html          Internship recruitment, with WCL
submit-a-testimonial.html   Testimonial form
reviews.html                Still SAMPLE quotes

assets/css/
  tokens.css                Colour, type scale, spacing
  fonts.css                 Lora + Switzer, self-hosted as data URIs
  site.css                  Shared chrome and components
  page-*.css                One per page, scoped to a body class
assets/js/                  Drawer, hero, FAQ, reveal, loader, cursor
assets/images/h2a/          Local photography + ATTRIBUTION.txt
```

**Shared objects.** The ledger, the numbered track, the crimson
left-rule list, the call-now band and the monogram portrait plate are
used identically across pages. If one changes, change it everywhere or
the pages stop reading as one site.

**Structured data is generated from page content.** Every JSON-LD
FAQPage block was rebuilt from the questions actually on each page, so
the two cannot drift. If you edit an FAQ answer, update the schema in the
same file's `<head>` — or the rich result will quote copy nobody can find.

**A fix worth promoting into `site.css`.** The FAQ accordion left ~44px
of empty panel on every closed item, because the answer's bottom margin
sits outside the collapsing grid row. It is corrected in three page
stylesheets. Every page with an accordion has the same gap.

---

## Editing conventions

- **Fonts are self-hosted** in `fonts.css` as base64. No network request,
  no Fontshare dependency.
- **Artificial placeholders are deliberate.** Where a photograph is
  missing, the plate carries a brand gradient or the monogram — never a
  grey box with the word PLACEHOLDER, which reads as a broken page.
- **Reduced motion is respected** throughout: parallax, reveals, hover
  lifts and image pushes all disable under
  `prefers-reduced-motion: reduce`.
- **Mobile hero tuning.** Every page tightens its hero below 900px so the
  call button clears the fold. If a headline gets longer, re-check it.
