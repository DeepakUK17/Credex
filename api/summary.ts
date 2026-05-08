/**
 * api/summary.ts — Serverless function: generate AI summary via Anthropic Claude.
 *
 * The API key is stored server-side only (ANTHROPIC_API_KEY env var).
 * Falls back gracefully if Anthropic is unavailable.
 *
 * Full prompt rationale: see PROMPTS.md
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

/**
 * PROMPT DESIGN (see PROMPTS.md for full rationale):
 * - Role-priming: act as a CFO-style advisor, not a cheerleader
 * - Structured input prevents hallucination of specific numbers
 * - 80-120 word constraint forces specificity over fluff
 * - Explicit instruction to cite actual tool names and dollar amounts
 */
const buildPrompt = (body: Record<string, unknown>) => `You are a CFO-level AI cost advisor reviewing a startup's AI tool spending.

Team: ${body.teamSize} people, primary use case: ${body.useCase}
Total monthly AI spend (across all tools): derived from tool list below
Identified savings: $${body.totalMonthlySavings}/month ($${body.totalAnnualSavings}/year)
Spend per developer: $${body.spendPerDev}/month (industry benchmark: $85/developer/month)
Above benchmark: ${body.aboveAverageBenchmark}

Tools audited:
${(body.tools as Array<{ name: string; plan: string; monthlySpend: number; seats: number; topRecommendation: string | null; savings: number }>)
  .map(t => `- ${t.name} (${t.plan}, ${t.seats} seat${t.seats !== 1 ? 's' : ''}, $${t.monthlySpend}/mo) → top rec: ${t.topRecommendation ?? 'optimal'}, savings: $${t.savings}/mo`)
  .join('\n')}

Write an 80-120 word personalized audit summary. Rules:
1. Mention 1-2 specific tools and their exact savings amounts
2. Be direct and finance-literate — no vague praise
3. End with ONE concrete next step the team should take this week
4. Do NOT add headers, bullet points, or markdown — plain prose only
5. Do NOT fabricate numbers not provided above`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!client) {
    return res.status(200).json({ summary: null });
  }

  try {
    const body = req.body as Record<string, unknown>;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 200,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    });

    const summary = message.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join(' ')
      .trim();

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Anthropic summary error:', err);
    // Return null summary — client will use template fallback
    return res.status(200).json({ summary: null });
  }
}
