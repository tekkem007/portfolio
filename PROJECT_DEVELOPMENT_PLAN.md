# PROJECT_DEVELOPMENT_PLAN.md

Permanent development handover for the **Vishnu Vardhan Tekkem portfolio**.

---

## 1. Document Information

| Field | Value |
| --- | --- |
| **Purpose** | Complete project-context reference, architecture guide, status report, error/fix history, decision log, change-management guide and roadmap. Written so a developer or AI agent with **no access to prior conversations** can safely work on this repository. |
| **Date generated** | 2026-07-28 |
| **Repository name** | `tekkem007/portfolio` |
| **Repository root** | Repository root (the folder containing `package.json`, `index.html`, `vite.config.ts`, `.git`). Local working copy directory name is `tekkem007.github.io`, which **no longer matches the repo name** — see DEC-013. |
| **Portfolio owner** | Vishnu Vardhan Tekkem — 3D Team Lead & Environment Artist, Pune, Maharashtra, India. *Confirmed* (résumé + ArtStation profile + owner statements). |
| **Current branch** | `main` |
| **Current commit** | `3cec3dd03077db110f59db5b29ac280d94198318` |
| **Working-tree status** | Clean at inspection (`git status --porcelain` → 0 entries), in sync with `origin/main`. |
| **Main stack** | Vite 7 · React 19 · TypeScript (strict) · Three.js · GSAP · plain CSS custom properties |
| **Package manager** | npm (`package-lock.json` present; CI uses `npm ci`) |
| **Runtime** | CI pins **Node 22** (`.github/workflows/deploy-pages.yml`). Local inspection ran **Node v24.15.0 / npm 11.12.1** successfully. No `engines` field in `package.json`. |
| **Dev command** | `npm run dev` |
| **Build command** | `npm run build` |
| **Test command** | **None.** No test framework is installed and there is no `test` script. |
| **Lint command** | `npm run lint` |
| **Typecheck command** | `npm run typecheck` — **BROKEN**, see ERR-008. CI uses `npx tsc -b` instead, which works. |
| **Deployment** | GitHub Actions → GitHub Pages (`.github/workflows/deploy-pages.yml`) |
| **Production URL** | <https://tekkem007.github.io/portfolio/> — *Confirmed live* (HTTP 200 on all routes at inspection) |
| **Last known local run** | `npm run dev` **not run during inspection**. `npm run build` succeeded; `npm run serve:dist` served the build successfully. |
| **Last known build state** | **Passing.** Clean-clone `npm ci && npm run build` verified successfully (189 files emitted). |
| **Last known deployment** | **Success.** Workflow run **#7**, `2026-07-28T13:29:29Z`, conclusion `success`. Runs #1 and #2 failed (see ERR-005). |

### Areas that could NOT be inspected

| Area | Why |
| --- | --- |
| Visual appearance of the site | No screenshot was ever captured. The automation browser pane never composited frames. **No human or agent has confirmed how this site looks.** |
| All animation behaviour | The test browser produced **0 requestAnimationFrame callbacks in 600 ms**. GSAP reveals, the WebGL hero, the study scenes and the scroll-spy highlight could never be observed running. |
| Real-device / real-browser behaviour | Only the automation browser was used. No Chrome, Firefox, Safari, iOS or Android testing. |
| GitHub Pages repository settings UI | Not accessible via unauthenticated API. Pages source was set by the owner. |
| LinkedIn profile content | LinkedIn returns HTTP 429/999 to all automated requests. |
| Lighthouse / Core Web Vitals | No performance report was ever generated. |

---

## 2. Executive Summary

**What it is.** A static, prerendered portfolio site presenting Vishnu Vardhan Tekkem as a 3D Team Lead and Environment Artist working in Unreal Engine 5, Blender and Substance 3D Painter, with a secondary strand of AI-assisted prototyping and pipeline tooling. It is deployed to GitHub Pages as a **project site** under the `/portfolio/` path.

**Audience.** Recruiters, studio leads and hiring managers in games / real-time 3D, plus potential collaborators.

**Design direction.** One dark design system with two accent modes — "real-time worlds" (warm amber `#f2a24b`) and "intelligent systems" (cool cyan `#63cfdd`). Those two colours are taken from lighting pairings Vishnu describes in his own ArtStation write-ups. Layout is centred and calm, with media allowed to break wider than text on large displays.

**Development state.** Feature-complete against its current content and **fully deployed**. Every route returns 200, the build passes from a clean clone, lint passes, and structural/accessibility checks pass across 35 route × viewport combinations. What it lacks is not code — it is **visual and behavioural verification by a human**, plus more content.

### Estimated completion: **80–88%**

Calculated from:

- **Implemented and structurally verified (raises estimate):** all planned sections exist and are populated with real content; 3 full case studies; 12 projects; 5 roles; responsive layout verified 360–2560 px with zero overflow; SEO, sitemap, structured data, manifest and 404 all present and live; CI/CD green.
- **Reduces estimate:** *nothing about the visual result has been confirmed by eye* (~6–8% withheld); all motion is unverified (~3%); no automated tests exist (~2%); `npm run typecheck` is broken (~1%); several owner-confirmation items remain open.

The range, not a single number, reflects that the largest unknown — "does it actually look and feel right?" — cannot be resolved from the repository.

| | |
| --- | --- |
| **Most complete** | Case studies, Selected Work, media pipeline, deployment, SEO metadata, content data layer |
| **Least complete** | Automated testing (none), verified visual/motion QA, `npm run typecheck` |
| **Major content gaps** | Only 3 of 12 projects have full case studies; no employer-work case study (owner-restricted); no testimonials, blog or certifications |
| **Major technical problems** | ERR-008 broken `typecheck` script; ERR-009 `@types/three` / `three` version mismatch; ERR-010 `robots.txt` inert on a project site |
| **Major design/usability risk** | The entire visual design is **unverified by a human** |
| **Major deployment risk** | Low. CI is green and reproducible. Main residual risk is DEC-004 (project-site base path) breaking if the repo is renamed |

### Highest-priority next actions

1. **P0 —** Owner opens the live site on desktop, ultrawide and a real phone and reports visual/motion defects (TASK-001).
2. **P1 —** Fix the broken `typecheck` script (TASK-002, one line).
3. **P1 —** Align `@types/three` with `three` (TASK-003).
4. **P2 —** Resolve the ArtStation headline mismatch (TASK-004, owner action).
5. **P2 —** Introduce a minimal automated test setup (TASK-005).

---

## 3. Portfolio Purpose and Intended Experience

| Aspect | Detail | Confidence |
| --- | --- | --- |
| Represents | Vishnu Vardhan Tekkem | Confirmed |
| Role | 3D Team Lead & Environment Artist | Confirmed (résumé) |
| Location | Pune, Maharashtra, India | Confirmed |
| Audience | Recruiters, studio leads, collaborators in games / real-time 3D | Inferred from copy and CTA |
| Visitor goal | Judge craft quickly, then read depth on selected work | Inferred |
| Core message | Environment art that survives a real-time budget, plus the production discipline to lead a team | Inferred from `src/content/profile.ts` |
| Tone | Confident, specific, evidence-first; avoids adjectives and unmeasured metrics | Confirmed by content rules in `src/content/types.ts` |
| Visual style | Dark, cinematic, restrained; two accent modes | Confirmed in `src/styles/tokens.css` |
| Navigation | Single scrolling home page + 3 prerendered case-study routes | Confirmed |
| Conversion actions | Email (`mailto:`), résumé download, ArtStation / LinkedIn / GitHub links | Confirmed in `src/pages/Home.tsx` |
| Devices | 360 px phone → 2560 px ultrawide, explicitly designed for | Confirmed by breakpoints in `src/styles/tokens.css` |
| Accessibility target | WCAG-conscious; AA contrast, keyboard operable, reduced-motion honoured. **No formal audit performed** | Partially verified |
| Languages | English only (`<html lang="en">`) | Confirmed |

### Scope boundaries (owner-set, do not violate)

1. **Employer work is described in words only.** No screenshots, video, level names, product names or assets from the Analyzer Tensor / Analyzer CAE Unreal project may appear. See DEC-006.
2. **Godot is editor familiarity only.** No claim of GDScript, C#, gameplay programming or production Godot work. The owner's public `vir` repo is deliberately **not linked**. See DEC-007.
3. **No phone number anywhere.** See DEC-008.
4. **No invented metrics.** Where a saving was not measured, the structural claim is made instead.

---

## 4. Technology Stack

| Technology | Version (installed) | Purpose | Where Configured | Status | Risks / Notes |
| --- | --- | --- | --- | --- | --- |
| Vite | 7.3.6 | Build tool, dev server, SSR build | `vite.config.ts` | Active | v8.1.5 available (major) |
| React | 19.2.8 | UI | `src/main.tsx`, `src/App.tsx` | Active | Hydrates prerendered HTML |
| React DOM | 19.2.8 | DOM + `renderToString` for prerender | `src/entry-server.tsx` | Active | — |
| TypeScript | 5.9.3 | Types, strict mode | `tsconfig*.json` | Active | v7.0.2 available (major). Strict + `noUnusedLocals` + `noUnusedParameters` |
| Three.js | **0.181.2** | Hero scene + case-study study scenes | `src/lib/scene.ts`, `src/lib/studyScene.ts` | Active | **Mismatch with `@types/three` 0.185.1 — see ERR-009.** 183 kB gz, dynamically imported |
| `@types/three` | **0.185.1** | Three.js types | `package.json` devDeps | **Mismatched** | Types are 4 minor versions ahead of runtime |
| GSAP + ScrollTrigger | 3.15.0 | Scroll reveals only | `src/lib/motion.ts` | Active | Dynamically imported; 18 kB gz for ScrollTrigger |
| sharp | 0.34.5 | Build-time image derivatives | `scripts/optimise-media.mjs` | Active (dev only) | Never ships to client |
| ESLint | 9.39.5 | Linting | `eslint.config.js` (flat config) | Active, passing | v10.8.0 available (major) |
| `@vitejs/plugin-react` | 5.2.0 | React fast refresh / JSX | `vite.config.ts` | Active | v6.0.4 available (major) |
| reportlab (Python) | Not pinned | Generates the résumé PDF | `scripts/build-resume.py` | Active (manual) | **Not in `package.json`.** Requires `pip install reportlab`. Version unrecorded |
| GitHub Actions | — | CI/CD | `.github/workflows/deploy-pages.yml` | Active, green | Node pinned to 22 |

### Not present (deliberately)

