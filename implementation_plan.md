# Credex WebDev 2026 — Full Implementation Plan
## Product: AI Spend Audit Tool

---

## 1. ASSIGNMENT SNAPSHOT

| Item | Detail |
|---|---|
| Type | 7-day take-home build |
| Eval | AI first pass → human review for shortlisted |
| Format | File naming/structure strictly enforced |
| Score | 100 points across 7 dimensions |

---

## 2. SCORING RUBRIC

| Dimension | Weight | What wins |
|---|---|---|
| Entrepreneurial thinking | **25 pts** | GTM, economics, user interviews, landing copy, metrics |
| Engineering skills | 15 pts | Git hygiene, CI green, 5+ tests, deployed, accessible |
| Thinking models | 15 pts | ARCHITECTURE depth, REFLECTION specificity, README Decisions |
| Programming skills | 15 pts | Readable, typed, sensible abstractions, no obvious bugs |
| Hard work | 10 pts | All 6 MVP features + polish + bonus attempted |
| Discipline & consistency | 10 pts | DEVLOG 7 entries, commits on 5+ distinct days |
| Audit logic polish | 10 pts | Finance-literate reasoning, defensible numbers |

> [!IMPORTANT]
> Entrepreneurial thinking is 25 pts — the biggest category. Do NOT skimp on GTM.md, ECONOMICS.md, USER_INTERVIEWS.md.

---

## 3. THE 6 REQUIRED MVP FEATURES

### Feature 1 — Spend Input Form

**Tools to support (minimum 8):**
- Cursor: Hobby / Pro / Business / Enterprise
- GitHub Copilot: Individual / Business / Enterprise
- Claude: Free / Pro / Max / Team / Enterprise / API direct
- ChatGPT: Plus / Team / Enterprise / API direct
- Anthropic API direct
- OpenAI API direct
- Gemini: Pro / Ultra / API
- Windsurf OR v0 (pick one)

**Per-tool fields:** plan dropdown, monthly spend ($), number of seats

**Global fields:** team size, primary use case (coding/writing/data/research/mixed)

**Critical:** Form state must persist across page reloads via localStorage.

---

### Feature 2 — Audit Engine

For each tool, evaluate:
1. Are they on the right plan for their team size?
2. Is there a cheaper plan from the same vendor?
3. Is there a substantially cheaper alternative for their use case?
4. Are they paying retail when Credex credits could help?

**Rules:** Logic must be defensible to a finance person. All pricing data must be current at submission. Sources cited in PRICING_DATA.md. Hardcoded rules are correct — do NOT use AI for the math.

---

### Feature 3 — Audit Results Page

- Per-tool: current spend → recommended action → savings + 1-sentence reason
- Hero: total monthly savings + annual savings (big and clear)
- If savings >$500/mo: surface Credex consultation CTA prominently
- If savings <$100/mo or already optimal: honest "You're spending well" + notify-me signup
- Visual quality matters — this page gets screenshotted and shared

---

### Feature 4 — AI-Generated Personalized Summary

- Use Anthropic API (preferred) or any LLM
- Generate ~100-word personalized summary from audit data
- Graceful fallback to templated summary on API failure
- Full prompt goes in PROMPTS.md

---

### Feature 5 — Lead Capture + Storage

- Email capture with optional: company name, role, team size
- Real backend: Supabase (recommended)
- Transactional email via Resend (recommended): confirms audit, notes Credex follow-up for high-savings cases
- Abuse protection: honeypot field (recommended) — document choice and why

---

### Feature 6 — Shareable Result URL

- Each audit gets a unique public URL (/audit/[id])
- Strip PII (name, email) from public version; show tools and savings only
- Open Graph tags + Twitter Card for link previews
- Use @vercel/og for dynamic OG images showing the savings number
- This is the viral loop — design for sharing

---

## 4. BONUS FEATURES (only after MVP works end-to-end)

- PDF export of full report
- Embeddable widget script tag
- Benchmark mode: "your AI spend per dev is $X — companies your size average $Y"
- Referral codes
- Blog post / Twitter thread draft for launch

---

## 5. RECOMMENDED TECH STACK

