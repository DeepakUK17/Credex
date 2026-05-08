# REFLECTION.md — Build Week Reflection

> Answering the 5 required reflection questions. Each answer: 150-400 words.

---

## 1. Hardest Bug This Week

**The audit engine was returning `NaN` for annual savings in a specific edge case: tools with a valid plan but $0 monthly spend.**

The bug manifested on Day 1. I had a test case where a user added a tool to the form but left the monthly spend field blank. The form's `monthlySpend` field was `undefined` (React controlled input returning `undefined` for an empty number input), and the audit engine's `clampSavings()` helper was calling `Math.round(undefined * 100) / 100` — which returns `NaN`. That `NaN` then propagated through the addition in `totalMonthlySavings`, corrupting the entire audit result.

**How I found it:** Test 1 (empty input → zero savings) was passing, but a manual test with a blank spend field showed `NaN` in the hero savings card. I added a `console.log` at every stage of the calculation and traced it to the `clampSavings` function.

**Fix:** Two layers. First, the Zod schema now has `.default(0)` on the `monthlySpend` field, coercing `undefined` to `0` before the data reaches the engine. Second, I added a guard in `clampSavings()`: `return Math.max(0, Math.round((isNaN(savings) ? 0 : savings) * 100) / 100)`. Defense in depth — the schema fix is the real fix, the engine guard is a safety net.

**Lesson:** TypeScript's type system doesn't protect against runtime `undefined`s from user input. Zod schema defaults are the correct fix — not downstream guards — because they enforce the invariant at the boundary between untrusted input and trusted logic.

---

## 2. A Decision I Reversed

**I initially planned to run the audit on the server (POST form → API function → return results). I reversed this to client-side computation.**

**Original reasoning:** Server-side felt "more correct" architecturally. It would hide the pricing rules from users and enable logging every audit input for analysis.

**Why I reversed it:** The audit engine is a pure function of publicly available pricing data. There is nothing to hide — if someone opens `pricing-data.ts` in the bundle, they see prices from official vendor websites. More importantly, server-side computation added a round-trip that users would feel as latency. Running the engine in-browser makes results appear instantly, which dramatically improves the user experience.

The logging argument was weak — I can log the audit result (which I store in Supabase anyway) without logging the computation itself. The right boundary for "what goes to the server" is: secrets (API keys), PII (email), and heavy compute. The audit engine is none of these.

**Side effect:** The client-side decision forced me to build the pure function correctly from the start. No side effects, no I/O, fully testable. The 10 unit tests are trivial to write because of this architectural choice.

---

## 3. If I Had a Second Week

**Three features in priority order:**

**1. Benchmark mode.** The `spendPerDev` calculation already exists in the engine. Week 2 would add a comparison page: "Your team spends $X/developer/month on AI. Teams your size (15-50 people, coding use case) average $Y." This requires aggregating anonymized audit data — with enough audits, this becomes a genuinely valuable benchmark dataset that no one else has. It's also a growth loop: "How do I compare to my peers?" drives social sharing.

**2. Saved audit history.** Currently, audit URLs are ephemeral — if Supabase isn't connected, the result only exists in React state. Week 2 would require a simple email login (magic link via Supabase Auth) to enable "View past audits" and "Compare month-over-month." This is the feature that converts one-time visitors to retained users.

**3. Embeddable widget.** A `<script src="...">` tag that any SaaS company could embed to offer their customers an AI spend audit. Credex could white-label this for accountants, CFO advisors, or startup communities. Zero marginal acquisition cost once the widget is distributed.

---

## 4. AI Tool Usage This Week

**Primary tools:** Claude claude-opus-4-5 (via Cursor) for writing complex TypeScript and component structure. Windsurf for fast UI iteration (autocomplete > generation for components).

**What I trusted AI with:**
- Boilerplate (TypeScript types, React component scaffolding, CSS class composition)
- First drafts of documentation (GTM.md, ECONOMICS.md) — then heavily edited
- Debugging suggestions when I described the `NaN` bug

**What I didn't trust it with:**
- The audit engine's financial math. I wrote every savings calculation by hand and verified against the pricing tables manually. The risk of an AI-generated bug in the savings logic is too high — a wrong number would destroy credibility.
- The pricing data itself. Prices must be verified from official pages, not from AI training data (which can be months stale).

**One time it was wrong and I caught it:** I asked Claude to draft the Supabase schema and it added a `user_id` column with a foreign key to `auth.users`. The assignment and the product design don't use authentication — this would have been a constraint violation on every insert. Caught it in code review before writing a single line of schema.

---

## 5. Self-Rating 1-10 (Honest)

| Dimension | Rating | Honest sentence |
|---|---|---|
| Entrepreneurial thinking | 8/10 | GTM, ECONOMICS, METRICS are specific and math-grounded, but I haven't yet conducted real user interviews — that's a real gap. |
| Engineering skills | 8/10 | The architecture is clean, CI is green, 10 tests pass — but I haven't completed the Lighthouse audit yet, and mobile QA was cursory. |
| Thinking models | 9/10 | ARCHITECTURE.md is the strongest document I've written — five real trade-offs with honest reasoning, not generic "we chose X because it's faster." |
| Programming skills | 8/10 | TypeScript is well-typed, audit engine is pure and testable, components are focused — but I used `unknown` in a few places where I should have defined proper types. |
| Hard work | 9/10 | Built the full MVP including 13 required files in Day 1 — but this compressed timeline is only possible because I had a strong plan. The discipline score depends on whether I can sustain commits over 5+ distinct days. |