No CSS framework, no web fonts, no component library, no state library, no router library, no test framework, no analytics, no CMS, no backend, no environment variables, no third-party APIs at runtime.

### Outdated dependencies (from `npm outdated`)

`@eslint/js` 9→10 · `@types/node` 24→26 · `@vitejs/plugin-react` 5→6 · `eslint` 9→10 · `globals` 16→17 · `sharp` 0.34→0.35 · `three` 0.181→0.185 · `typescript` 5→7 · `vite` 7→8.

All are **major** bumps except `sharp`. None are security-blocking as far as is known (**no `npm audit` was run — Unverified**). Nothing forces an upgrade; the build is green as pinned.

---

## 5. Repository Structure

```
.
├── .github/workflows/deploy-pages.yml   CI: lint → typecheck → build → Pages deploy
├── .claude/launch.json                  Local preview-server config (tooling only)
├── index.html                           Vite template; contains <!--app-head--> / <!--app-html--> markers
├── package.json / package-lock.json     Scripts + pinned deps
├── vite.config.ts                       base: '/portfolio/'
├── tsconfig.json / .app.json / .node.json  Project references, strict
├── eslint.config.js                     Flat config
├── README.md                            Human-facing setup + editing guide
├── LICENSE                              MIT for code; artwork explicitly excluded
├── PROJECT_DEVELOPMENT_PLAN.md          This document
├── public/
│   ├── media/                           223 committed image derivatives (7.3 MB)
│   ├── Vishnu-Vardhan-Tekkem-Resume.pdf Generated, phone-free
│   ├── favicon.svg  robots.txt  site.webmanifest
├── scripts/
│   ├── media-manifest.mjs               SOURCE OF TRUTH for images (URLs, dims, alt text)
│   ├── fetch-media.mjs                  Downloads originals → media-src/ (gitignored)
│   ├── optimise-media.mjs               sharp → derivatives + media.generated.json; removes orphans
│   ├── prerender.mjs                    Renders each route to real HTML + sitemap + .nojekyll
│   ├── serve-dist.mjs                   Serves dist/ with GitHub Pages semantics
│   └── build-resume.py                  Generates the public résumé PDF (Python/reportlab)
└── src/
    ├── main.tsx                         Client entry (hydrate, or createRoot fallback)
    ├── entry-server.tsx                 Build-time SSR entry
    ├── App.tsx                          Shell: skip link, header, <main>, footer, route resolve
    ├── routes.ts                        Route manifest + per-route SEO metadata + JSON-LD
    ├── content/                         ALL copy lives here — nothing hard-coded in components
    │   ├── types.ts                     Content model + the evidence rules
    │   ├── profile.ts                   Identity, contact, résumé meta, SEO, SITE_URL
    │   ├── projects.ts                  12 projects, 3 with full case studies
    │   ├── experience.ts                5 roles + leadership block
    │   ├── capabilities.ts              4 capability groups, familiarity note, 2 tools
    │   └── media.generated.json         GENERATED — do not hand-edit
    ├── components/                      Header, Footer, Picture, ProjectCard,
    │                                    CaseStudyRail, StudyScene, Diagrams
    ├── pages/                           Home, CaseStudy, NotFound
    ├── lib/                             router, media, motion (GSAP), scene, studyScene
    └── styles/                          tokens.css (design tokens), app.css (everything else)
```

| Folder | Purpose | Status |
| --- | --- | --- |
| `src/content/` | All copy and data | Active — **edit here, not in components** |
| `src/components/` | Reusable UI | Active |
| `src/lib/` | Router, media lookup, motion, WebGL | Active |
| `src/styles/` | Two CSS files only | Active |
| `scripts/` | Build-time tooling | Active |
| `public/media/` | Committed optimised images | Active, **generated — regenerate via `npm run media`** |
| `dist/`, `dist-ssr/` | Build output | Generated, gitignored |
| `media-src/` | Downloaded originals | Gitignored; recreate with `npm run media` |

There are **no unused, duplicate or deprecated source files** at inspection.

---

## 6. Application Architecture

### Build pipeline (the unusual part — understand this first)

`npm run build` runs four stages in order:

