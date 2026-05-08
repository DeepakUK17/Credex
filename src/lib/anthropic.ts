/**
 * anthropic.ts — AI summary generation with graceful fallback.
 *
 * Uses Anthropic Claude via the API key set in the serverless function.
 * Falls back to a deterministic templated summary on any failure.
 *
 * Full prompt rationale documented in PROMPTS.md.
 */

import type { AuditResult, ToolAuditResult } from './audit-engine';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SummaryInput = {
  auditResult: AuditResult;
  teamSize: number;
  useCase: string;
};

// ─── Template fallback ────────────────────────────────────────────────────────

export function generateTemplatedSummary(input: SummaryInput): string {
  const { auditResult, teamSize, useCase } = input;
  const { totalMonthlySavings, totalAnnualSavings, tools } = auditResult;

  const toolsWithSavings = tools.filter(t => t.totalMonthlySavings > 0);
  const optimalTools = tools.filter(t => t.status === 'optimal');

  if (totalMonthlySavings === 0 && optimalTools.length === tools.length) {
    return `Your ${teamSize}-person team's AI stack looks well-optimized for ${useCase} workflows. ` +
      `You're on the right plans for your scale with no immediate overspend detected. ` +
      `As your team grows, revisit your Cursor and Claude tier — the business/team plans unlock value at 5+ seats. ` +
      `Consider using Credex credits to negotiate bulk discounts when your monthly AI spend crosses $500.`;
  }

  const topTool = toolsWithSavings.sort((a, b) => b.totalMonthlySavings - a.totalMonthlySavings)[0];
  const topToolName = topTool?.displayName ?? 'your AI tools';

  return `Your ${teamSize}-person team is spending $${auditResult.tools.reduce((s, t) => s + t.currentMonthlySpend, 0).toFixed(0)}/month on AI tools with $${totalMonthlySavings.toFixed(0)} in recoverable savings. ` +
    `The biggest opportunity is ${topToolName} — ${topTool?.recommendations[0]?.reason ?? 'plan optimization is available'}. ` +
    `Acting on these recommendations saves $${totalAnnualSavings.toFixed(0)} annually, which compounds significantly as you hire. ` +
    `${auditResult.isHighSavings ? 'At this savings level, a Credex consultation could unlock additional vendor negotiation leverage.' : 'Sign up for our newsletter to get notified when new optimization opportunities emerge for your stack.'}`;
}

// ─── API call (via serverless function to keep key server-side) ───────────────

export async function generateAISummary(input: SummaryInput): Promise<string> {
  try {
    const response = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teamSize: input.teamSize,
        useCase: input.useCase,
        totalMonthlySavings: input.auditResult.totalMonthlySavings,
        totalAnnualSavings: input.auditResult.totalAnnualSavings,
        spendPerDev: input.auditResult.spendPerDev,
        aboveAverageBenchmark: input.auditResult.aboveAverageBenchmark,
        tools: input.auditResult.tools.map((t: ToolAuditResult) => ({
          name: t.displayName,
          plan: t.currentPlanName,
          monthlySpend: t.currentMonthlySpend,
          seats: t.currentSeats,
          topRecommendation: t.recommendations[0]?.action ?? null,
          savings: t.totalMonthlySavings,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const { summary } = await response.json() as { summary: string };
    return summary || generateTemplatedSummary(input);
  } catch (err) {
    console.warn('AI summary failed, using template fallback:', err);
    return generateTemplatedSummary(input);
  }
}
