# DEVLOG.md — AI Spend Audit Build Log

> Format: `[DAY N — DATE] — Focus area — Key decisions`

---

## Day 1 — 2026-05-08 — Foundation + Setup

**What I built:**
- Scaffolded React + Vite + TypeScript project
- Installed and configured Tailwind CSS v3, Vitest, Supabase JS, Anthropic SDK, React Router, Zod
- Set up GitHub Actions CI (lint + test + build)
- Researched and documented all 8 tool pricing plans in PRICING_DATA.md (verified from official pages)
- Wrote core library files: `pricing-data.ts`, `audit-engine.ts`, `supabase.ts`, `anthropic.ts`, `utils.ts`
- 10 unit tests passing for audit engine
- Built SpendForm, AuditResults, LeadCapture components
- Built HomePage and AuditPage
- Wrote three serverless API functions: `summary.ts`, `leads.ts`, `og-meta.ts`

**Key decisions made today:**
- **React + Vite over Next.js:** Faster development loop; serverless functions in `/api/` dir handle SSR requirements. Trade-off: OG meta tags require the `og-meta.ts` workaround for crawlers.
- **Tailwind CSS v3 (not v4):** v4 is in beta; v3 is stable and the assignment explicitly allows it. Safer choice under deadline.
- **Honeypot over CAPTCHA:** No user friction, no third-party JS, no accessibility problems. Document assumption that sophisticated bots may defeat it — acceptable risk for MVP.
- **Credex credits threshold at $200/mo:** Conservative choice. At $200/mo, teams are committed spenders who will find value in a consultation. Lower threshold would produce noise recommendations.

**Surprises:**
- Vite's `create-vite` CLI cancelled when running in a non-empty directory — needed the `--overwrite` flag (not documented prominently).
- `@anthropic-ai/sdk` v0.95 ships with native fetch; no need for `node-fetch` polyfill.

**Tomorrow:**
- Set up Supabase project and run schema migration
- Deploy to Vercel and verify env vars
- Start user interview outreach on LinkedIn/X

**Commits today:**
```
feat: initialize Vite+React+TS project with Tailwind, Vitest, Supabase
feat: implement audit engine with defensible per-tool rules
feat: spend input form with localStorage persistence and Zod validation
feat: results page with hero savings card, per-tool breakdown, share button
feat: lead capture modal with honeypot spam protection
feat: AI summary integration with Anthropic API and template fallback
feat: serverless functions for summary, leads, og-meta
docs: PRICING_DATA.md with all 8 tools verified from official pages
docs: TESTS.md, PROMPTS.md
chore: GitHub Actions CI workflow (lint + test + build)
```

---

## Day 2 — 2026-05-09 — UI Polish + 404 Page + CSS Animations

**What I built:**
- Added `NotFoundPage.tsx` — handles broken/expired audit share links with a clear CTA to start a new audit
- Added catch-all `*` route in `App.tsx` so unknown paths land on 404 instead of a blank white screen
- Enhanced `index.css` with shimmer skeleton loader, staggered list reveal animation (`animate-stagger`), and counter roll keyframe for the hero savings number
- Applied stagger animation to tool breakdown list in `AuditResults.tsx` — each card reveals 80ms after the previous, making results feel alive
- Verified build still green (`npm run build` ✓) and all 10 tests still passing

**Key decisions made today:**
- **Stagger over simultaneous reveal:** All tool cards showing up at once creates a "wall of text" impression. Staggered reveal draws the eye down the list and emphasizes the top-savings tools naturally since they appear first (already sorted by descending savings).
- **404 as conversion opportunity:** Rather than a generic "page not found", the 404 copy frames the situation as "the audit expired" and immediately offers a new audit. Reduces dead-end bounce rate.
- **Shimmer loader added to CSS (not yet used in UI):** Pre-built for Day 4 when we load audit data from Supabase via URL — the skeleton will replace the spinner for a more polished loading state.

**Surprises:**
- The `animate-stagger > *` CSS selector works cleanly on the React-rendered `div` children without any JS intervention. Tailwind's `content` scan picks up the class name because it's in a `.tsx` file — no safelist needed.

**Tomorrow:**
- Hook up Supabase (requires user to provision project + add env vars to `.env.local`)
- Test the full end-to-end flow: form → audit → Supabase write → shareable URL
- Start user interview outreach

**Commits today:**
```
feat: add 404 NotFoundPage with new-audit CTA
feat: stagger animation on audit results tool breakdown list
style: shimmer loader, counter-roll, stagger CSS utilities in index.css
```

---

## Day 3 — 2026-05-09 — Supabase Integration + End-to-End Test

**What I built:**
- Connected Supabase project (`aaduwtkwxejbxuvnccsh`) — provisioned `audits` and `leads` tables with full Row-Level Security
- Configured `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Ran full end-to-end test: form → audit engine → Supabase write → shareable `/audit/:uuid` URL
- Confirmed AI summary is generating from the templated fallback (Anthropic key not yet set — that's fine for Day 3)
- Verified Supabase persistence: audit result saved with UUID `6950dc93-0a67-4456-85a2-4902bcc165a2`, directly accessible via shareable URL

**Full test results (8-person team, Cursor Business + Copilot Business):**
- Total monthly savings identified: **$64/mo** ($768/yr)
- Cursor: High priority Credex credits opportunity ($64/mo savings)
- GitHub Copilot: ✓ Optimal (correctly identified as right-sized)
- AI Analysis section: Rendered correct templated summary citing specific tools and dollar amounts
- Tool breakdown: Per-tool cards with stagger animation working smoothly
- Share Results + Get Full Report buttons: Visible and functional
- URL after submit: `/audit/6950dc93-0a67-4456-85a2-4902bcc165a2` ✓

**Key decisions made today:**
- **Supabase anon key is safe to expose in frontend:** It's scoped by Row-Level Security. Even if someone reads the key from the bundle, they can only do what the RLS policies allow (SELECT on audits, INSERT on audits/leads). No admin operations possible.
- **Templated AI summary is good enough for MVP:** The output is finance-literate and specific. Without a logged Anthropic key, it proves the fallback works correctly — no degraded UX.

**Surprises:**
- The Supabase insert returned a valid UUID on the first try — no CORS issues, no RLS rejections. The policy setup was correct.
- GitHub Copilot Business at 18 seats ($19/seat = $342/mo) was correctly flagged as Optimal (above the right-size threshold for Business plan). Audit engine logic is working as expected.

**Tomorrow:**
- Deploy to Vercel (connect GitHub repo → set env vars → verify production URL)
- Add `ANTHROPIC_API_KEY` to Vercel env vars for live AI summaries
- Update README with live deployed URL and screenshots

**Commits today:**
```
feat: connect Supabase — audits and leads tables with RLS policies
test: full end-to-end audit flow verified (form → Supabase → shareable URL)
```

---

## Day 4 — [DATE] — [Focus]

_To be written on Day 4_

---

## Day 5 — [DATE] — [Focus]

_To be written on Day 5_

---

## Day 6 — [DATE] — [Focus]

_To be written on Day 6_

---

## Day 7 — [DATE] — [Focus]

_To be written on Day 7_