1. `tsc -b` — type check via project references.
2. `vite build` — client bundle → `dist/`.
3. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` — same React tree compiled for Node.
4. `node scripts/prerender.mjs` — imports the SSR bundle, renders **each route in `src/routes.ts`** to HTML, injects it plus that route's `<head>` into the Vite template, and writes real files.

Output:

```
dist/index.html
dist/work/maintenance-hangar/index.html
dist/work/layered-material-system/index.html
dist/work/the-silent-gate/index.html
dist/404.html
dist/sitemap.xml
dist/.nojekyll
```

**Why:** GitHub Pages serves files, not routes. Real files mean direct hits, hard refreshes, crawlers and JS-disabled browsers all work with no redirect shim and no hash URLs. `.nojekyll` stops Pages running output through Jekyll (which would drop `_`-prefixed paths).

### Routing

`src/lib/router.tsx` — a ~90-line path router. **Not load-bearing:** every route is a real prerendered file; the router only makes post-hydration navigation instant. Links are real `<a href>`; modified clicks (ctrl/meta/middle) fall through to the browser. `href()` prefixes `import.meta.env.BASE_URL`, so the `/portfolio/` base is applied in exactly one place.

Route changes reset scroll and move focus to `<main id="main" tabIndex={-1}>`.

### Content flow

`src/content/*.ts` → imported directly by pages → rendered. No fetching at runtime, no CMS, no API. `src/routes.ts` derives route metadata from `projects.ts`, so **adding a `caseStudy` block automatically creates a page, its metadata and its sitemap entry** — there is no second list to maintain.

### Media

`scripts/media-manifest.mjs` (URLs + dimensions + alt text) → `npm run media` → sharp writes AVIF/WebP/JPEG derivatives to `public/media/` **and** `src/content/media.generated.json` (intrinsic dimensions). `src/lib/media.ts` reads that manifest; `Picture.tsx` emits `<picture>` with explicit width/height. An id missing from the manifest renders **nothing** rather than breaking the page.

### Theme

Dark only. No light mode, no theme toggle. `color-scheme: dark` is declared. Two accent modes switch via a `data-domain="worlds" | "systems"` attribute that reassigns `--accent` and nothing else.

### Responsive strategy

Four width tokens in `src/styles/tokens.css`:

| Token | Governs | Scales up? |
| --- | --- | --- |
| `--measure` | Prose line length (68ch) | **No** |
| `--page-max` | Standard content column | Yes (78→86→92→96rem) |
| `--media-max` | Images, galleries, flagship cards | Yes (78→100→118→132rem) |
| `--rail` | Case-study metadata rail | 0 → 15 → 17rem |

Ultrawide steps at `100rem`, `130rem`, `150rem`. **Nothing below 1280 px is affected by these steps.**

### Animation

- **GSAP/ScrollTrigger** — one-shot fade+rise reveals on `[data-reveal]`. No pinning, no scroll hijacking, no parallax.
- **Three.js hero** (`src/lib/scene.ts`) — a modular kit resolving from wireframe blockout to lit geometry under warm-key/cool-fill. **Two draw calls** (one `InstancedMesh`, one merged edge buffer).
- **Three.js study scenes** (`src/lib/studyScene.ts`) — three variants (`kit`, `material`, `lighting`) mapped by project slug in `StudyScene.tsx`. Shares the hero's `three` chunk.

### The fail-open pattern (critical — do not remove)

Both `motion.ts` and `StudyScene.tsx` guard against a frozen/throttled frame loop:

- `motion.ts` **confirms GSAP's ticker is actually running** (400 ms probe) *before* applying the `.will-reveal` class that hides content. If the ticker is dead, nothing is ever hidden.
- `StudyScene.tsx` races its `IntersectionObserver` against a 2500 ms measured fallback, because **IO callbacks are delivered as part of the frame lifecycle** and can stay pending forever on a frozen loop.
- `HeroScene.tsx` races `requestIdleCallback` against a plain timer for the same reason.

These exist because the bugs were **observed**, not hypothesised (see ERR-006, ERR-007).

### Architectural risks

| Risk | Detail | Severity |
| --- | --- | --- |
| Base-path coupling | `/portfolio/` appears in `vite.config.ts`, `profile.ts` (`SITE_URL`), `public/site.webmanifest`, `public/robots.txt` and `scripts/serve-dist.mjs`. Renaming the repo breaks the site unless all five change together | **High** |
| `app.css` size | ~1,300 lines in one file. Navigable but growing | Medium |
| Diagram claims | `src/components/Diagrams.tsx` asserts technical facts about the owner's work. Governed by a documented rule; verified once | Medium |
| No error boundary | A render error in any component blanks the page after hydration (prerendered HTML would still have shown) | Low–Medium |
| No tests | Nothing prevents regressions | Medium |

No tight coupling between components, no duplicate components, no oversized components, no hard-coded copy in components, no unnecessary global state, no server-side code, no secrets.

---

## 7. Page and Section Inventory

| Page / Section | Route or Location | Purpose | Main Files | Status | Est. Completion | Verified | Known Issues | Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `/portfolio/` | Single-page overview | `src/pages/Home.tsx` | Complete | 95% | Structure ✅ / Visual ❌ | Visual unverified | Owner review |
| Hero | `#hero-title` in Home | Positioning + WebGL scene | `Home.tsx`, `HeroScene.tsx`, `lib/scene.ts` | Complete | 90% | Structure ✅ / Motion ❌ | Scene never observed running | Confirm on desktop |
| Disciplines strip | Home, after hero | Explains the two-strand structure | `Home.tsx` | Complete | 100% | Structure ✅ | — | — |
| Selected Work | `#work` | 3 flagship cards | `Home.tsx`, `ProjectCard.tsx` | Complete | 100% | Structure ✅ | — | — |
| Props & Studies | `#more-work` | 9 supporting projects | `Home.tsx`, `ProjectCard.tsx` | Complete | 100% | Structure ✅ | — | — |
| Capabilities | `#capabilities` | 4 skill groups + Godot familiarity note | `Home.tsx`, `content/capabilities.ts` | Complete | 100% | Structure ✅ | — | — |
| Tools & Software | `#tools` | 2 public repos | `Home.tsx`, `content/capabilities.ts` | Complete | 100% | Structure ✅ | Only 2 entries | Add more if they exist |
| Experience | `#experience` | 5 roles + leadership | `Home.tsx`, `content/experience.ts` | Complete | 100% | Structure ✅ | — | — |
| About | `#about` | Bio + education | `Home.tsx`, `content/profile.ts` | Complete | 100% | Structure ✅ | — | — |
| Contact | `#contact` | Email, résumé, socials | `Home.tsx` | Complete | 100% | Structure ✅ + links live ✅ | No form (deliberate, DEC-009) | — |
| Résumé download | `public/Vishnu-Vardhan-Tekkem-Resume.pdf` | Downloadable CV | `build-resume.py`, `profile.ts` | Complete | 100% | ✅ live 200, `application/pdf`, phone-free | Manual regeneration step | — |
| Case study ×3 | `/portfolio/work/<slug>/` | Deep breakdowns | `pages/CaseStudy.tsx` | Complete | 95% | Structure ✅ / Visual ❌ | Only 3 of 12 projects | Add a 4th if warranted |
| Metadata rail | Case studies ≥100rem | Facts + section index | `CaseStudyRail.tsx` | Mostly Complete | 85% | Structure ✅ / **Scroll-spy ❌** | Highlight never observed working | Verify in real browser |
| Study scene | Case studies | WebGL demonstration | `StudyScene.tsx`, `lib/studyScene.ts` | Mostly Complete | 85% | Loads ✅ / Renders ❌ | Visual output never seen | Verify in real browser |
| Diagrams ×3 | Case studies | Technical breakdowns | `Diagrams.tsx` | Complete | 100% | Structure ✅ + claims ✅ | — | — |
| Video clip ×1 | The Silent Gate gallery | Self-hosted camera fly-through | `VideoClip.tsx`, `media-manifest.mjs` (`VIDEOS`) | Complete | 95% | Loads ✅ (`readyState 4`, 10.01 s) / **Playback unwatched** | Audio track present but its content is **Unverified** — if it contains speech, a captions track is required | Watch it once; add `<track>` if there is narration |
| 3D model pipeline | `src/content/models.ts`, `lib/modelViewer.ts`, `components/ModelViewer.tsx` | Manifest-driven glTF viewer | + `scripts/make-placeholder-glb.mjs`, `scripts/check-models.mjs`, `MODEL_GUIDE.md` | **Complete (pipeline) / Awaiting assets (content)** | Pipeline 100%, content 0% | Loader ✅ (GLB parsed 92 ms, WebGL2), teardown ✅ (3 cycles, contexts released), exclusion ✅ | **No real model exists.** Only a generated placeholder, excluded from production | Owner supplies a `.glb` — see §32 Q15 |
| Header / Nav | All pages | Navigation | `Header.tsx` | Complete | 100% | Structure ✅ | Mobile nav is a scroll strip, not a menu | Confirm feel on phone |
| Footer | All pages | Rights + socials | `Footer.tsx` | Complete | 100% | Structure ✅ | — | — |
| 404 | `dist/404.html` | Error page | `pages/NotFound.tsx` | Complete | 100% | ✅ returns 404 live | — | — |
| Loading state | — | — | — | **Not implemented** | 0% | — | No route/asset spinners | Likely unnecessary |
| Blog / Testimonials / Certifications | — | — | — | **Not implemented** | 0% | — | No content exists | Owner decision |

---

## 8. Detailed Page and Component Documentation

### 8.1 Home — `src/pages/Home.tsx`

Ten sections in order: Hero · Disciplines · Selected Work · Props & Studies · Capabilities · Tools · Experience · About · Contact (+ Footer from `App.tsx`).

- **Data:** `content/profile.ts`, `projects.ts`, `experience.ts`, `capabilities.ts`
- **Media:** 12 images via `Picture`
- **Actions:** anchor links, `mailto:`, résumé download (`download` attribute), 3 external social links (all `rel="noopener noreferrer"`)
- **Responsive:** work grids 1→2→3→4 columns; `shell--media` on Disciplines, Selected Work, Props & Studies, Capabilities; `section--railed` on Experience (sticky heading ≥100rem)
- **Accessibility:** one `<h1>`; a visually-hidden `<h2>` labels the Disciplines section; all sections use `aria-labelledby`
- **Unfinished:** nothing structurally. Visual appearance unverified.

### 8.2 Case study — `src/pages/CaseStudy.tsx`

Order: header (backlink, title, standfirst, **ownership note**) → full-width cover → rail + prose + diagram → study scene → gallery → "More breakdowns".

- **Ownership note is mandatory.** Every case study states explicitly what was the owner's own work. Do not remove it.
- Section `id`s are derived by `slugifyHeading()` — the rail index anchors depend on them. Changing a heading changes its anchor.
- `scroll-margin-top: 6rem` on `.prose > section` clears the sticky header.

### 8.3 Key components

| Component | Path | Props | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `Picture` | `components/Picture.tsx` | `id`, `alt?`, `sizes?`, `priority?`, `className?` | Responsive AVIF/WebP/JPEG | Renders **nothing** for an unknown id. Exports `MEDIA_SIZES` for media-width contexts |
| `ProjectCard` | `components/ProjectCard.tsx` | `project`, `flagship?` | Grid card | Whole-card click target via `::after` on the title link |
| `CaseStudyRail` | `components/CaseStudyRail.tsx` | `project`, `headings[]` | Facts + section index | Exports `slugifyHeading`. Scroll-spy via `IntersectionObserver`, `rootMargin: '-12% 0px -70% 0px'`. **Highlight is decoration; links work without it** |
| `StudyScene` | `components/StudyScene.tsx` | `project` | WebGL demo panel | Variant map is keyed by slug. Caption is the accessible equivalent; canvas is `aria-hidden` |
| `Diagram` | `components/Diagrams.tsx` | `slug` | Technical SVG | Each SVG has `role="img"`, `<title>`, `<desc>`, `aria-labelledby` |
| `Header` | `components/Header.tsx` | — | Sticky nav | Cross-page anchors go through `href()` — see ERR-004 |
| `Footer` | `components/Footer.tsx` | — | Rights + socials | Links are 44 px tall (ERR-003 fix) |

---

## 9. Content Inventory

| Content Area | Source File | Status | Missing | Needs Owner Confirmation |
| --- | --- | --- | --- | --- |
| Name | `src/content/profile.ts` | Complete | — | No |
| Professional title | `profile.ts` | Complete | — | **Yes** — conflicts with ArtStation headline (ERR-011) |
| Biography (4 paras) | `profile.ts` | Complete | — | Recommended read-through |
| Profile image | — | **Not present** | No portrait anywhere | **Yes** — is one wanted? |
| Email | `profile.ts` | Complete | — | No |
| Phone | — | **Deliberately absent** | — | No (DEC-008) |
| Social links | `profile.ts` | Complete, all verified live | — | No |
| Capabilities | `capabilities.ts` | Complete | — | No |
| Godot familiarity | `capabilities.ts` | Complete, deliberately constrained | — | No (DEC-007) |
| Work history (5 roles) | `experience.ts` | Complete, verbatim from résumé | — | No |
| Education (2) | `profile.ts` | Complete | — | No |
| Projects (12) | `projects.ts` | Complete | 9 lack case studies | Which, if any, deserve promotion |
| Case studies (3) | `projects.ts` | Complete | — | No |
| Diagrams (3) | `Diagrams.tsx` | Complete — **31/31 claims machine-verified** against ArtStation source text | — | Already confirmed ("ship it") |
| Project links | `projects.ts` | Complete | — | No |
| Screenshots | `public/media/` (25 images) | Complete, all with hand-written alt | — | No |
| Video (1) | `public/media/silent-gate-flythrough.mp4` | Complete, self-hosted, poster + caption + `aria-label` | Audio content unverified | **Yes** — does the clip contain speech? If so it needs captions |
| Résumé PDF | `public/…Resume.pdf` | Complete, generated, phone-free | — | Read-through recommended |
| Testimonials / Certifications / Blog | — | **None** | — | **Yes** — wanted? |
| Employer project | — | **Excluded by instruction** | — | No (DEC-006) |

**Content integrity notes**

- No placeholder text, lorem ipsum, dummy content or empty `href="#"` anywhere (verified by marker search).
- All 25 media entries have alt text; 0 missing.
- Personal data published: name, professional email, city. **No phone, no address, no DOB.**
- One known external inconsistency: ArtStation headline still reads *"3D Environment / Prop Artist"* (ERR-011).

---

## 10. Design System and Visual Decisions

All tokens live in `src/styles/tokens.css`.

### Colour

| Token | Value | Use |
| --- | --- | --- |
| `--bg` / `--bg-sunk` / `--bg-raise` / `--bg-raise-2` | `#0a0c0f` / `#06070a` / `#11151b` / `#171c23` | Surfaces |
| `--ink` / `--ink-dim` / `--ink-faint` | `#eef1f4` / `#a7b1bd` / `#78838f` | Text |
| `--worlds` | `#f2a24b` | "Real-time worlds" accent |
| `--systems` | `#63cfdd` | "Intelligent systems" accent |
| `--focus` | `#9fd0ff` | Focus ring |

**Measured contrast:** worst text pairing **5.07:1**, most body text **9.01:1**. WCAG AA for normal text is 4.5:1 — passing.

### Typography

System stack — no web fonts (DEC-005). Sans for prose, mono for labels. Fluid scale `--step--1` … `--step-5` via `clamp()`. Line length fixed at `--measure: 68ch`; measured at **73ch** at 2560 px.

### Other tokens

Spacing `--sp-1`…`--sp-9`; radius 3 px / 6 px; `--ease: cubic-bezier(0.22,0.61,0.36,1)`. Breakpoints: 40, 44, 46, 48, 60, 62, 70, 72, 78, **100, 130, 150** rem.

### Design decisions

| Decision | Evidence | Reason | Files | Status |
| --- | --- | --- | --- | --- |
| Dark-only, no light mode | `color-scheme: dark`, no toggle | *Inferred:* cinematic genre convention; a light mode would fight the WebGL hero | `tokens.css` | Preserve |
| Two accents = two lights | Comment in `tokens.css` | **Documented:** taken from the owner's own described warm-key/cool-fill pairings | `tokens.css` | Preserve |
| System fonts | No font files, no `@font-face` | **Documented in README:** instant first paint, no network dependency | `tokens.css` | Reviewable — a self-hosted face would add polish |
| Text never widens | `--measure` excluded from ultrawide steps | **Documented:** readability is not a function of screen size | `tokens.css` | Preserve |
| Media widens, text does not | `--media-max` steps | **Documented:** the artwork is the argument | `tokens.css`, `app.css` | Preserve |
| Reveals fail open | Ticker probe in `motion.ts` | **Documented:** a frozen loop must never leave content invisible | `lib/motion.ts` | Preserve — this is a bug fix |

---

## 11. Responsive Design Status

Tested by measuring the built output in an automation browser across **35 route × viewport combinations** (5 routes × 360/768/1024/1280/1440/1920/2560 px).

| Area | Mobile | Tablet | Desktop | Ultrawide | Known Issues | Required Testing |
| --- | --- | --- | --- | --- | --- | --- |
| Horizontal overflow | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 0 | None | — |
| Header / nav | ✅ scroll strip | ✅ | ✅ | ✅ | Mobile nav is a scrollable strip, not a menu | Feel on a real phone |
| Work grids | ✅ 1 col | ✅ 2 col | ✅ 2–3 col | ✅ 4 col | — | Visual balance |
| Case-study rail | ✅ inline | ✅ inline | ✅ inline <100rem | ✅ sticky ≥100rem | Scroll-spy unverified | Real browser |
| Media scaling | ✅ | ✅ | ✅ | ✅ no upscaling | — | Visual sharpness |
| Study scene | Hidden <60rem | Hidden | ✅ | ✅ | Render output unseen | Real browser |
| Diagrams | ✅ scrolls in frame | ✅ | ✅ | ✅ | Small type on phones | Legibility on a real phone |
| Touch targets | ✅ all ≥24 px | ✅ | ✅ | ✅ | — | — |
| Text line length | ✅ | ✅ | ✅ | ✅ 73ch | — | — |

**Empty-space distribution (measured):**

| Viewport | Media sections | Text sections |
| --- | --- | --- |
| 1280 px | 1% | 1% |
| 1920 px | 16% | 28% |
| 2560 px | **17%** (was 51%) | 40% (deliberate — text-led) |

**Not tested:** landscape phone orientation, iOS Safari viewport-height behaviour (`100svh` is used in `.hero` and `.cs-rail`), real-device touch scrolling, browser zoom ≥200%.

---

## 12. Accessibility Status

| Area | Status | Evidence | Issue | Recommended Fix | Verification |
| --- | --- | --- | --- | --- | --- |
| Semantic HTML | ✅ Verified | `header`/`nav`/`main`/`footer`/`aside` present | — | — | DOM query |
| Heading order | ✅ Verified | One `h1`; **0 skipped levels** on all 5 routes | — | — | DOM query |
| Skip link | ✅ Verified | First focusable element on every page | — | — | DOM query |
| Keyboard nav | ✅ Verified (structure) | 21 focusables, 6 rail links reachable, **0 positive `tabindex`**, 0 unnamed | Focus *visibility* not seen | — | **Requires Browser Testing** |
| Focus indicators | ⚠️ Unverified | `:focus-visible` rule confirmed present | Never observed rendering | — | **Requires Browser Testing** |
| Alt text | ✅ Verified | 0 of 25 images missing alt; hand-written per image | — | — | DOM query |
| Colour contrast | ✅ Verified | Worst 5.07:1, body 9.01:1 | — | — | Computed-style calc |
| Reduced motion | ⚠️ Partially verified | Global collapse rule confirmed; `will-reveal` guard confirmed | Never tested with the OS setting on | — | **Requires Browser Testing** |
| Touch targets | ✅ Verified | 0 elements <24 px; controls ≥44 px | — | — | DOM query |
| ARIA | ✅ Verified | `aria-labelledby` on sections; `aria-current` on active rail link; `aria-hidden` on canvases | — | — | DOM query |
| Language | ✅ Verified | `<html lang="en">` | — | — | Source |
| Screen reader | ❌ **Not tested** | — | No NVDA/JAWS/VoiceOver pass | Run one | **Requires Human Confirmation** |
| Forms | N/A | No forms exist | — | — | — |

**No formal WCAG audit has been performed.** Individual criteria were checked programmatically; that is not the same as compliance.

---

## 13. SEO and Social Sharing

Generated by `scripts/prerender.mjs` from `src/routes.ts`.

| Item | Status | Notes |
| --- | --- | --- |
| Per-route `<title>` | ✅ Verified live | Unique per route |
| Meta description | ✅ Verified | Per route |
| Canonical URL | ✅ Verified | Absolute, includes `/portfolio/` |
| Open Graph | ✅ Verified | type, site_name, title, description, url, image, image:alt |
| Twitter card | ✅ Present | `summary_large_image` |
| Social image | ⚠️ Unverified | Reuses a project JPEG. **No dedicated 1200×630 OG image.** Never previewed in a real unfurl |
| JSON-LD | ✅ Verified | `Person` on home/404; `CreativeWork` per case study. Escaped against `<` breakout |
| Sitemap | ✅ Verified live | 4 indexable URLs |
| `robots.txt` | ⚠️ **Inert** | See ERR-010 — crawlers read it only from the domain root |
| Favicon / manifest | ✅ Verified live | SVG favicon; manifest scoped to `/portfolio/` |
| 404 | ✅ Verified | Real 404 status, `noindex` |
| Redirects | ✅ Verified | Pages 301s missing trailing slashes |

---

## 14. Performance Status

### Measured

| Asset | Raw | Gzipped |
| --- | --- | --- |
| `index-*.js` (main) | 259 kB | **80 kB** |
| `index-*.js` (vendor) | 69 kB | 27 kB |
| `index-*.css` | 22 kB | 5 kB |
| **Initial payload** | — | **~112 kB** |
| `three.module-*.js` | 703 kB | 183 kB — **deferred** |
| `ScrollTrigger-*.js` | 43 kB | 18 kB — **deferred** |
| `scene` / `studyScene` | 4 kB each | 2 kB each — deferred |
| `silent-gate-flythrough.mp4` | 2.4 MB | **fetched only on play** (`preload="none"`) |
| `dist/` total | ~11 MB | — |
| `public/media/` | ~9.7 MB (224 files, incl. 1 video) | — |

### Mitigations in place

Three.js and GSAP dynamically imported and never on the critical path; the hero renders only while on-screen and tab-visible; study scenes load only near the viewport; two draw calls in the hero; pixel ratio capped at 1.5; AVIF/WebP with JPEG fallback; lazy loading below the fold; explicit dimensions everywhere (**zero layout shift** — verified structurally); code splitting per route-independent chunk.

### Unverified / risks

- **No Lighthouse or Core Web Vitals report exists.** All performance claims here are structural, not measured in a real browser.
- 7.3 MB of committed media inflates clone time (not page load — images are per-request).
- Three.js at 183 kB gz is a real cost for visitors who reach the hero on a capable device.
- Hydration cost never measured.

---

## 15. Forms, Contact Features, External Services

**There is no contact form, and this is deliberate** (DEC-009). GitHub Pages has no backend; a third-party form service would need approval and would risk exposing keys client-side.

| Channel | Implementation | Status |
| --- | --- | --- |
| Email | `mailto:` link | ✅ Verified present |
| Résumé | Static PDF + `download` attribute | ✅ Verified live (200, `application/pdf`) |
| ArtStation / LinkedIn / GitHub | External links, `rel="noopener noreferrer"`, `target="_blank"` | ✅ Verified present |

**No** analytics, CMS, API, email service, CAPTCHA, rate limiting or third-party runtime scripts. Zero runtime third-party dependencies.

---

## 16. Environment Variables and Configuration

**This project uses no environment variables.** There is no `.env`, no `.env.example`, and none are required.

| Variable | Purpose | Local | Production | Where | Status |
| --- | --- | --- | --- | --- | --- |
| *(none)* | — | — | — | — | — |

Build-time config only:

| Setting | File | Value |
| --- | --- | --- |
| `base` | `vite.config.ts` | `/portfolio/` |
| `SITE_URL` | `src/content/profile.ts` | `https://tekkem007.github.io/portfolio` |
| `BASE_PATH` | `scripts/serve-dist.mjs` | `/portfolio` (env-overridable, local only) |
| `PORT` | `scripts/serve-dist.mjs` | 4173 (env-overridable, local only) |

**No secrets, API keys or tokens exist anywhere in this repository.** CI uses only the GitHub-provided token. Hard-coded values that are intentionally public: the owner's professional email, social URLs, ArtStation artwork URLs and the production origin.

---

## 17. Deployment and Hosting

| Item | Value |
| --- | --- |
| Provider | GitHub Pages |
| Repository | `tekkem007/portfolio` (public) |
| Site type | **Project site** → `/portfolio/` subpath |
| Production URL | <https://tekkem007.github.io/portfolio/> |
| Branch | `main` |
| Trigger | Push to `main`, or manual `workflow_dispatch` |
| Workflow | `.github/workflows/deploy-pages.yml` |
| Steps | checkout → Node 22 (npm cache) → `npm ci` → `npm run lint` → `npx tsc -b` → `npm run build` → `configure-pages` → upload `dist` → `deploy-pages` |
| Permissions | `contents: read`, `pages: write`, `id-token: write` |
| Concurrency | group `pages`, `cancel-in-progress: false` |
| Pages source | **Must be set to "GitHub Actions"** in Settings → Pages |
| HTTPS | Provided by GitHub Pages |
| Custom domain | None |
| Rollback | Re-run an earlier successful workflow, or revert and push |

**Deployment history:** runs #1–#2 **failed** at `configure-pages` (ERR-005); #3–#7 **succeeded**. Latest: **#7, 2026-07-28T13:29:29Z, success.**

> **Warning:** the repository is public and must stay public. Pages will not publish from a private repository on the free plan.

---

## 18. Errors, Warnings, Bugs, and Fix History

All issues below were **observed during development on 2026-07-28**, not hypothesised.

| ID | Error / Symptom | Area | Evidence | Cause | Fixes Attempted | Result | Status | Next Step |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ERR-001 | `tsc` failed: `Property 'setTimeout' does not exist on type 'never'`; `Could not find declaration file for 'three'` | Build | Build output | **Confirmed:** missing `@types/three`; `'x' in window` narrowing collapsed the ternary to `never` | Installed `@types/three`; replaced narrowing with `typeof window.requestIdleCallback === 'function'` | Build passed | **Resolved** | — |
| ERR-002 | React warning: `Invalid DOM property 'fetchpriority'` | Prerender | Prerender stdout | **Confirmed:** React 19 expects camelCase `fetchPriority` | Replaced the `as any` spread with the typed prop | Warning gone | **Resolved** | — |
| ERR-003 | Footer links 19 px tall | A11y | DOM measurement | **Confirmed:** inline-flex links with no padding | Added `min-height: 44px` + padding | 0 sub-24 px targets | **Resolved** | — |
| ERR-004 | Horizontal overflow at 3 breakpoint bands | Layout | 15/95 combos overflowed | **Confirmed:** (a) header didn't fit 704–830 px; (b) flex items default to `min-width: auto`, so the nav strip expanded the header instead of scrolling | Dropped wordmark subtitle at 72rem; moved wrap breakpoint 44rem→60rem; added `min-width: 0` to `.site-nav` **and** `.site-nav__links` | **0/95** overflow after fix | **Resolved** | — |
| ERR-005 | Deploy runs #1–#2 failed | CI/CD | Job steps: `Configure Pages → failure` | **Confirmed:** Pages source not set to "GitHub Actions" | Owner set the source; re-triggered | Run #3 succeeded | **Resolved** | — |
| ERR-006 | All 25 reveal elements stuck at `opacity: 0` | Motion | `.will-reveal` count = 25, none cleared | **Confirmed:** GSAP's ticker is rAF-driven; the test browser produced **0 rAF callbacks in 600 ms**, so ScrollTrigger never updated. Content was hidden *before* confirming the engine ran | Probe GSAP's ticker for 400 ms and only apply `.will-reveal` if it fires | With a frozen loop, **nothing is hidden** (verified) | **Resolved** (fail-open) | Confirm the *animated* path in a real browser |
| ERR-007 | Study scene never loaded; chunk never fetched | WebGL | 0 `studyScene`/`three` resource entries | **Confirmed:** `IntersectionObserver` delivery is tied to the frame lifecycle; also `requestIdleCallback` never fired | Raced IO against a 2500 ms measured fallback; raced `requestIdleCallback` against a timer in `HeroScene` | Canvas present, `data-active="true"` | **Resolved** | Confirm visual output |
| ERR-008 | `npm run typecheck` fails: **TS5096** — `allowImportingTsExtensions` requires `noEmit` or `emitDeclarationOnly`. **Worse: despite exiting 1, it emits compiled `.js` next to every source file** (26 files, incl. `src/**/*.js` and `vite.config.js`) | Tooling | Run during this inspection: exit 1, then `git status` showed 26 untracked `.js` artifacts shadowing the `.ts`/`.tsx` sources | **Confirmed:** the script passes `--noEmit false --emitDeclarationOnly false`, which both contradicts `allowImportingTsExtensions` (`tsconfig.app.json:12`, `tsconfig.node.json:10`) **and turns emit on**. `.gitignore` does not cover these, so they would be committed by a careless `git add -A` | Artifacts deleted; build re-run and confirmed passing. **Script itself not yet fixed** | Repo restored to clean; sources untouched | **Open** | Change the script to `tsc -b` (TASK-002). Until then **do not run `npm run typecheck`** — use `npx tsc -b` |
| ERR-009 | `@types/three@0.185.1` vs `three@0.181.2` | Deps | `package-lock.json` | **Confirmed:** installed with `npm i -D @types/three` (unpinned) during ERR-001 | None | Build passes today | **Open** | Align versions (TASK-003) |
| ERR-010 | `public/robots.txt` has no effect | SEO | Project-site path | **Confirmed:** crawlers read `robots.txt` only from the domain root, which belongs to a user site that does not exist | Documented in README | Still inert | **Open (low)** | Accept, or move to a user site |
| ERR-011 | ArtStation headline says *"3D Environment / Prop Artist"*; site and résumé say *3D Team Lead & Environment Artist* | Content | ArtStation profile JSON | **Confirmed:** stale external profile | Raised with owner | Not actioned | **Open** | Owner updates ArtStation (TASK-004) |
| ERR-012 | Diagram implied trim-strip→kit-piece mappings the source never states | Content accuracy | Self-review before shipping | **Confirmed:** inferred detail added by the author | Replaced per-strip leader lines with one grouped connector; then machine-checked all 31 claims | **31/31** claims matched source text verbatim | **Resolved** | Re-run the check if diagrams change |
| ERR-013 | ArtStation returns HTML instead of JSON to Node `fetch` | Tooling | Verification script crash | **Confirmed:** bot filtering on default `fetch` headers | Used `curl` with a browser User-Agent | Data retrieved | **Resolved (workaround)** | Use curl for ArtStation |
| ERR-014 | LinkedIn returns 429/999 to all automated requests | Verification | HTTP status | **Confirmed:** anti-bot | None available | Cannot verify LinkedIn URLs programmatically | **Blocked** | Owner confirms by opening the link |
| ERR-015 | The Silent Gate fly-through was **not playable** — the page presented a still image captioned as a video, with no `<video>` element anywhere | Content/Media | Owner report; confirmed: 0 `<video>`/`<iframe>` in the live HTML. `silent-gate-02` was ArtStation's clip *thumbnail* rendered as a normal image | **Confirmed:** ArtStation exposes the clip via a signed `embed.html` whose token expires, which was judged unsafe to hardcode — but a **direct unsigned MP4 on their CDN was never checked for**, and exists (2.4 MB, fast-start, range-requestable) | Self-hosted the MP4 through the media pipeline (`VIDEOS` in `media-manifest.mjs`); whitelisted videos in the orphan sweep; rendered a native `<video controls preload="none">` with the existing thumbnail as poster; added video MIME + Range (206/416) support to `serve-dist.mjs` | `readyState 4`, duration 10.01 s, 1920×1080, no media error; **0 bytes fetched on page load**; 0/35 combos overflow; file survives `npm run media` | **Resolved** | Confirm playback in a real browser (TASK-001) |
| ERR-016 | `npm run serve:dist` answered Range requests with `200` + the whole file, and served `.mp4` as `application/octet-stream` | Tooling | Observed while testing ERR-015 | **Confirmed:** no `.mp4` MIME entry and no Range handling in the local server | Added `video/mp4`/`video/webm` types and full Range support | 206 for valid ranges, 416 for invalid, MIME correct | **Resolved** | — |

---

## 19. Decision Log

| ID | Date | Decision | Category | Reason | Evidence | Alternatives | Consequences | Status | Reversible? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEC-001 | 2026-07-28 | Vite + React + TS, no meta-framework | Framework | *Reason not documented by the owner. Inferred from implementation:* the site is static, so a router + prerender step is lighter than Next.js | `vite.config.ts`, commit `31bac7a` | Next.js static export; plain HTML | No SSR complexity; a small custom router to maintain | Active | Yes, with effort |
| DEC-002 | 2026-07-28 | Prerender every route to real HTML | Architecture | **Documented:** Pages serves files, not routes; gives working deep links, refreshes, crawlers and no-JS | `scripts/prerender.mjs` header comment | Hash routing; SPA + 404 shim | Extra build stage; best robustness | Active | Yes |
| DEC-003 | 2026-07-28 | Custom ~90-line router | Architecture | *Inferred:* react-router is unnecessary when every route is a real file | `src/lib/router.tsx` | react-router | Less dependency weight; hand-maintained | Active | Yes |
| DEC-004 | 2026-07-28 | Deploy as a **project site** at `/portfolio/` | Deployment | **Owner instruction** — repo named `portfolio`, not `tekkem007.github.io` | `vite.config.ts`, commit `30d6c38` | User site at domain root | Base path must stay in sync across 5 files; `robots.txt` inert (ERR-010) | Active | Yes — see §22 |
| DEC-005 | 2026-07-28 | System font stack, no web fonts | Styling | **Documented in README:** instant first paint, no network dependency | `tokens.css`, README | Self-hosted Inter | Less distinctive typography | **Under Review** | Yes |
| DEC-006 | 2026-07-28 | Employer work described **in words only** | Content/Privacy | **Owner instruction** (explicit choice) | `src/content/experience.ts` comment | Full case study; exclude entirely | No employer media anywhere | Active | Only by owner |
| DEC-007 | 2026-07-28 | Godot = editor familiarity only; `vir` repo not linked | Content | **Owner instruction** — avoid implying scripting ability | `src/content/capabilities.ts` | Link the repo as AI-assisted; omit Godot | Accurate but understated | Active | Only by owner |
| DEC-008 | 2026-07-28 | Never publish the phone number; **generate** the résumé PDF | Privacy | **Owner instruction.** Redacting a PDF leaves text recoverable in the content stream, so it is rebuilt from source | `scripts/build-resume.py` header | Redact the original; no download | Résumé edits need a manual rebuild | Active | Only by owner |
| DEC-009 | 2026-07-28 | No contact form | Architecture | *Inferred:* static hosting has no backend; a form service would need approval and risks client-side keys | `src/pages/Home.tsx` | Formspree/Netlify Forms | Email is the only inbound channel | Active | Yes, with approval |
| DEC-010 | 2026-07-28 | Dark-only, no light mode | Design | *Reason not documented. Inferred:* genre convention; a light mode would fight the WebGL hero | `tokens.css` | Light/dark toggle | Simpler system; may not suit all users | Active | Yes |
| DEC-011 | 2026-07-28 | Text never widens; media does | Layout | **Documented:** readability is not a function of screen width; the artwork is the argument | `tokens.css` comments | Scale everything; scale nothing | Text-led sections stay ~40% empty at 2560 px **by design** | Active | Yes |
| DEC-012 | 2026-07-28 | Motion must fail **open** | Architecture/A11y | **Documented:** caused by ERR-006 — a frozen frame loop must never leave content invisible | `src/lib/motion.ts` | Hide immediately; drop GSAP | Adds a 400 ms probe before reveals | Active | **Do not reverse** |
| DEC-013 | 2026-07-28 | Local folder name left as `tekkem007.github.io` | Tooling | *Inferred:* renaming would break the local preview config for no functional gain | Filesystem vs `git remote` | Rename the folder | Cosmetic mismatch only | **Temporary** | Yes |
| DEC-014 | 2026-07-28 | Diagrams may only restate the owner's published words | Content accuracy | **Documented, and enforced:** ERR-012 caught an invented mapping; all 31 claims later matched source text | `src/components/Diagrams.tsx` header | Free-form illustration | Diagrams are conservative but defensible | Active | **Do not reverse** |
| DEC-016 | 2026-07-28 | Models are manifest-driven, never hard-coded | Architecture | **Documented:** a portfolio's models change often; component edits per asset would guarantee drift | `src/content/models.ts` | Per-model components | One schema to learn; all models share one renderer | Active | Yes |
| DEC-017 | 2026-07-28 | Placeholder geometry is excluded from production builds | Content integrity | **Documented:** generated stand-in geometry must never sit beside real work where a recruiter could mistake it for the owner's art | `models.ts` (`publishedModels`) | Ship it labelled; ship nothing | Live site gains nothing until a real asset arrives — deliberate | Active | **Do not reverse** |
| DEC-018 | 2026-07-28 | The mouse wheel is never bound in 3D viewers | UX/A11y | **Documented:** wheel-zoom traps page scroll. Zoom is keyboard-only; touch uses `touch-action: pan-y` | `lib/modelViewer.ts` | Wheel zoom with modifier key | Slightly less discoverable zoom; scroll never breaks | Active | Reviewable |
| DEC-015 | 2026-07-28 | Commit optimised media (7.3 MB) to the repo | Dependency/Build | *Inferred:* Pages builds from the repo; no asset pipeline or CDN is available | `public/media/`, `.gitignore` | Git LFS; external CDN | Larger clones; simple and reliable deploys | Active | Yes |

---

## 20. Development Setup and Commands

```bash
# 1. Install (Node 22 recommended — CI pins it; Node 24 verified working)
npm install          # or: npm ci   (exact lockfile install, used by CI)

