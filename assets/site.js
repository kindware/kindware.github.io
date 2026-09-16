const KW_SECTIONS = [
  { id: "gaming", title: "Gaming", accent: "#a78bfa", blurb: "Black Desert helpers, dice math, loot splitting — game-night utilities." },
  { id: "trades", title: "Trades", accent: "#e0b458", blurb: "Remodel and construction estimates: paint to HVAC." },
  { id: "medical", title: "Medical", accent: "#f0879b", blurb: "Math-only calculators. No advice, no dosing recommendations." },
  { id: "it", title: "IT", accent: "#58a6ff", blurb: "Developer and sysadmin utilities that run in the browser." },
]

const kwSection = (id) => KW_SECTIONS.find((s) => s.id === id)

async function kwManifest() {
  const r = await fetch("/manifest.json", { cache: "no-cache" })
  if (!r.ok) throw new Error("manifest " + r.status)
  return r.json()
}

function kwCard(t) {
  const s = kwSection(t.category)
  const accent = s ? s.accent : "var(--accent)"
  const label = s ? s.title.toUpperCase() : t.category.toUpperCase()
  return `<div class="card">
    <a class="card-main" href="/${t.href}">
      <span class="pill" style="color:${accent};border-color:${accent}">${label}</span>
      <h3>${t.name}${t.featured ? '<span class="badge">FEATURED</span>' : ""}</h3>
      <p>${t.description}</p>
    </a>
    <div class="card-actions">
      <a href="/${t.href}">Open</a>
      <a href="/${t.href}" download="kindware-${t.id}.html">⬇ Download</a>
    </div>
  </div>`
}

async function kwRenderSectionTools(sectionId, gridId) {
  const el = document.getElementById(gridId)
  if (!el) return
  try {
    const m = await kwManifest()
    const tools = m.tools.filter((t) => t.category === sectionId && t.status === "active")
    el.innerHTML = tools.length ? tools.map(kwCard).join("") : '<p class="muted">Nothing here yet — check back soon.</p>'
  } catch {
    el.innerHTML = '<p class="muted">Could not load the tool list. Browse <a href="/tools/">all tools</a> instead.</p>'
  }
}

function kwTrackSection(id) {
  try { localStorage.setItem("kw.lastSection", id) } catch {}
}

async function kwHome() {
  try {
    const m = await kwManifest()
    const active = m.tools.filter((t) => t.status === "active")
    for (const s of KW_SECTIONS) {
      const c = document.getElementById("count-" + s.id)
      if (c) {
        const n = active.filter((t) => t.category === s.id).length
        c.textContent = n === 1 ? "1 tool" : n + " tools"
      }
    }
    const newest = [...active].sort((a, b) => String(b.added).localeCompare(String(a.added))).slice(0, 3)
    const ng = document.getElementById("newest-grid")
    if (ng) ng.innerHTML = newest.map(kwCard).join("")
    const last = localStorage.getItem("kw.lastSection")
    const sec = last ? kwSection(last) : null
    if (sec) {
      const wb = document.getElementById("welcome-back")
      const picks = active.filter((t) => t.category === sec.id).slice(0, 3)
      if (wb) {
        wb.style.display = "block"
        const h = wb.querySelector("h3")
        if (h) h.textContent = "Welcome back — jump into " + sec.title
        const p = wb.querySelector(".picks")
        if (p) {
          p.innerHTML = picks.map((t) => `<a href="/${t.href}">${t.name}</a>`).join(" · ") +
            ` · <a href="/${sec.id}/">all ${sec.title} tools</a>`
        }
      }
    }
  } catch {}
}

async function kwDirectory() {
  const grid = document.getElementById("dir-grid")
  const input = document.getElementById("search")
  const chipBox = document.getElementById("chips")
  const countEl = document.getElementById("count")
  if (!grid || !input || !chipBox) return
  let all = []
  try {
    const m = await kwManifest()
    all = m.tools.filter((t) => t.status === "active")
  } catch {
    grid.innerHTML = '<p class="muted">Could not load the tool list — refresh to try again.</p>'
    return
  }
  let activeTag = null
  const tags = [...new Set(all.flatMap((t) => t.tags || []))].sort()
  chipBox.innerHTML = tags.map((tag) => `<button class="chip" data-tag="${tag}">${tag}</button>`).join("")
  chipBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip")
    if (!btn) return
    const tag = btn.dataset.tag
    activeTag = activeTag === tag ? null : tag
    for (const c of chipBox.children) c.classList.toggle("active", c.dataset.tag === activeTag)
    render()
  })
  input.addEventListener("input", render)
  function render() {
    const q = input.value.toLowerCase()
    const list = all.filter((t) =>
      (!activeTag || (t.tags || []).includes(activeTag)) &&
      (!q || (t.name + " " + t.description + " " + (t.tags || []).join(" ")).toLowerCase().includes(q)))
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? " tool" : " tools")
    grid.innerHTML = list.length ? list.map(kwCard).join("") : '<p class="muted">Nothing matches that search.</p>'
  }
  render()
}
