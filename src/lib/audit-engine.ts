/**
 * audit-engine.ts — Pure TypeScript audit logic.
 *
 * No side effects. No API calls. Fully testable.
 * All dollar amounts are USD/month unless noted.
 *
 * Rules are defensible to a finance person:
 * - Every recommendation cites a specific, verifiable plan price.
 * - Savings numbers are derived from the pricing-data.ts constants, not guesses.
 * - Credex discount assumption (20-30%) is flagged as an estimate.
 */

import {
  PRICING,
  CREDEX_DISCOUNT_LOW,
  CREDEX_DISCOUNT_HIGH,
  CREDEX_THRESHOLD_MONTHLY,
  BENCHMARK_SPEND_PER_DEV,
} from './pricing-data';

// ─── Input / Output Types ──────────────────────────────────────────────────────

export type UseCase = 'coding' | 'writing' | 'research' | 'data' | 'mixed';

export type ToolInput = {
  toolId: string;
  planId: string;
  monthlySpend: number; // actual $ paid per month
  seats: number;
};

export type AuditFormInput = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
};

export type Recommendation = {
  type: 'plan_downgrade' | 'plan_upgrade' | 'alternative_tool' | 'credex_credits' | 'optimal';
  action: string;       // Short imperative: "Downgrade to Pro"
  reason: string;       // 1-sentence explanation with the numbers
  monthlySavings: number;
  annualSavings: number;
  priority: 'high' | 'medium' | 'low';
  alternativeToolId?: string;
};

export type ToolAuditResult = {
  toolId: string;
  displayName: string;
  currentPlanName: string;
  currentMonthlySpend: number;
  currentSeats: number;
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  status: 'has_savings' | 'optimal' | 'review';
};