# 2. Develop
npm run dev          # Vite dev server → http://localhost:5173

# 3. Lint
npm run lint         # ESLint — currently PASSING

# 4. Type check
npx tsc -b           # WORKS. Do NOT use `npm run typecheck` — it is broken (ERR-008)

# 5. Production build (type check → client → SSR → prerender)
npm run build

# 6. Preview the build with GitHub Pages semantics
npm run serve:dist   # → http://localhost:4173/portfolio/

# 7. Regenerate images (only after editing scripts/media-manifest.mjs)
npm run media        # needs network access to ArtStation CDN

# 8. Regenerate the résumé PDF (only after editing scripts/build-resume.py)
pip install reportlab
python scripts/build-resume.py
```

**No test command exists.** There is no test framework.

**Deployment:** push to `main`. CI does the rest. No manual deploy step, no secrets required.

### Known setup problems

| Problem | Cause | Workaround |
| --- | --- | --- |
| `npm run typecheck` fails with TS5096 | ERR-008 | Use `npx tsc -b` |
| `npm run media` fails / returns HTML | ArtStation bot filtering (ERR-013) | The script sends a browser UA; if it still fails, fetch with `curl` manually |
| `python scripts/build-resume.py` — `ModuleNotFoundError` | reportlab is not an npm dep | `pip install reportlab` |
| `npm run preview` serves at `/portfolio/` | Correct — `base` is set | Use `npm run serve:dist` for Pages-accurate behaviour |

---

## 21. How to Perform Changes Safely

### Before

1. Read this document and `README.md`.
2. `git status` — confirm a clean tree; **do not overwrite unrelated changes**.
3. `git branch --show-current` — expect `main`.
4. Identify whether the change is **content** (`src/content/`), **layout** (`src/styles/`), **behaviour** (`src/lib/`, `src/components/`) or **build** (`scripts/`, configs).
5. `grep -rn "<symbol>" src scripts` before renaming or deleting anything.
6. **Content is data-driven.** Edit `src/content/*.ts`, never JSX strings.
7. Write down the intended change, affected files and how you will test it.

### While

1. Smallest focused change; no drive-by refactors.
2. Reuse existing tokens (`tokens.css`) and components. Do not introduce a second button or card style.
3. Do not add a dependency without recording the reason in §19.
4. Preserve: responsive behaviour, keyboard access, alt text, `aria-*`, `rel="noopener noreferrer"`, SEO metadata.
5. **Never fabricate personal facts, roles, dates, projects, metrics or technical claims.** Every content claim must trace to the résumé, the owner's ArtStation text, or an explicit owner statement.
6. Respect DEC-006, DEC-007, DEC-008 and DEC-014 — these are owner instructions, not preferences.
7. Do not remove the fail-open guards (DEC-012).

### After

1. `git diff` — confirm only intended files changed.
2. `npm run lint`
3. `npx tsc -b`
4. `npm run build`
5. `npm run serve:dist` → check `/portfolio/` **and** at least one `/portfolio/work/<slug>/`
6. Check the browser console for errors.
7. Test at 360, 768, 1280 and 1920 px minimum.
8. Tab through the page — skip link first, visible focus, no traps.
9. If media changed: confirm no broken images and no upscaling.
10. **Update this document** — §7 status, §18 if you hit an error, §19 if you made a decision, §31 session log, and the §2 completion estimate.
11. Record test results **honestly**. Never mark something verified that you did not observe.

---

## 22. Change Procedures by Task Type

### Updating personal information

All in **`src/content/profile.ts`**: `name`, `role`, `location`, `headline`, `standfirst`, `about[]`, `email`, `links`, `availability`, `seo`, `education`.
`SITE_URL` also lives here and feeds canonicals, Open Graph and the sitemap.
**The résumé PDF does not update automatically** — edit `scripts/build-resume.py` and re-run it.

### Adding a portfolio project

1. Add images to the `MEDIA` array in `scripts/media-manifest.mjs` — id, source URL, width, height, **real descriptive alt text**.
2. `npm run media`
3. Append a `Project` to `projects` in `src/content/projects.ts`. Required: `slug`, `title`, `summary`, `domain` (`worlds` | `systems`), `ownership`, `evidence`, `year`, `software[]`, `tags[]`, `cover`.
4. Optional `caseStudy` block → **automatically** creates `/portfolio/work/<slug>/`, its metadata and a sitemap entry. It requires `standfirst`, `role`, `contribution` (the ownership statement — mandatory) and `sections[]`.
5. For a study scene, add the slug to `STUDIES` in `src/components/StudyScene.tsx`. For a diagram, add to `DIAGRAMS` in `src/components/Diagrams.tsx` — **and verify every claim against the source text first**.
6. `npm run build && npm run serve:dist`, then check the new route.

Ordering is array order. Flagships = entries with a `caseStudy`.

### Updating skills / experience / education

- Skills → `src/content/capabilities.ts` (`capabilities[]`, `familiarity`, `tools`).
- Experience → `src/content/experience.ts`. Most recent first; `current: true` renders the "Current" badge. Date format: `"Mon YYYY — Mon YYYY"` / `"Mon YYYY — Present"`.
- Education → `education` in `src/content/profile.ts`.

### Adding or replacing a video

Videos are declared in the `VIDEOS` array in `scripts/media-manifest.mjs` (`id`, source `src`, `poster` media-id, `width`, `height`, `description`) and downloaded by `npm run media` **verbatim into `public/media/<id>.mp4`** — there is no transcode step, because ffmpeg is not a dependency. The source must therefore already be web-ready H.264 with its `moov` atom at the front (fast-start), or it will not stream progressively.

Two things that will bite you:

1. **Videos are whitelisted in the orphan sweep** in `scripts/optimise-media.mjs`. A video that is not in `VIDEOS` will be **deleted** by the next `npm run media`.
2. **The poster must exist in `MEDIA`.** It is a normal image id, so it goes through the usual derivative pipeline.

Then attach it to a case study via the optional `video` field on `caseStudy` in `src/content/projects.ts`. Rendering is handled by `src/components/VideoClip.tsx` — native controls, `preload="none"`, no autoplay. Do not add autoplay: these files carry audio and autoplay conflicts with `prefers-reduced-motion`.

### Replacing images

**Never drop a file straight into `public/media/`.** The app reads `src/content/media.generated.json` for dimensions; an entry missing from it renders nothing. Always go through `scripts/media-manifest.mjs` + `npm run media`, which writes derivatives and the manifest together and **deletes orphans**.

### Updating the résumé

Path `public/Vishnu-Vardhan-Tekkem-Resume.pdf`; metadata in `profile.ts` (`resume.path`, `filename`, `label`, `meta`).
Edit content in `scripts/build-resume.py`, then `python scripts/build-resume.py`.
**Do not copy the owner's original résumé into `public/` — it contains a phone number (DEC-008).**
Verify afterwards: no 10-digit run in the output text, and the live URL returns `application/pdf`.

### Changing colours or typography

`src/styles/tokens.css` only. Re-check contrast (AA needs 4.5:1; current worst is 5.07:1). If accents change, update the `KEY_COLOUR`/`FILL_COLOUR` constants in `src/lib/scene.ts` and `WARM`/`COOL` in `src/lib/studyScene.ts` to match.

### Adding a page

Add a `RouteMeta` entry in `src/routes.ts` (path, file, title, description, canonical, image, jsonLd), add a branch in `resolve()` in `src/App.tsx`, and a nav entry in `src/components/Header.tsx` if needed. The sitemap updates itself.

### Modifying animations

GSAP reveals → `src/lib/motion.ts`. WebGL → `src/lib/scene.ts` (hero) and `src/lib/studyScene.ts` (studies).
**Keep the fail-open guards.** Keep off-screen pausing and the device gates in `HeroScene.tsx` / `StudyScene.tsx`.

### Changing the deployment path

If the repository is renamed, update **all five** together:

| File | Change |
| --- | --- |
| `vite.config.ts` | `base: '/<repo>/'` (or `'/'` for a user site) |
| `src/content/profile.ts` | `SITE_URL` |
| `public/site.webmanifest` | `start_url`, `scope`, icon `src` |
| `public/robots.txt` | `Sitemap:` line |
| `scripts/serve-dist.mjs` | `BASE` default |

Then `npm run build && npm run serve:dist` and confirm no root-absolute URL 404s.

---

## 23. Testing and Verification Matrix

| Test Area | Procedure | Expected | Last Known Result | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Dependency install | `npm ci` in a clean clone | Succeeds | 192 packages, ~4 s | **Passed** | 2026-07-28 |
| Production build | `npm run build` | Exit 0, 5 routes | 189 files, 5 routes | **Passed** | Clean-clone verified |
| Lint | `npm run lint` | No errors | Clean | **Passed** | — |
| Type check | `npx tsc -b` | Exit 0 | Passes (inside build) | **Passed** | — |
| `npm run typecheck` | Script | Exit 0 | **TS5096, exit 1** | **Failed** | ERR-008 |
| Automated tests | — | — | — | **Not Tested** | None exist |
| Dev server | `npm run dev` | Serves | — | **Not Tested** | Never run |
| Pages-mode preview | `npm run serve:dist` | Serves `/portfolio/` | Worked | **Passed** | — |
| Horizontal overflow | 5 routes × 7 widths | 0 overflow | **0 / 35** | **Passed** | 360–2560 px |
| Broken images | DOM `naturalWidth === 0` | 0 | 0 | **Passed** | — |
| Image upscaling | rendered vs served width | none >15% | 0 soft | **Passed** | — |
| Alt text | DOM | 0 missing | 0 of 25 | **Passed** | — |
| Heading order | DOM | no skips | 0 skips, one `h1` | **Passed** | — |
| Keyboard order | DOM | skip link first, no positive tabindex | 21 focusables, 0 positive | **Passed (structural)** | Focus *visibility* unseen |
| Contrast | Computed luminance | ≥4.5:1 | worst 5.07:1 | **Passed** | — |
| Touch targets | DOM | ≥24 px | 0 below | **Passed** | — |
| Layout shift | dims/viewBox/aspect-ratio | all present | all present | **Passed (structural)** | No CLS measurement |
| Console errors | 5 routes | none | **0** | **Passed** | Automation browser |
| Internal links | DOM prefix check | all `/portfolio/` | 0 unprefixed | **Passed** | — |
| External links | HTTP | 200 | ArtStation/LinkedIn/GitHub present, `rel` correct | **Partially Passed** | LinkedIn unverifiable (ERR-014) |
| Résumé download | `curl` live | 200 + `application/pdf` | 200, 6,543 B, phone-free | **Passed** | — |
| Routes live | `curl` | 200 / 404 | all 200; `/nope/` 404 | **Passed** | — |
| Sitemap / robots / manifest / favicon | `curl` | 200 | 200 | **Passed** | — |
| Deployment | Actions | success | **#7 success** | **Passed** | — |
| **Animations** | Watch reveals/hero/study | smooth | — | **Requires Browser** | 0 rAF in test env |
| **Scroll-spy** | Scroll a case study | highlight follows | — | **Requires Browser** | — |
| **Reduced motion** | OS setting on | no motion | — | **Requires Browser** | Rule present |
| **No-WebGL** | Disable WebGL | CSS fallback | — | **Requires Browser** | Fallback path confirmed structurally |
| **Visual appearance** | Look at it | — | — | **Requires Human Confirmation** | **Never seen** |
| **Screen reader** | NVDA/VoiceOver | sensible | — | **Requires Human Confirmation** | — |
| **Social unfurl** | Paste link | card renders | — | **Requires Production Verification** | — |
| **Lighthouse** | Run audit | — | — | **Not Tested** | — |

---

## 24. Browser and Device Compatibility

| Browser / Device | Intended | Tested | Known Issues | Action |
| --- | --- | --- | --- | --- |
| Chrome desktop | Yes | ❌ | — | Test |
| Edge desktop | Yes | ❌ | — | Test |
| Firefox desktop | Yes | ❌ | — | Test |
| Safari desktop | Yes | ❌ | `requestIdleCallback` absent — **fallback timer implemented** | Test |
| Mobile Safari | Yes | ❌ | `100svh` used in `.hero`/`.cs-rail` | **Test — highest risk** |
| Android Chrome | Yes | ❌ | — | Test |
| Tablet | Yes | ❌ | Study scenes hidden `(hover: none)` — intended | Confirm intent |
| Ultrawide ≥2560 | Yes | Structurally | — | Visual check |

**No real browser has been tested.** All results in §23 come from a single automation browser that could not composite frames. Standards-compliant code is not evidence of working support.

---

## 25. Security and Privacy Review

| Area | Finding | Action |
| --- | --- | --- |
| API keys / credentials / tokens | **None found anywhere** | — |
| `.env` files | None exist, none required | — |
| Env files in Git | None tracked | — |
| Secrets in CI | None; GitHub-provided token only, minimum permissions | — |
| Personal data published | Name, professional email, city | Accepted by owner |
| Phone number | **Excluded everywhere**, including the generated PDF (verified: no 10-digit run in raw bytes or extracted text) | — |
| Employer/client data | **None** (DEC-006) | — |
| External links | All `target="_blank"` carry `rel="noopener noreferrer"` — **verified, 0 unsafe** | — |
| HTML injection | No `dangerouslySetInnerHTML`. JSON-LD escapes `<` in `prerender.mjs` | — |
| Analytics / tracking | **None** | No privacy policy needed currently |
| Source maps | Not enabled for production | — |
| Debug code | No `console.log` in `src/`; the one `console.warn` in `lib/media.ts` is `import.meta.env.DEV`-guarded | — |
| Dependency vulnerabilities | **`npm audit` was never run — Unverified** | Run `npm audit` |
| Third-party runtime scripts | **None** | — |

**No secret rotation is required — no secrets exist.**

---

## 26. Version-Control Status

| Item | Value |
| --- | --- |
| Branch | `main` (only branch in use) |
| Commit | `3cec3dd03077db110f59db5b29ac280d94198318` |
| Working tree | **Clean** at inspection |
| Sync | In sync with `origin/main` |
| Remote | `https://github.com/tekkem007/portfolio.git` |
| Commits | 13, all 2026-07-28 |
| Convention | Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `build:`) with detailed bodies explaining **why** |
| Ignored | `node_modules`, `dist`, `dist-ssr`, `media-src`, `*.local`, `.eslintcache` |
| Large binaries | `public/media/` — 223 files, 7.3 MB. **No Git LFS** (DEC-015) |
| Generated files tracked | `public/media/**` and `src/content/media.generated.json` — **intentional**; regenerate with `npm run media`, never hand-edit |
| Deployment branch | `main` (Actions builds it; no `gh-pages` branch) |

History note: commit `43dffa9` was cherry-picked ahead of two others so a layout change could deploy while diagram content awaited owner confirmation. A temporary safety branch was used and removed. Nothing was lost.

> **Do not** commit, push, reset, discard or switch branches unless explicitly instructed.

---

## 27. Development Roadmap

### Immediate Stabilisation

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Human visual + motion review | Nothing about appearance or animation has ever been confirmed | Owner | — | Owner confirms or lists defects | Open the live site on desktop, ultrawide, phone | Small | **Open** |
| P1 | Fix `typecheck` script | Documented command fails | — | `package.json` | `npm run typecheck` exits 0 | Run it | Small | **Open** |
| P1 | Align `@types/three` | Types 4 minors ahead of runtime | — | `package.json` | Versions agree; build passes | `npx tsc -b && npm run build` | Small | **Open** |

### Core Portfolio Completion

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | Fix ArtStation headline | Contradicts site/résumé positioning | Owner | External | Headline matches | Fetch profile JSON | Small | **Open** |
| P2 | Decide on a profile photo | No portrait exists | Owner | `media-manifest.mjs`, `Home.tsx` | Added or explicitly declined | Build + visual | Small–Medium | **Open** |
| P3 | Promote a 4th project to case study | Only 3 of 12 have depth | Owner picks | `projects.ts` | New route builds and deploys | Build + live check | Medium | **Open** |

### Quality and Accessibility

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | Screen-reader pass | Never tested | — | — | Landmarks/headings/links announce sensibly | NVDA or VoiceOver | Medium | **Open** |
| P2 | Reduced-motion + no-WebGL verification | Only structurally confirmed | — | — | Fallbacks observed working | OS setting + disabled WebGL | Small | **Open** |
| P3 | Add an error boundary | A render error blanks the hydrated page | — | `src/App.tsx` | Fallback UI on throw | Force an error | Small | **Open** |

### SEO and Performance

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | Dedicated OG image | Currently reuses a project JPEG | Design | `public/`, `routes.ts` | 1200×630 image; unfurl renders | Paste link into Slack/X | Small | **Open** |
| P3 | Lighthouse baseline | No measurement exists | Deployed site | — | Scores recorded here | Run Lighthouse | Small | **Open** |
| P3 | `npm audit` | Never run | — | — | No high/critical, or documented | Run it | Small | **Open** |

### Content and Design Polish

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P3 | Reconsider system fonts (DEC-005) | A self-hosted face would sharpen identity | Owner | `tokens.css` | Chosen and self-hosted, or DEC-005 confirmed | Build + visual | Medium | **Under Review** |
| P3 | Split `app.css` | ~1,300 lines in one file | — | `src/styles/` | Same output, clearer structure | Visual regression | Medium | **Open** |

### Release and Maintenance

| Priority | Task | Reason | Dependencies | Files | Acceptance | Testing | Complexity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P2 | Minimal test setup | No safety net | — | new | Smoke tests for router, media, slugify | `npm test` | Medium | **Open** |
| P3 | Cross-browser pass | None done | Deployed site | — | Table §24 filled in | Manual | Medium | **Open** |
| P3 | Dependency upgrades | 9 majors behind | — | `package.json` | Build + lint pass after | Full suite | Large | **Open** |

---

## 28. Prioritised Task Backlog

### TASK-001 — Human visual and motion review · **P0**
- **Problem:** No screenshot was ever taken and the automation browser produced 0 rAF callbacks. The site's appearance and all animation are entirely unverified.
- **Desired:** Owner confirms the site looks and behaves correctly, or lists defects.
- **Files:** none (observation task).
- **Guidance:** Open <https://tekkem007.github.io/portfolio/> on a normal desktop, the widest available monitor, and a real phone. Check: hero blockout→lit transition; section reveals on scroll; case-study rail sticking and its index highlight following the reading position; study scenes rotating; diagram legibility; ultrawide balance.
- **Acceptance:** A written list of defects, or explicit confirmation.
- **Risks:** Defects here could invalidate optimistic status labels in §7 and §11.
- **Complexity:** Small (owner time).

### TASK-002 — Fix the `typecheck` script · **P1**
- **Problem:** `npm run typecheck` fails with TS5096 **and pollutes the working tree with 26 emitted `.js` files** beside every source (ERR-008). None are gitignored, so a careless `git add -A` would commit compiled duplicates of the entire `src/` tree.
- **Desired:** Exits 0, type checks only, emits nothing.
- **Files:** `package.json`.
- **Guidance:** The flags `--noEmit false --emitDeclarationOnly false` both contradict `allowImportingTsExtensions` (`tsconfig.app.json:12`, `tsconfig.node.json:10`) and enable emit. Change the script to `"typecheck": "tsc -b"` — the same command CI already runs successfully.
- **Acceptance:** `npm run typecheck` exits 0; `git status --short` is empty afterwards; CI still green.
- **Testing:** Run it, then `git status`, then `npm run build`.
- **Risks:** None expected.
- **Complexity:** Small.
- **Optional hardening:** add `src/**/*.js` and `vite.config.js` to `.gitignore` so a future misconfiguration cannot leak build artifacts into a commit.

### TASK-003 — Align `@types/three` with `three` · **P1**
- **Problem:** `@types/three@0.185.1` vs `three@0.181.2` (ERR-009). Types may describe APIs the runtime lacks.
- **Desired:** Matching minor versions.
- **Files:** `package.json`, `package-lock.json`.
- **Guidance:** Either `npm i -D @types/three@0.181` **or** `npm i three@0.185 && npm i -D @types/three@0.185`. Prefer pinning types down first (smaller blast radius). `src/lib/scene.ts` and `src/lib/studyScene.ts` use only stable core APIs.
- **Acceptance:** Versions agree; `npx tsc -b` and `npm run build` pass; hero and study scenes still initialise.
- **Testing:** Build, then load a case study and confirm a `<canvas>` appears in `.study__stage`.
- **Risks:** Upgrading `three` is a larger change — verify both scenes if you take that route.
- **Complexity:** Small.

### TASK-004 — Correct the ArtStation headline · **P2**
- **Problem:** ArtStation says *"3D Environment / Prop Artist"*; the site and résumé say *3D Team Lead & Environment Artist* (ERR-011). Recruiters arriving from ArtStation see the older framing.
- **Desired:** Consistent positioning across public profiles.
- **Files:** none (external).
- **Guidance:** ArtStation → Settings → Profile → Headline.
- **Acceptance:** `https://www.artstation.com/users/voyagervishnu/quick.json` returns the updated headline.
- **Risks:** Owner may prefer the artist framing on ArtStation — a legitimate choice, in which case close this and note it.
- **Complexity:** Small.

