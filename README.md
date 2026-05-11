# AI Spend Audit — by Credex

> **Audit your AI tool spending in 60 seconds. Free, no account required.**

Find hidden savings across Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, and more. Get a defensible, finance-ready savings report and shareable results link.

---

## 🚀 Live Demo

**[→ credex-coral.vercel.app](https://credex-coral.vercel.app)**

---

## ⚡ Lighthouse Scores

- **Performance:** 99
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 91

---

## Screenshots

![Landing Page + Form](SS/Screenshot%202026-05-11%20220328.png)
![Audit Results High Savings](SS/Screenshot%202026-05-11%20220347.png)
![Lead Capture Modal](SS/Screenshot%202026-05-11%20220406.png)
![Share View](SS/Screenshot%202026-05-11%20220437.png)  

---

## Quick Start

```bash
git clone https://github.com/your-username/credex-ai-spend-audit.git
cd credex-ai-spend-audit
npm install
cp .env.local .env.local.filled   # Edit with your Supabase keys
npm run dev
npm run test
```

**Required env vars:**
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**Serverless (set in Vercel dashboard):**
```
ANTHROPIC_API_KEY=
RESEND_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Project Structure

```
src/
  lib/
    audit-engine.ts    # Core audit logic (pure TypeScript, no I/O)
    pricing-data.ts    # All pricing constants with sources
    anthropic.ts       # AI summary + fallback
    supabase.ts        # Database client
    utils.ts           # Formatters, localStorage helpers
  components/
    SpendForm/         # Multi-tool spend input
    AuditResults/      # Results display
    LeadCapture/       # Email capture modal
  pages/
    HomePage.tsx       # Landing + form
    AuditPage.tsx      # Results (shared URL)
  __tests__/
    audit-engine.test.ts  # 10 unit tests
api/
  summary.ts           # Anthropic AI summary (serverless)
  leads.ts             # Lead save + Resend email (serverless)
  og-meta.ts           # OG tags for social crawlers (serverless)
```

---

## 5 Key Technical Trade-offs

| Decision | Trade-off | Rationale |
|---|---|---|
| **Client-side audit logic** | Rules exposed in JS bundle | Rules are public pricing data. Eliminates latency, enables instant results, trivially testable. |
| **OG tags via serverless** | Crawler differs from browser | React SPAs can't serve dynamic OG tags. `api/og-meta.ts` is a documented workaround. |
| **No authentication** | Can't offer audit history | Friction kills conversion. Honeypot + rate limiting handles MVP-level abuse. |
| **Hardcoded pricing data** | Prices drift over time | No vendor pricing API exists. Transparent verified date makes freshness explicit. |
| **Honeypot vs CAPTCHA** | Sophisticated bots can bypass | CAPTCHA has accessibility issues and adds 15-30s friction. At MVP scale, honeypot covers 99%. |

See **ARCHITECTURE.md** for full discussion.

---

## Supabase Schema

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  team_size INT,
  use_case TEXT,
  tools JSONB,
  results JSONB,
  total_monthly_savings DECIMAL,
  total_annual_savings DECIMAL,
  ai_summary TEXT,
  is_high_savings BOOLEAN
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  audit_id UUID REFERENCES audits(id),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  team_size INT,
  ip_hash TEXT
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public audits viewable" ON audits FOR SELECT USING (true);
CREATE POLICY "Anyone can create audit" ON audits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create lead" ON leads FOR INSERT WITH CHECK (true);
```

---

## CI

[![CI](https://github.com/DeepakUK17/Credex/actions/workflows/ci.yml/badge.svg)](https://github.com/DeepakUK17/Credex/actions/workflows/ci.yml)

`npm run test` · `npm run lint` · `npm run build`

---

## Required Files Status

README · ARCHITECTURE · DEVLOG · REFLECTION · TESTS · PRICING_DATA · PROMPTS · GTM · ECONOMICS · USER_INTERVIEWS · LANDING_COPY · METRICS · .github/workflows/ci.yml — **all present ✓**