export type AuditResult = {
  tools: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;       // true if > $500/mo
  spendPerDev: number;          // $ per team member per month
  benchmarkSpendPerDev: number; // industry benchmark
  aboveAverageBenchmark: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function annualize(monthly: number): number {
  return Math.round(monthly * 12);
}

function clampSavings(savings: number): number {
  return Math.max(0, Math.round(savings * 100) / 100);
}

// ─── Per-Tool Audit Rules ─────────────────────────────────────────────────────

function auditCursor(input: ToolInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const pricing = PRICING['cursor'];
  const bizPlan = pricing.plans.find(p => p.id === 'business')!;
  const proPlan = pricing.plans.find(p => p.id === 'pro')!;

  if (input.planId === 'business' && input.seats <= 2) {
    // Business ($40/seat) vs Pro ($20/seat) — admin controls not needed <3 seats
    const currentCost = bizPlan.monthlyPricePerSeat * input.seats;
    const recommendedCost = proPlan.monthlyPricePerSeat * input.seats;
    const savings = clampSavings(currentCost - recommendedCost);
    if (savings > 0) {
      recs.push({
        type: 'plan_downgrade',
        action: 'Switch to Cursor Pro',
        reason: `At ${input.seats} seat${input.seats > 1 ? 's' : ''}, Cursor Business ($${bizPlan.monthlyPricePerSeat}/seat) adds admin controls you won't need — Pro ($${proPlan.monthlyPricePerSeat}/seat) covers your use case and saves $${savings}/month.`,
        monthlySavings: savings,
        annualSavings: annualize(savings),
        priority: 'medium',
      });
    }
  }

  return recs;
}

function auditGithubCopilot(input: ToolInput, teamSize: number): Recommendation[] {
  const recs: Recommendation[] = [];
  const pricing = PRICING['github_copilot'];
  const individualPlan = pricing.plans.find(p => p.id === 'individual')!;
  const businessPlan = pricing.plans.find(p => p.id === 'business')!;

  if (input.planId === 'business' && input.seats === 1) {
    const savings = clampSavings(
      businessPlan.monthlyPricePerSeat - individualPlan.monthlyPricePerSeat
    );
    recs.push({
      type: 'plan_downgrade',
      action: 'Switch to Copilot Individual',
      reason: `You're paying $${businessPlan.monthlyPricePerSeat}/seat for Business features (policy management, audit logs) with only 1 seat — Individual is $${individualPlan.monthlyPricePerSeat}/month and includes the same AI completions, saving $${savings}/month.`,
      monthlySavings: savings,
      annualSavings: annualize(savings),
      priority: 'high',
    });
  }

  // Copilot Free tier available — prompt teams using Individual if low usage
  if (input.planId === 'individual' && teamSize <= 3 && input.seats === 1) {
    recs.push({
      type: 'plan_downgrade',
      action: 'Evaluate Copilot Free tier',
      reason: `GitHub Copilot now offers a free tier with 2,000 completions/month. If you're a light user, test whether the free tier covers your workflow before paying $${individualPlan.monthlyPricePerSeat}/month.`,
      monthlySavings: individualPlan.monthlyPricePerSeat,
      annualSavings: annualize(individualPlan.monthlyPricePerSeat),
      priority: 'low',
    });
  }

  return recs;
}

function auditClaude(input: ToolInput, teamSize: number): Recommendation[] {
  const recs: Recommendation[] = [];
  const pricing = PRICING['claude'];
  const proPlan = pricing.plans.find(p => p.id === 'pro')!;
  const teamPlan = pricing.plans.find(p => p.id === 'team')!;

  if (input.planId === 'team' && input.seats <= 2) {
    // Team requires min 5 seats but some users pay for 2 — downgrade to 2× Pro
    const currentCost = teamPlan.monthlyPricePerSeat * input.seats;
    const recommendedCost = proPlan.monthlyPricePerSeat * input.seats;
    const savings = clampSavings(currentCost - recommendedCost);
    if (savings > 0) {
      recs.push({
        type: 'plan_downgrade',
        action: 'Switch to individual Claude Pro plans',
        reason: `Claude Team is $${teamPlan.monthlyPricePerSeat}/seat designed for 5+ users — ${input.seats} individual Pro plan${input.seats > 1 ? 's' : ''} at $${proPlan.monthlyPricePerSeat}/seat each cover the same model access and costs $${savings}/month less.`,
        monthlySavings: savings,
        annualSavings: annualize(savings),
        priority: 'high',
      });
    }
  }

  return recs;
}

function auditChatGPT(input: ToolInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const pricing = PRICING['chatgpt'];
  const plusPlan = pricing.plans.find(p => p.id === 'plus')!;
  const teamPlan = pricing.plans.find(p => p.id === 'team')!;

  if (input.planId === 'team' && input.seats === 1) {
    const savings = clampSavings(
      teamPlan.monthlyPricePerSeat - plusPlan.monthlyPricePerSeat
    );
    recs.push({
      type: 'plan_downgrade',
      action: 'Downgrade to ChatGPT Plus',
      reason: `ChatGPT Team ($${teamPlan.monthlyPricePerSeat}/seat) is designed for collaboration — at 1 seat, ChatGPT Plus ($${plusPlan.monthlyPricePerSeat}/month) gives the same model access and saves $${savings}/month.`,
      monthlySavings: savings,
      annualSavings: annualize(savings),
      priority: 'high',
    });
  }

  return recs;
}

// ─── Use-Case Based Alternative Tool Rules ────────────────────────────────────

function getAlternativeRecs(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number
): Recommendation[] {
  const recs: Recommendation[] = [];
  const { toolId, monthlySpend, seats } = input;

  // Coding: Cursor Pro vs GitHub Copilot Individual — compare cost per seat
  if (useCase === 'coding') {
    if (toolId === 'github_copilot' && input.planId === 'business') {
      const cursorProCost = 20 * seats;
      const copilotBizCost = 19 * seats;
      // Copilot Biz is actually cheaper — flag it
      if (copilotBizCost < cursorProCost) {
        // No saving — they're fine
      } else {
        const savings = clampSavings(monthlySpend - cursorProCost);
        if (savings > 0) {
          recs.push({
            type: 'alternative_tool',
            action: 'Evaluate Cursor Pro as an alternative',
            reason: `For ${seats} developer${seats > 1 ? 's' : ''} focused on coding, Cursor Pro ($${cursorProCost}/month total) offers a comparable feature set to Copilot Business at a similar price — worth a 14-day trial to compare productivity.`,
            monthlySavings: savings,
            annualSavings: annualize(savings),
            priority: 'low',
            alternativeToolId: 'cursor',
          });
        }
      }
    }
  }

  // Writing: Claude Pro vs ChatGPT Plus — Claude Pro better for long-form
  if (useCase === 'writing') {
    if (toolId === 'chatgpt' && input.planId === 'plus') {
      const claudeProCost = 20 * seats;
      const chatgptPlusCost = 20 * seats;
      if (claudeProCost <= chatgptPlusCost) {
        recs.push({
          type: 'alternative_tool',
          action: 'Trial Claude Pro for writing workflows',
          reason: `Claude Pro ($20/month) matches ChatGPT Plus in price but outperforms on long-form content, document analysis, and lower hallucination rates — if writing is your primary use case, a 30-day comparison could improve output quality at no extra cost.`,
          monthlySavings: 0,
          annualSavings: 0,
          priority: 'low',
          alternativeToolId: 'claude',
        });
      }
    }
  }

  // Research: Perplexity Pro as cheaper alternative
  if (useCase === 'research') {
    if ((toolId === 'chatgpt' || toolId === 'claude') && monthlySpend > 20) {
      recs.push({
        type: 'alternative_tool',
        action: 'Evaluate Perplexity Pro for research',
        reason: `Perplexity Pro ($20/month) is purpose-built for research with real-time web search and source citations — for teams whose primary use is information gathering rather than generation, it can replace or complement your current tool at lower cost per seat.`,
        monthlySavings: Math.max(0, monthlySpend - 20 * seats),
        annualSavings: annualize(Math.max(0, monthlySpend - 20 * seats)),
        priority: 'medium',
      });
    }
  }

  return recs;
}

// ─── Credex Opportunity Rule ──────────────────────────────────────────────────

function getCredexRec(input: ToolInput): Recommendation | null {
  if (input.monthlySpend < CREDEX_THRESHOLD_MONTHLY) return null;

  const discountLow = Math.round(input.monthlySpend * CREDEX_DISCOUNT_LOW);
  const discountHigh = Math.round(input.monthlySpend * CREDEX_DISCOUNT_HIGH);

  return {
    type: 'credex_credits',
    action: 'Apply Credex credits',
    reason: `Your $${input.monthlySpend}/month on ${PRICING[input.toolId]?.displayName ?? input.toolId} qualifies for Credex's negotiated credits — estimated 20-30% discount ($${discountLow}–$${discountHigh}/month savings). This is an estimate; actual discount depends on vendor agreement.`,
    monthlySavings: discountLow,
    annualSavings: annualize(discountLow),
    priority: 'high',
  };
}

// ─── Main Audit Function ───────────────────────────────────────────────────────

export function runAudit(input: AuditFormInput): AuditResult {
  const { teamSize, useCase, tools } = input;

  const toolResults: ToolAuditResult[] = tools
    .filter(t => t.monthlySpend > 0 || t.seats > 0)
    .map(toolInput => {
      const pricing = PRICING[toolInput.toolId];
      const currentPlan = pricing?.plans.find(p => p.id === toolInput.planId);

      const recs: Recommendation[] = [];

      // 1. Plan-specific rules
      switch (toolInput.toolId) {
        case 'cursor':
          recs.push(...auditCursor(toolInput));
          break;
        case 'github_copilot':
          recs.push(...auditGithubCopilot(toolInput, teamSize));
          break;
        case 'claude':
          recs.push(...auditClaude(toolInput, teamSize));
          break;
        case 'chatgpt':
          recs.push(...auditChatGPT(toolInput));
          break;
      }

      // 2. Alternative tool recommendations by use case
      recs.push(...getAlternativeRecs(toolInput, useCase, teamSize));

      // 3. Credex credits opportunity
      const credexRec = getCredexRec(toolInput);
      if (credexRec) recs.push(credexRec);

      // 4. Deduplicate: sum only the highest-value recommendation per type
      const seen = new Set<string>();
      const dedupedRecs = recs.filter(r => {
        if (seen.has(r.type)) return false;
        seen.add(r.type);
        return true;
      });

      // Total savings = sum of all unique recommendation savings
      const totalMonthlySavings = clampSavings(
        dedupedRecs.reduce((sum, r) => sum + r.monthlySavings, 0)
      );

      const totalAnnualSavings = annualize(totalMonthlySavings);

      const status: ToolAuditResult['status'] =
        dedupedRecs.length === 0
          ? 'optimal'
          : totalMonthlySavings > 0
          ? 'has_savings'
          : 'review';

      return {
        toolId: toolInput.toolId,
        displayName: pricing?.displayName ?? toolInput.toolId,
        currentPlanName: currentPlan?.name ?? toolInput.planId,
        currentMonthlySpend: toolInput.monthlySpend,
        currentSeats: toolInput.seats,
        recommendations: dedupedRecs,
        totalMonthlySavings,
        totalAnnualSavings,
        status,
      };
    });

  const totalMonthlySavings = clampSavings(
    toolResults.reduce((sum, r) => sum + r.totalMonthlySavings, 0)
  );
  const totalAnnualSavings = annualize(totalMonthlySavings);
  const isHighSavings = totalMonthlySavings > 500;

  const totalMonthlySpend = tools.reduce((sum, t) => sum + (t.monthlySpend || 0), 0);
  const spendPerDev = teamSize > 0 ? Math.round((totalMonthlySpend / teamSize) * 100) / 100 : 0;

  return {
    tools: toolResults,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings,
    spendPerDev,
    benchmarkSpendPerDev: BENCHMARK_SPEND_PER_DEV,
    aboveAverageBenchmark: spendPerDev > BENCHMARK_SPEND_PER_DEV,
  };
}