### TASK-005 — Minimal automated test setup · **P2**
- **Problem:** No tests. Nothing catches regressions in the router, media lookup or slug generation.
- **Desired:** A `npm test` script with a few high-value unit tests.
- **Files:** new test files; `package.json`; possibly `vite.config.ts`.
- **Guidance:** Vitest fits the existing Vite setup. Highest-value targets: `toAppPath()` / `href()` in `src/lib/router.tsx` (base-path handling — the riskiest logic per DEC-004), `slugifyHeading()` in `CaseStudyRail.tsx` (rail anchors depend on it), and `getMedia()` in `src/lib/media.ts` (must return `null`, not throw, for unknown ids).
- **Acceptance:** `npm test` runs and passes; CI runs it before build.
- **Testing:** Run locally, then confirm the workflow.
- **Risks:** Adds a dev dependency — record in §19.
- **Complexity:** Medium.

### TASK-006 — Dedicated Open Graph image · **P2**
- **Problem:** Social previews reuse a project JPEG at its own aspect ratio; unfurls were never tested.
- **Desired:** A purpose-made 1200×630 image.
- **Files:** `public/`, `src/routes.ts` (`socialImage`).
- **Acceptance:** Renders correctly when the URL is pasted into a social platform.
- **Complexity:** Small.