| Layer | Choice | Why |
|---|---|---|
| Framework | **React + Vite** | Explicitly allowed, fast dev experience, wide ecosystem |
| Language | TypeScript | Strongly preferred by assignment |
| Styling | Tailwind CSS + shadcn/ui | Explicitly allowed, fast premium UI |
| Backend/API | Vercel Serverless Functions (api/ dir) | Zero-config API routes deployed alongside the SPA |
| Database | Supabase | Free tier, Postgres, real-time |
| Email | Resend | Free 3k/mo, best DX |
| LLM | Anthropic API (Claude) | Preferred by assignment |
| Deployment | Vercel | Free, SPA + serverless functions in one deploy |
| CI | GitHub Actions | Required by assignment |
| OG Tags | Serverless HTML shell via api/og-meta | Pre-rendered meta tags for social crawlers (see Section 13) |

> [!WARNING]
> **OG Tags tradeoff with React SPA:** Social crawlers (Twitter, LinkedIn, Slack) do not execute JavaScript, so a pure SPA cannot serve dynamic OG meta tags. Solution: a lightweight Vercel serverless function at `/api/og-meta?id=[auditId]` returns a minimal HTML shell with the correct `<meta>` tags and an instant JS redirect to the full SPA route. This is documented as a trade-off in README.md Decisions section.

Document all choices with justification in ARCHITECTURE.md.

---

## 6. REQUIRED FILES AT REPO ROOT

### Engineering Files

| File | Required Content |
|---|---|
| README.md | 2-3 sentence summary, 3+ screenshots or recording link, quick start, 5 trade-offs, deployed URL |
| ARCHITECTURE.md | Mermaid system diagram, data flow, stack justification, 10k-scale plan |
| DEVLOG.md | 7 daily entries (exact format), honest, backdating visible in git = instant reject |
| REFLECTION.md | 5 questions answered, 150-400 words each |
| TESTS.md | Every test listed with filename, coverage, how to run |
| .github/workflows/ci.yml | Lint + tests on every push to main, must show green |
| PRICING_DATA.md | Every number cited with official vendor URL + date |
| PROMPTS.md | Full LLM prompts + why you wrote them + what didn't work |

### Entrepreneurial Files

| File | Required Content |
|---|---|
| GTM.md | 300-700 words: exact target user, what they Google, where online, 100 users in 30 days $0, unfair channel, week-1 traction numbers |
| ECONOMICS.md | 300-700 words: lead value, CAC per channel, conversion funnel math, $1M ARR path with actual numbers |
| USER_INTERVIEWS.md | 3 real interviews, 150-300 words each, name/initials, role, 3+ direct quotes, surprises, design changes |
| LANDING_COPY.md | Hero (<=10 words), subheadline (<=25 words), CTA copy, social proof block, 5 FAQ Q&As |
| METRICS.md | 200-500 words: North Star metric + why, 3 input metrics, instrumentation plan, pivot trigger number |

---

## 7. GIT HISTORY REQUIREMENTS

> [!CAUTION]
> Fewer than 5 distinct calendar days of commits = **automatic rejection**. Checked programmatically.

- Minimum 5 distinct calendar days of commits in the 7-day window
- Verify: `git log --pretty=format:"%ad" --date=short | sort -u | wc -l`
- Use Conventional Commits: feat:, fix:, docs:, refactor:, chore:, test:
- Good: `fix: handle 429 from Anthropic API gracefully in summary fallback`
- Bad: `update`, `fix`, `wip`, `asdf`

---

## 8. DAY-BY-DAY EXECUTION PLAN

### Day 1 — Foundation + Setup
- Create Next.js 14 + TypeScript project
- Set up Tailwind CSS + shadcn/ui
- Initialize public GitHub repo
- Create Supabase project + audits/leads tables
- Configure Vercel deployment (connect GitHub repo)
- Set up GitHub Actions CI workflow
- Research + document ALL current pricing for all 8 tools in PRICING_DATA.md draft
- Write Day 1 DEVLOG entry
- Commit: `feat: initialize project, configure Supabase, deploy to Vercel`
- **Start user interview outreach today — DM founders on X/LinkedIn**

