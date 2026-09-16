# KindWare — build notes for agents

Free tools hub. Site: https://kindware.github.io · Repo: `kindware/kindware.github.io` (gh CLI is authenticated as `kindware`).

## Layout

- `index.html` — hub. Sections per ROADMAP.md: Gaming, Trades, Medical, IT + Support block. Site buildout plan lives in `ROADMAP.md` (read it before structural changes).
- `tools/<tool>.html` — one self-contained file per tool.
- `assets/` — brand kit: `logo.png` (512 transparent), `logo-96.png` (inline use), `avatar-500.png`, `favicon-32/48.png`, `social banners`, `og-image-1200x630.png`.
- `manifest.json` — **registry of every tool** (id, name, category, description, href, status, added). Update it with every new tool, plus the hub card and README table.
- `_work/`, `work/` — scratch (gitignored): plans and per-section modules from branch-verify workflows.

## Conventions (must-follow)

1. **Single self-contained HTML per tool.** No build step, no CDNs, no external requests. Works opened straight from disk.
2. **Inline assets as data URIs** (logo-96, favicon-32) so a downloaded file renders correctly offline.
3. **Every tool ships a ⬇ Download button** — `href` = its own file, `download="kindware-<name>.html"`. Hub cards carry `Open` + `⬇ Download` actions.
4. **Pure calc functions separated from DOM** (`calc(inputs) -> outputs`, no formatting inside) so logic is testable and reusable outside the page.
5. **Safe ceil for all "buy/units" rounding:** `ceilSafe(x) = Math.ceil(x - 1e-9)` (avoids `880.0000000000001 → 881` float bugs).
6. **Inputs clamp at 0; outputs never NaN/Infinity.**
7. **Theme tokens:** bg `#0d1117`, panel `#161b22`, panel-2 `#1c2430`, text `#e6edf3`, dim `#8b949e`, accent `#6ee7a8`, border `#262d36`.
8. **Truthful math:** label estimates, show the formula for hand-checking, disclaimers where the domain is risky (medical tools are math-only, never dosing advice).
9. **Verify before shipping.** Browser harness with hand-computed expected values. For multi-section tools: write the spec in `_work/`, branch agents to build/verify pure modules in `work/sections/`, merge, then run one integration pass.
10. **Site chrome is shared, tools are standalone.** Home, section pages (`/gaming/ /trades/ /medical/ /it/`) and `/tools/` use `assets/site.css` + `assets/site.js` and render tool lists from `manifest.json`. Tool pages must NEVER depend on site.js — they stay self-contained for offline download.
11. **Support CTA on every page:** a "Like my work? Buy me a coffee" block (Ko-fi + GitHub Sponsors) on home/sections/directory; a compact support link on tool pages.
12. **SEO hygiene:** every page gets unique title/description + canonical + og tags; add any new page/tool to `sitemap.xml`.

## Desktop path (PRINCIPLE — remember on every build)

Every tool must remain shippable as a **desktop app** for a non-technical user. Keep builds compatible with this path:

- **Offline-first, zero backend.** No server, no accounts, no external fetches. State in `localStorage` only.
- **No browser-only traps without fallback** (avoid APIs that break in a wrapper; keep links relative + assets inline; handle `file://` gracefully).
- **Pure functions stay pure** so a wrapper reuses them unchanged.
- **Progression when requested:** (1) add a web app manifest + service worker so Chrome/Edge offer "Install app"; (2) wrap with Tauri (or Electron) for a real .exe/.dmg/.deb — same HTML, no rewrite.
- When a tool needs bigger data (datasets, images), keep it bundled/local rather than fetched.

## Publishing a new tool

1. Build `tools/<name>.html` to conventions above. 2. Verify (harness). 3. Add hub card in the right section. 4. Add manifest entry. 5. Update README table. 6. `git add -A && git commit && git push`. 7. Poll the live URL until 200 (Pages takes ~30-90s).