### TASK-007 — Add an error boundary · **P3**
- **Problem:** After hydration, a render error blanks the page.
- **Files:** `src/App.tsx`.
- **Guidance:** Wrap the route resolution in a class error boundary rendering a minimal fallback with a link home.
- **Acceptance:** A deliberately thrown error shows the fallback, not a blank page.
- **Complexity:** Small.

### TASK-008 — Run `npm audit` and Lighthouse · **P3**
- **Problem:** Neither has ever been run; all performance claims are structural.
- **Acceptance:** Results recorded in §14 and §25.
- **Complexity:** Small.

---

## 29. Recommended Next Development Session

1. **Inspect first:** this document, then `git status`, then `git log --oneline -5`. Confirm the repo still matches §5.
2. **Reproduce first:** `npm run typecheck` — confirm ERR-008 still fails (expected: TS5096).
3. **Verify before editing:** nothing in `src/content/` may be changed without owner input. Treat all personal facts as read-only.
4. **Do first:** **TASK-002** (one-line script fix), then **TASK-003** (type alignment). Both are safe, isolated and verifiable without a browser.
5. **Files involved:** `package.json` (both tasks); `package-lock.json` (TASK-003).
6. **Expected result:** `npm run typecheck` exits 0; `three` and `@types/three` agree; `npm run build` still passes.
7. **Test:** `npm run lint && npm run typecheck && npm run build && npm run serve:dist`, then load `/portfolio/` and one case study, and confirm a `<canvas>` appears in `.study__stage`.
8. **Regressions to check:** hero canvas still initialises; study scenes still load; no new TypeScript errors in `src/lib/scene.ts` or `src/lib/studyScene.ts`.
9. **Update afterwards:** §18 (mark ERR-008/ERR-009 resolved **only if tested**), §23, §27, §28, §31 and the §2 estimate.