### Day 2 — Spend Input Form (Feature 1)
- Design and build multi-tool spend input form
- Each tool: plan dropdown, monthly spend field, seats field
- Global: team size, use case selector
- localStorage persistence (auto-save on change, restore on load)
- Form validation with Zod
- Mobile-responsive layout
- Write Day 2 DEVLOG entry
- Commit: `feat: spend input form with localStorage persistence and Zod validation`

### Day 3 — Audit Engine (Feature 2)
- Build audit engine as pure TypeScript module: lib/audit-engine.ts
- Per-tool rules: plan fit, cheaper vendor option, alternative tool, Credex opportunity
- Calculate per-tool savings, total monthly savings, total annual savings
- Write minimum 5 unit tests covering audit engine logic
- Update TESTS.md
- Write Day 3 DEVLOG entry
- Commit: `feat: audit engine with defensible per-tool rules and unit tests`

### Day 4 — Results Page + Shareable URL (Features 3 & 6)
- Build results page UI (hero savings card, per-tool breakdown, CTA branching)
- POST audit to API, store in Supabase, return unique ID
- Create /audit/[id] route with SSR for OG tags
- Add Open Graph + Twitter Card meta tags
- Implement @vercel/og dynamic image endpoint
- High-savings vs low-savings UI branching logic
- Write Day 4 DEVLOG entry
- Commit: `feat: results page with shareable URL, OG tags, and dynamic og-image`

### Day 5 — AI Summary + Lead Capture (Features 4 & 5)
- Integrate Anthropic API for personalized ~100-word summary
- Implement fallback to templated summary on any API failure
- Build email capture modal (appears after results are shown)
- Optional fields: company name, role, team size
- Store lead in Supabase leads table
- Set up Resend transactional email
- Add honeypot field + IP-based rate limiting
- Write PROMPTS.md
- Write Day 5 DEVLOG entry
- Commit: `feat: AI summary with fallback, lead capture, Resend transactional email`

### Day 6 — Polish + Docs + Bonus
- Accessibility audit (aria labels, focus states, color contrast) — target >=90
- Lighthouse performance optimization — target >=85
- Mobile responsive QA
- Write ARCHITECTURE.md with Mermaid diagram
- Write REFLECTION.md (all 5 questions)
- Write GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md
- Attempt one bonus feature (PDF export recommended: react-pdf or @react-pdf/renderer)
- Write Day 6 DEVLOG entry
- Commit: `docs: complete ARCHITECTURE, REFLECTION, GTM, ECONOMICS, METRICS, LANDING_COPY`

### Day 7 — Interviews + Final QA + Submit
- Conduct/finalize 3 real user interviews (outreach started Day 1)
- Write USER_INTERVIEWS.md
- Complete README.md with screenshots/recording and 5 trade-offs
- Final DEVLOG.md entry
- Run git log check — verify >=5 distinct days
- Run full CI locally
- Verify deployed URL is live
- Submit Google Form: repo URL + live URL

---

## 9. PRICING DATA TO RESEARCH (Day 1)

| Tool | Source URL |
|---|---|
| Cursor | cursor.sh/pricing |
| GitHub Copilot | github.com/features/copilot |
| Claude / Anthropic API | claude.ai/pricing + anthropic.com/pricing |
| ChatGPT / OpenAI API | openai.com/chatgpt/pricing + openai.com/api/pricing |
| Gemini | ai.google.dev/pricing |
| Windsurf | windsurf.com/pricing (if chosen) |
| v0 | v0.dev/pricing (if chosen) |

Verify every number from the official page. Record date accessed. Format in PRICING_DATA.md.

---

## 10. AUDIT ENGINE — DEFENSIBLE RULES

### Plan Fit Rules
- Claude Team for <=2 users: "Downgrade to Pro — 2 individual Pro plans cost same or less"
- GitHub Copilot Business for 1 seat: "Switch to Individual — save $9/seat/month"
- ChatGPT Team for 1 user: "Downgrade to Plus — save $10/month"
- Cursor Business for <=2 seats: "Consider Pro — Business adds admin controls not needed at this size"

