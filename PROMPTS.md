# AI Spend Audit — PROMPTS.md

> Full LLM prompts used in the product, with rationale and iteration history.

---

## Prompt 1: AI Spend Summary (api/summary.ts)

### Final Prompt

```
You are a CFO-level AI cost advisor reviewing a startup's AI tool spending.

Team: {teamSize} people, primary use case: {useCase}
Total monthly AI spend (across all tools): derived from tool list below
Identified savings: ${totalMonthlySavings}/month (${totalAnnualSavings}/year)
Spend per developer: ${spendPerDev}/month (industry benchmark: $85/developer/month)
Above benchmark: {aboveAverageBenchmark}

Tools audited:
- {tool.name} ({tool.plan}, {tool.seats} seat(s), ${tool.monthlySpend}/mo) → top rec: {topRecommendation}, savings: ${tool.savings}/mo
[... one line per tool ...]

Write an 80-120 word personalized audit summary. Rules:
1. Mention 1-2 specific tools and their exact savings amounts
2. Be direct and finance-literate — no vague praise
3. End with ONE concrete next step the team should take this week
4. Do NOT add headers, bullet points, or markdown — plain prose only
5. Do NOT fabricate numbers not provided above
```

**Model:** `claude-opus-4-5`  
**Max tokens:** `200`

---

### Why This Prompt Works

**Role priming ("CFO-level advisor"):** Anchors tone to finance-literate directness rather than marketing language. Without this, Claude defaults to enthusiastic summaries with phrases like "exciting opportunity to save!" which undermine credibility.

**Structured input prevents hallucination:** Every dollar amount in the summary is derived from variables passed explicitly. Rule 5 explicitly prohibits fabricating numbers — this is the most important rule. In testing without it, Claude occasionally invented precise-sounding percentages.

**80-120 word constraint:** Forces specificity. Longer summaries tend to drift into generic advice. The constraint means every sentence must carry specific information.

**Plain prose rule:** The summary is displayed inline in the results UI. Markdown formatting breaks the reading flow. This was a Day 5 iteration — early versions had Claude outputting headers and bullets that rendered as raw markdown in the app.

**One concrete next step:** Early versions ended vaguely ("consider your options"). The explicit constraint produces actionable endings like "Downgrade your Copilot Business seats to Individual this week — takes 5 minutes in GitHub billing settings."

---

### Iteration History

**v1 (failed):** Simple prompt asking for "a summary of AI spending" — produced marketing copy, no specific numbers.

**v2 (failed):** Added numbers to the prompt but no rule against fabrication — Claude invented a "37% savings" statistic not present in the input.

**v3 (failed):** Removed "CFO" framing — outputs became generic "here are some ways to save on AI" paragraphs.

**v4 (current):** Added all five rules, role priming, and explicit "DO NOT fabricate" constraint. Tested on 20 audit scenarios — all outputs were accurate and direct.

---

### Fallback Template

When the Anthropic API fails, returns null, or the API key is not set, the client falls back to `generateTemplatedSummary()` in `src/lib/anthropic.ts`.

The template uses the same data variables and produces a readable, if less personalized, 60-90 word summary. The UI renders both identically — there is no "sorry, AI failed" message shown to users.

**Rationale:** API failures are production realities. A degraded experience (templated summary) is better than showing an error or empty state. The summary is a nice-to-have feature, not a load-bearing feature.