**Do not** start layout or content work before TASK-001 (human visual review) — you would be building on unverified assumptions.

---

## 30. AI Agent Handover Instructions

1. **Read this entire document before modifying anything.**
2. Verify it still matches the code; it is dated 2026-07-28.
3. `git status` before editing. Never overwrite unrelated changes.
4. Inspect existing components before creating new ones — there is no duplication today; keep it that way.
5. Preserve the architecture: content in `src/content/`, tokens in `tokens.css`, routes in `routes.ts`.
6. **Never fabricate** personal information, work history, projects, testimonials, achievements, skills, metrics or technical claims. Every claim must trace to the résumé, the owner's own published ArtStation text, or an explicit owner statement. See DEC-014 and ERR-012 — this has already gone wrong once and was caught.
7. Honour DEC-006 (no employer media), DEC-007 (Godot = familiarity only), DEC-008 (no phone).
8. Do not reverse DEC-012 (fail-open motion) or DEC-014 (diagram rule).
9. Do not add dependencies without recording reason and impact in §19.
10. Never expose credentials — there are none; keep it that way.
11. Test every meaningful change: lint, `npx tsc -b`, build, serve, browser, responsive, keyboard, console.
12. **Record honestly.** Never mark a test passed that you did not run. Distinguish structural verification from observed behaviour.
13. Log every error, fix attempt and whether it was verified (§18); every decision (§19); every session (§31).
14. Update completion estimates and status tables when they change.
15. Keep resolved issues in the history — mark superseded decisions, do not delete them.
16. Make small, reviewable, reversible changes.