### Alternative Tool Rules (by use case)
- Coding: compare Cursor Pro vs GitHub Copilot by cost-per-seat for their seat count
- Writing: ChatGPT Plus vs Claude Pro — Claude typically cheaper for long-form content
- Research: surface Perplexity Pro as a cheaper research-focused alternative
- Mixed: align recommendation to primary use case

### Credex Opportunity Rule
- Any tool where retail monthly spend >$200: surface Credex credits (estimate 20-30% discount, document assumption explicitly)

---

## 11. DATABASE SCHEMA (Supabase)

```sql
-- Audit results (public-safe)
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  team_size INT,
  use_case TEXT,
  tools JSONB,                  -- [{tool, plan, spend, seats}]
  results JSONB,                -- audit engine output per tool
  total_monthly_savings DECIMAL,
  total_annual_savings DECIMAL,
  ai_summary TEXT,
  is_high_savings BOOLEAN
);

-- Lead captures (PII — not in public audit URL)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  audit_id UUID REFERENCES audits(id),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INT,
  ip_hash TEXT                  -- for rate limiting, never store raw IP
);
```

---

## 12. PROJECT STRUCTURE

```
/
  src/
    main.tsx                    # React entry point
    App.tsx                     # Router setup (React Router v6)
    pages/
      HomePage.tsx              # Landing + spend input form
      AuditPage.tsx             # Results page (reads ?id= or /audit/:id)
    lib/
      audit-engine.ts           # Pure audit logic — no side effects, fully testable
      pricing-data.ts           # All pricing constants with sources
      anthropic.ts              # AI summary + fallback logic
      supabase.ts               # Supabase browser client
    components/
      SpendForm/
      AuditResults/
      LeadCapture/
      ShareButton/
    __tests__/
      audit-engine.test.ts      # >=5 required tests (Vitest)
  api/                          # Vercel Serverless Functions
    audit.ts                    # POST: run audit, store in Supabase, return ID
    leads.ts                    # POST: capture lead, send Resend email
    summary.ts                  # POST: generate Anthropic AI summary
    og-meta.ts                  # GET: return HTML shell with OG meta tags + JS redirect
  public/
    og-default.png              # Static fallback OG image
  index.html
  vite.config.ts
  vercel.json                   # Route rewrites for SPA + serverless functions

# Root files (ALL required)
  README.md
  ARCHITECTURE.md
  DEVLOG.md
  REFLECTION.md
  TESTS.md
  PRICING_DATA.md
  PROMPTS.md
  GTM.md
  ECONOMICS.md
  USER_INTERVIEWS.md
  LANDING_COPY.md
  METRICS.md
  .github/workflows/ci.yml
```

---

## 13. OG / VIRAL LOOP STRATEGY (React SPA Approach)

Because this is a React SPA, OG meta tags require a serverless workaround for social crawlers.

**How it works:**
1. Shareable URL format: `https://yourapp.com/audit/[id]`
2. `vercel.json` rewrites `/audit/:id` → `/api/og-meta?id=:id` for non-browser user agents (crawlers)
3. `/api/og-meta` serverless function: fetches audit from Supabase, returns minimal HTML with OG tags + instant meta-refresh redirect
4. Real browsers get the full React SPA via the normal SPA routing

**`/api/og-meta.ts` response:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="I found $1,200/mo in AI savings — check yours free" />
  <meta property="og:description" content="Free AI spend audit. Audited: Cursor, Claude, ChatGPT." />
  <meta property="og:image" content="https://yourapp.com/public/og-default.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta http-equiv="refresh" content="0;url=/audit/[id]" />
