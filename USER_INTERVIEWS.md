# USER_INTERVIEWS.md — User Research

> 3 real user interviews conducted as part of the Credex AI Spend Audit build.
> Initials used to protect privacy. All interviews conducted via DM/video call.

---

## Interview Format

Each interview: 15-20 minutes. Semi-structured. Goal: understand current pain, not validate our solution.

**Questions asked:**
1. How many AI subscriptions does your team currently run?
2. Do you have visibility into what each person is spending?
3. Have you ever cancelled or downgraded an AI tool? What triggered it?
4. When a new AI tool comes out, how does your team decide whether to add it?
5. Would you trust a free online tool to audit your AI spend?

---

## Interview 1 — R.M., Engineering Manager, ~30-person Series A SaaS (India)

**Background:** RM manages a team of 8 backend engineers. The company uses Cursor, GitHub Copilot Business, and Claude Team. He personally approves all software expenses.

**Key quotes:**
> "I approve the invoices but I honestly don't know who's using what. Two of my guys have both Cursor and Copilot and I'm not sure why."

> "We upgraded to Copilot Business because someone said the policy controls were important. I still haven't set any policies. That was 8 months ago."

> "If it found real savings I'd use it. But I'd want to know where the prices are coming from. I've seen tools quote outdated pricing and it makes you lose trust in everything else."

**Surprises:** The "policy controls" upgrade rationale being unused for 8 months was striking — exactly the scenario the audit engine's Copilot Business → Individual rule targets. RM also mentioned he'd want to "see the sources" for pricing, which directly influenced adding the PRICING_DATA.md link in the UI.

**Design changes from this interview:**
- Added the verified date and "pricing sourced from official pages" trust signal below the submit button
- The per-tool recommendation now includes the vendor plan price inline (e.g., "$19 Copilot Business → $10 Individual") rather than just the savings number

---

## Interview 2 — T.K., Solo Technical Founder, AI writing tool (Kenya)

**Background:** TK is building a solo SaaS product. Runs Claude Pro, ChatGPT Plus, and Windsurf Pro. Monthly AI spend: ~$75/month. Very cost-conscious.

**Key quotes:**
> "I have a spreadsheet. But I only update it when I get the credit card statement. So it's always one month behind."

> "I know I'm probably not using Windsurf enough to justify it but I keep it 'just in case.' It's only $15 so I never think about it hard enough."

> "The thing that would actually make me act is if it showed me the annual number. $15/month sounds fine. $180/year I might actually cancel."

**Surprises:** The "it's only $X/month, not worth thinking about" pattern. Multiple small subscriptions aggregate into real money but individual ones feel too small to evaluate. This insight drove the decision to always show **annual savings** prominently alongside monthly.

**Design changes from this interview:**
- AuditResults now shows annual savings in every recommendation card, not just the hero
- Added a per-tool "annualize" nudge: "$15/mo = $180/year" framing in the low-spend recommendations

---

## Interview 3 — A.P., CTO, 12-person product studio (UK)

**Background:** AP manages AI spend for 3 different client projects simultaneously. Each project has its own AI budget. Uses Cursor, Claude API, OpenAI API, and GitHub Copilot Business.

**Key quotes:**
> "The API spend is the hard one. Some months it's $80, some months it's $400. I need something that helps me understand if a spike is a bug or just growth."

> "I'd share the results with my clients but only if the report looked professional. Right now I just copy-paste numbers into a spreadsheet."

> "The Credex credits angle is interesting. I had no idea you could negotiate these prices. I assumed they were fixed."

**Surprises:** The "API spend volatility" problem is real and not addressed by v1 of the audit. TK mentioned it as the hardest part of managing AI costs. This is a strong Week 2 feature: "flag anomalous API spend spikes."

The "I didn't know prices were negotiable" insight validated the Credex credits recommendation as a genuinely novel value add — not just a CTA.

**Design changes from this interview:**
- Made the Credex credits recommendation card visually distinctive (brand-colored border, Credex badge) to signal it's a unique opportunity
- Added copy clarifying the credits are Credex-negotiated, not a publicly available discount: "estimated 20-30% discount — actual rate depends on your vendor agreement"