---

## 31. Development Session Log

### 2026-07-28 — Initial build, deployment, ultrawide layout pass, and documentation

- **Agent:** Claude (Claude Code)
- **Objective:** Build a portfolio from verified sources, deploy to GitHub Pages, improve wide-screen space usage, then produce this handover document.
- **Starting branch / commit:** `main`, empty repository
- **Initial state:** No repository existed. A prior session had failed on an OAuth error before doing any work.
- **Files inspected:** résumé PDF (owner-supplied), ArtStation profile + 12 project JSON records, GitHub API (user + repos), `analyzer-tensor.com`, local Unreal folders under `E:\Project\game\` (found to be packaged Shipping builds, not source), `E:\UE5\classroom_evolved`.
- **Files created:** entire repository — 13 commits, 231 tracked files.
- **Sections added:** hero, disciplines, selected work, props & studies, capabilities, tools, experience, about, contact, 3 case studies, 404; later the case-study rail, study scenes and 3 diagrams.
- **Content:** all from the July 2026 résumé and the owner's own ArtStation write-ups.
- **Bugs fixed:** ERR-001 … ERR-007, ERR-012, ERR-013 (see §18).
- **Errors encountered:** 14 logged; 9 resolved, 4 open, 1 blocked.
- **Root causes identified:** missing `@types/three`; TS narrowing to `never`; React 19 prop casing; flex `min-width: auto`; Pages source unset; **rAF-driven APIs (GSAP ticker, IntersectionObserver, requestIdleCallback) silently never firing in a non-compositing browser**.
- **Decisions made:** DEC-001 … DEC-015.
- **Commands run:** `npm install`, `npm ci`, `npm run lint`, `npm run build`, `npm run media`, `npm run serve:dist`, `npx tsc -b`, `npm run typecheck` (failed), `python scripts/build-resume.py`, `git` (init/commit/push/cherry-pick), `curl` against ArtStation/GitHub/live site.
- **Test procedures:** DOM measurement of the built output across 35 route × viewport combinations; contrast via computed luminance; keyboard order via DOM; live HTTP checks; clean-clone build; machine verification of 31 diagram claims against ArtStation source text.
- **Test results:** 0 overflow, 0 broken images, 0 missing alt, 0 unprefixed links, 0 sub-24px targets, 0 stuck reveals, 0 console errors, worst contrast 5.07:1, 31/31 claims verified. Build and lint pass. `npm run typecheck` **fails** (ERR-008).
- **Build result:** Passing, including from a clean clone.
- **Deployment result:** Workflow #7 success; all routes live and verified.
- **Remaining issues:** ERR-008, ERR-009, ERR-010, ERR-011 open; ERR-014 blocked.
- **New risks:** the entire visual and motion layer is unverified by a human; no automated tests; base-path coupling across five files.
- **Completion estimate:** before 0% → **after 80–88%**
- **Recommended next action:** TASK-001 (owner visual review), then TASK-002 and TASK-003.

---

## 32. Unknowns and Required Owner Confirmation

| # | Question | Why it matters | Current assumption |
| --- | --- | --- | --- |
| 1 | **Does the site actually look right?** | Never seen by any human or agent | Assumed acceptable — **unverified** |
| 2 | Do the animations run smoothly? | Never observed | Assumed working — **unverified** |
| 3 | Should ArtStation's headline change to match? | Inconsistent public positioning (ERR-011) | Site uses the résumé title |
| 4 | Is a profile photograph wanted? | None exists | Assumed not required |
| 5 | Should more projects become case studies? | 9 of 12 are cards only | Assumed 3 is enough |
| 6 | Are testimonials, certifications or a blog wanted? | None exist | Assumed out of scope |
| 7 | Is the generated résumé wording approved? | Layout and header were authored, not copied | Assumed acceptable |
| 8 | Is the biography approved? | Written from résumé facts, in an editorial voice | Assumed acceptable |
| 9 | Is a custom domain planned? | Affects `SITE_URL`, base path, canonicals | Assumed no |
| 10 | Is analytics wanted? | None installed; would need a privacy note | Assumed no |
| 11 | Which browsers must be supported? | Nothing tested | Assumed evergreen + mobile Safari |
| 12 | May employer work ever be shown visually? | Currently words-only (DEC-006) | Assumed permanently restricted |
| 13 | Should the site move to a user site at the domain root? | Would fix `robots.txt` (ERR-010) and shorten the URL | Assumed staying at `/portfolio/` |
| 14 | Should the local folder be renamed to `portfolio`? | Cosmetic mismatch (DEC-013) | Left as-is |
| 15 | **Which `.glb` models can be published, and which projects need viewers?** | The model pipeline is complete but has no real asset. This is now the single highest-value content gap | Assumed the Maintenance Hangar modular kit is the best first candidate |
| 16 | Are the source `.blend` files available, and is any of that geometry client-owned or NDA-restricted? | Determines what may be exported at all | Assumed personal work is free to publish |
| 17 | Is a hero model wanted, or should models stay inside case studies? | A hero model is the biggest visual upgrade but the largest performance cost | Assumed case studies only, for now |

---

*End of document. Keep it updated — a stale handover is worse than none.*
