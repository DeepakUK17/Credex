# AI Spend Audit — PRICING_DATA.md

> All pricing verified from official vendor pages. Last verified: **2026-05-08**.
> Prices are in USD/month. See `src/lib/pricing-data.ts` for machine-readable constants.

---

## Cursor

| Plan | Price/seat/month | Notes |
|---|---|---|
| Hobby | $0 | Free tier, limited completions |
| Pro | $20 | $20/month flat |
| Business | $40 | $40/seat/month, billed annually |

**Source:** https://www.cursor.com/pricing  
**Verified:** 2026-05-08

---

## GitHub Copilot

| Plan | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | 2,000 completions/month, 50 chat messages/month |
| Individual | $10 | $10/month or $100/year |
| Business | $19 | $19/seat/month, policy management, audit logs |
| Enterprise | $39 | $39/seat/month, fine-tuned models, enterprise SSO |

**Source:** https://github.com/features/copilot  
**Verified:** 2026-05-08

---

## Claude / Anthropic (claude.ai)

| Plan | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | Limited to Claude 3.5 Haiku |
| Pro | $20 | $20/month, priority access, 5× more usage |
| Max (5×) | $100 | $100/month, 5× usage ceiling vs Pro |
| Max (20×) | $200 | $200/month, 20× usage ceiling vs Pro |
| Team | $30 | $30/seat/month, minimum 5 seats, admin controls |
| Enterprise | ~$60 | Negotiated; estimated based on public announcements |

**Source:** https://claude.ai/pricing  
**Verified:** 2026-05-08

---

## Anthropic API (Direct)

Usage-based token pricing:
- Claude claude-opus-4-5: $15/1M input tokens, $75/1M output tokens
- Claude 3.5 Sonnet: $3/1M input, $15/1M output
- Claude 3.5 Haiku: $0.80/1M input, $4/1M output

**Source:** https://www.anthropic.com/pricing  
**Verified:** 2026-05-08

---

## ChatGPT / OpenAI (chat.openai.com)

| Plan | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | GPT-4o with limits |
| Plus | $20 | $20/month, higher limits, DALL-E, advanced voice |
| Pro | $200 | $200/month, unlimited o1-pro, extended thinking |
| Team | $30 | $30/seat/month billed annually, min 2 seats |
| Enterprise | Negotiated | Estimated $60+/seat; requires direct sales |

**Source:** https://openai.com/chatgpt/pricing  
**Verified:** 2026-05-08

---

## OpenAI API (Direct)

Usage-based token pricing:
- GPT-4o: $2.50/1M input, $10/1M output
- GPT-4o mini: $0.15/1M input, $0.60/1M output
- o1: $15/1M input, $60/1M output

**Source:** https://openai.com/api/pricing  
**Verified:** 2026-05-08

---

## Gemini / Google

| Plan | Price/seat/month | Notes |
|---|---|---|
| Free (1.5 Flash) | $0 | Rate-limited, via Google AI Studio |
| Gemini Advanced | $22 | $21.99/month via Google One AI Premium |
| API (pay-as-you-go) | Variable | Gemini 1.5 Pro: $3.50/1M tokens ≤128k ctx |

**Source:** https://ai.google.dev/pricing + https://one.google.com/about/plans  
**Verified:** 2026-05-08

---

## Windsurf (Codeium)

| Plan | Price/seat/month | Notes |
|---|---|---|
| Free | $0 | 5 free flow credits/month |
| Pro | $15 | $15/month, 25 flow credits |
| Pro+ | $35 | $35/month, unlimited flow credits |
| Teams | $35 | $35/seat/month, min 2 seats |

**Source:** https://windsurf.com/pricing  
**Verified:** 2026-05-08

---

## Credex Credits Assumption

For tools with retail monthly spend **>$200**, the audit engine surfaces a Credex credits recommendation with an estimated **20-30% discount**.

**This is an estimate.** Actual discounts depend on:
- Vendor relationship and negotiated agreement
- Contract term length (annual vs. multi-year)
- Total spend commitment across all tools

This assumption is documented explicitly in every recommendation that mentions it. The 20% lower bound is the conservative estimate used in savings calculations.

**Basis:** Credex internal estimates from vendor negotiation experience (not a public URL — this is a business assumption, not a vendor-published rate).
