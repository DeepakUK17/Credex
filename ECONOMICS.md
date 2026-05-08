# ECONOMICS.md — Unit Economics & Path to $1M ARR

**Word count:** ~480 words

---

## What Does a Lead Actually Cost Credex?

The AI Spend Audit is a **free lead acquisition tool** for Credex's core business: negotiating AI vendor credits and licenses for startups.

**Credex core model:**
- Startup signs up for Credex → Credex negotiates bulk/credit deals on their behalf
- Credex earns a margin on the credits deployed
- Average deal: $15,000 in credits placed → Credex earns ~$2,250–$3,750 (15-25% margin)

**Cost to produce an audit lead:** $0 in COGS (client-side compute). Server costs: ~$0.003/audit (Supabase write + Vercel function runtime + Resend email). Negligible.

---

## Conversion Funnel Math

```
10,000 audits/month
  → 12% email capture rate              = 1,200 leads
    → 5% book a consultation             = 60 consultations
      → 30% convert to Credex customer   = 18 new customers/month
        × $2,500 average gross profit/customer
        = $45,000 gross profit/month from the audit tool
        = $540,000/year from one acquisition channel
```

**CAC from this channel:** $0 paid acquisition. The marginal cost per acquired customer is the allocated engineering cost of maintaining the audit tool: ~$500/month (1 day/month maintenance) / 18 customers = **$28 CAC**.

---

## CAC by Channel

| Channel | CAC | Volume | Scalable? |
|---|---|---|---|
| Audit tool (this product) | $28 | High | ✓ Yes |
| LinkedIn outbound | $400-800 | Medium | Partially |
| HN / Indie Hackers | $0 (time) | Low-Medium | Partially |
| Content (SEO) | $200 (time) | High at scale | ✓ Yes |
| Existing Credex network | $0 | Limited | No |

The audit tool is the highest-leverage channel by a wide margin.

---

## Path to $1M ARR

$1M ARR = ~$83,000/month gross profit from the audit channel alone.

Working backward:
```
$83,000/month gross profit
÷ $2,500 average gross profit/customer
= 33 new customers/month needed

From the funnel:
33 customers = 110 consultations = 2,200 leads = 18,333 audits/month

To reach 18,333 audits/month in 12 months:
Month 1: 500 audits (HN launch + outreach)
Month 3: 2,000 audits (SEO traction + word of mouth)
Month 6: 6,000 audits (repeat visitors + partnerships)
Month 12: 18,000 audits (established brand in "AI cost optimization")
```

This is achievable. The "AI cost anxiety" category is real and growing — every new model release creates a new wave of teams reconsidering their stack.

---

## Key Assumptions to Validate

| Assumption | How to validate |
|---|---|
| 5% book consultation | Track in Supabase + Calendly. Adjust funnel math monthly. |
| 30% consult → convert | Interview the first 10 consultations |
| $2,500 avg gross profit | Pull from Credex historical data |
| 12% email capture | A/B test CTA copy and modal timing |

**Pivot trigger:** If audit → consultation rate falls below 2% after 500 audits, the tool is attracting the wrong audience. Revisit targeting and consider restricting free audit to teams ≥5 seats.