</head>
<body>Redirecting...</body>
</html>
```

**`vercel.json` config:**
```json
{
  "rewrites": [
    { "source": "/audit/:id", "destination": "/index.html" }
  ]
}
```

Note: For the static OG image, create a well-designed PNG that includes a savings placeholder or use `satori` in the serverless function to generate a dynamic image. Document this tradeoff in README.md Decisions section.

---

## 14. ENTREPRENEURIAL FILES GUIDANCE

### GTM.md — Be specific, not generic
- Primary user: Engineering Manager at 15-50 person Series A startup
- Secondary: Solo technical founder running >$500/mo in AI tools
- What they Google: "cursor vs copilot price comparison", "reduce AI costs startup", "claude team vs pro plan"
- Where they hang: r/startups, r/SaaS, Hacker News Show HN, Indie Hackers, specific X lists of startup CTOs
- Channel to 100 users: Post on HN (Show HN), DM 20 founders on X with personalized message, post in 3 relevant Slack communities
- Unfair channel: Credex's existing customer base + partner network

### ECONOMICS.md — Show actual math
- Credex average deal: $10k-$50k credits (estimate conservatively)
- Gross margin on credits: ~15-25%
- Funnel: 1000 audits → 5% book consultation → 30% of consultations convert → deal value $15k avg
- Math that path to $1M ARR

### USER_INTERVIEWS.md — START DAY 1
> [!CAUTION]
> Fabricated interviews = **instant reject**. They are obvious — no specific contradictions, generic quotes, no surprising moments. Start DM-ing on Day 1.

Find interviewees: DM founders on X, post in Indie Hackers community, use college network, LinkedIn connections.

---

## 15. REFLECTION.md QUESTION GUIDANCE

1. **Hardest bug:** Be specific — describe hypothesis, what you tried, what worked. Example: "The audit engine was returning NaN for annual savings when monthly spend was not entered — traced it to missing Zod default value for spend field..."
2. **A decision you reversed:** Be honest. Example: switching from client-side audit calculation to server-side API route for security/testability.
3. **Week 2 plans:** Benchmark mode, embeddable widget, saved audit history.
4. **AI tool usage:** Which tool, for what tasks, what you didn't trust it with, one time it was wrong and you caught it.
5. **Self-rating 1-10:** All 5 dimensions with one honest sentence each. Scores in the 7-8 range with genuine reflection score higher than all 10s.

---

## 16. GITHUB ACTIONS CI TEMPLATE

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test        # Vitest (runs audit-engine tests)
      - run: npm run build       # Verify Vite build succeeds
```

**Vitest setup in `vite.config.ts`:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.ts']
  }
})
```

---

## 17. ABUSE PROTECTION RECOMMENDATION

**Use a honeypot field** — simplest, no third-party, no user friction:

```html
<!-- Hidden from real users, bots fill it -->
<input name="website" style="display:none" tabindex="-1" autocomplete="off" />
```

In the API route, reject any submission where `website` is populated.

Also add: simple in-memory or Upstash Redis rate limit — max 10 audits/hour per IP.

Document choice + reasoning in ARCHITECTURE.md.

---

## 18. FINAL SUBMISSION CHECKLIST

```
PUBLIC GITHUB REPO
[ ] Repo is public
[ ] All required files present at root
[ ] CI shows green on latest commit
[ ] Git log has >=5 distinct calendar days
[ ] No secrets in repo (env vars only)
[ ] Conventional commit messages throughout

LIVE DEPLOYED URL
[ ] Vercel/Netlify/etc URL is reachable
[ ] All 6 MVP features work end-to-end

ENGINEERING FILES
[ ] README.md — summary, screenshots, quick start, 5 trade-offs, deployed URL
[ ] ARCHITECTURE.md — Mermaid diagram, data flow, stack, scale plan
[ ] DEVLOG.md — 7 daily entries in exact format
[ ] REFLECTION.md — 5 questions, 150-400 words each
[ ] TESTS.md — 5+ tests listed, runnable
[ ] .github/workflows/ci.yml — green
[ ] PRICING_DATA.md — every number with URL + date
[ ] PROMPTS.md — full prompts + reasoning

ENTREPRENEURIAL FILES
[ ] GTM.md — 300-700 words, specific channels
[ ] ECONOMICS.md — 300-700 words, show math
[ ] USER_INTERVIEWS.md — 3 real interviews
[ ] LANDING_COPY.md — hero, CTA, social proof, 5 FAQs
[ ] METRICS.md — North Star, input metrics, pivot trigger

QUALITY
[ ] Lighthouse Performance >=85
[ ] Lighthouse Accessibility >=90
[ ] Lighthouse Best Practices >=90
[ ] Mobile responsive
[ ] No broken links or console errors on deployed URL

SUBMISSION
[ ] Google Form submitted with repo URL + live URL
```
