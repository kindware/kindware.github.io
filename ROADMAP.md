# KindWare — Site Buildout Roadmap

Status: proposed (awaiting sign-off). Owner: lansd. Author: opencode session 2026-09-16.

## Goals

1. **Audience-first organization.** Visitors self-select: Gaming / Trades / Medical / IT. A BDO player should never scroll past construction math, and a contractor should never see game tools.
2. **Functional, not just a list.** Persistent nav, search, breadcrumbs, related tools, installable app.
3. **Scales without effort.** Adding a tool = drop one file + add one manifest entry. Pages render from the manifest.
4. **Desktop path preserved** (AGENTS.md): offline-first, pure functions, PWA first, Tauri later.

## Taxonomy (v2)

Categories (fixed, lowercase ids): `gaming`, `trades`, `medical`, `it`.
Cross-cutting tags (not sections): `calculator`, `converter`, `reference`, `estimate`, `odds`, `offline`.

**"Calculators" stops being a section** — it's a function type/tag. Existing tools remap:

| Tool | Old section | New section |
|---|---|---|
| BDO Cooking Companion | Gaming | gaming |
| Remodel & Trades Calculator | Trades | trades |
| Dilution & Syringe Calculator | Calculators | **medical** |

Planned residents: gaming → dice odds, loot splitter, BDO enhancement cost. trades → paint/tile/concrete standalone, board feet, stair stringers. medical → math-only calculators (unit conversion, infusion math, BMI is borderline) with standing "not medical advice" notice. IT → subnet, aspect ratio, WCAG contrast, JWT decoder, timestamp converter, hash generator, cron parser.

## URL structure (target)

```
/                      welcome + routing
/gaming/  /trades/  /medical/  /it/     section landing pages
/tools/                all tools + search/filter
/tools/<section>/<tool>.html            tool pages
/manifest.json  /site.webmanifest  /sw.js
```

Migration: move tool files under `/tools/<section>/`; leave tiny meta-refresh stubs at old paths so existing shared links keep working. Keep `download="kindware-<name>.html"` filenames stable. Downloaded copies are self-contained and unaffected.

## Manifest v2 schema

```json
{
  "schemaVersion": 2,
  "tools": [{
    "id": "bdo-cooking-companion",
    "name": "BDO Cooking Companion",
    "category": "gaming",
    "tags": ["reference", "offline"],
    "description": "…",
    "href": "tools/gaming/bdo-cooking-companion.html",
    "status": "active",
    "featured": false,
    "added": "2026-09-16",
    "updated": "2026-09-16"
  }]
}
```

Section config (in a shared `assets/site.js`): id, title, blurb, accent color, icon.

## Pages

1. **Home (welcome/routing).** Hero → "Pick your area" 4 large cards with live tool counts → "See everything" link. Returning visitors get a "Welcome back — jump back in" block (last tool) plus 2-3 suggestions. "New" badges for recently added.
2. **Section pages.** Blurb, tool cards rendered from manifest, "coming soon" items, support block, per-section accent.
3. **All-tools directory.** Search box (name/description/tags, client-side), filter chips by tag, sort newest/name. This is the "functional" power page.
4. **Tool page template (standardized).** Top nav (home + 4 sections), breadcrumb `Section / Tool`, title + one-line description, ⬇ Download, the tool, "Related in this section" (tag overlap, max 3), footer. Every tool links up; no dead ends.
5. **Support block** on home + sections (not on tool pages — keep tools clean).

## "You might be interested" logic (zero trackers)

localStorage only: `kw.lastSection`, `kw.lastTools[3]`, `kw.seen[]`.

- First visit → section picker (the welcome screen).
- Return visit → "Welcome back: jump back into X" + 3 picks from that section + "what's new".
- On tool pages → Related = same category, rank by tag overlap, then newest.
- `featured: true` in manifest for manual curation (launch picks).

## Visual system

Brand chrome unchanged (mint on charcoal). Section accents used only for pills, breadcrumbs, and section headers:
gaming `#a78bfa` (violet) · trades `#e0b458` (amber, already used) · medical `#f0879b` (rose) · it `#58a6ff` (sky).
Body/background tokens stay identical everywhere; accents must pass contrast on `#161b22`.

## PWA (installable + fully offline)

- `site.webmanifest`: name KindleWare, icons from brand kit, `display: standalone`, theme `#0d1117`.
- `sw.js`: precache shell + all tool pages + manifest; cache-first, versioned. Result: whole site works offline, installable via Chrome/Edge ("Install app"), and it's the foundation for the Tauri wrapper later.

## Roadmap phases

- **Phase 0 — housekeeping (30 min):** freeze taxonomy; remap dilution to medical in manifest/README/hub now.
- **Phase 1 — foundation (~1 session):** `site.js` (sections + render helpers); 4 section pages; all-tools directory with search; welcome home; standardized tool header/breadcrumb/related injected into existing tools; shared nav.
- **Phase 2 — PWA + polish:** webmanifest + service worker; recently-viewed; featured/new badges; section accents; URL migration with stubs.
- **Phase 3 — scale:** `node scripts/new-tool.mjs` scaffolder (creates tool page from template, registers in manifest, adds hub card); per-section agent workflow for content; quarterly "site health" pass (link check, lighthouse).

## Decisions needed

1. Fold Calculators into the four sections (dilution → Medical)? *(recommended: yes)*
2. Section accent colors as listed, or keep mint-only chrome? *(recommended: accents as listed)*
3. Do URL migration in Phase 2 with stubs — OK?
4. Anything to add to the IT shortlist (top candidate for volume)?
5. Sign off on Phase 1 to start?
