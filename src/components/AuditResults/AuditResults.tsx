import { useState } from 'react';
import { Check, Share2, TrendingDown, TrendingUp, Minus, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';
import { cn, formatUSD, copyToClipboard, buildAuditUrl } from '../../lib/utils';
import type { AuditResult, ToolAuditResult, Recommendation } from '../../lib/audit-engine';
import LeadCapture from '../LeadCapture/LeadCapture';

// ─── Props ────────────────────────────────────────────────────────────────────

type AuditResultsProps = {
  result: AuditResult;
  aiSummary: string | null;
  auditId: string | null;
};

// ─── Share Button ─────────────────────────────────────────────────────────────

function ShareButton({ auditId }: { auditId: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = auditId ? buildAuditUrl(auditId) : window.location.href;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="btn-secondary text-sm py-2 px-4"
      id="share-results-btn"
      aria-label="Copy shareable link"
    >
      {copied ? (
        <><Check className="w-4 h-4 text-emerald-400" /> Copied!</>
      ) : (
        <><Share2 className="w-4 h-4" /> Share Results</>
      )}
    </button>
  );
}

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecCard({ rec }: { rec: Recommendation }) {
  const isCredex = rec.type === 'credex_credits';

  return (
    <div className={cn(
      'rounded-xl p-4 border',
      isCredex
        ? 'bg-brand-500/10 border-brand-500/25'
        : 'bg-slate-800/50 border-slate-700/50'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {rec.priority === 'high' && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                <AlertTriangle className="w-3 h-3" /> High priority
              </span>
            )}
            {isCredex && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 rounded-full px-2 py-0.5">
                <Sparkles className="w-3 h-3" /> Credex opportunity
              </span>
            )}
          </div>
          <p className="font-semibold text-slate-100 text-sm">{rec.action}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
        </div>
        {rec.monthlySavings > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-emerald-400 font-bold text-sm">{formatUSD(rec.monthlySavings)}/mo</p>
            <p className="text-slate-500 text-xs">{formatUSD(rec.annualSavings)}/yr</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tool Result Card ─────────────────────────────────────────────────────────

function ToolResultCard({ tool }: { tool: ToolAuditResult }) {
  const [expanded, setExpanded] = useState(tool.status === 'has_savings');

  return (
    <div className={cn(
      'rounded-2xl border transition-all duration-200',
      tool.status === 'has_savings'
        ? 'bg-slate-900 border-slate-700'
        : 'bg-slate-900/50 border-slate-800'
    )}>
      <button
        className="w-full p-5 flex items-center gap-4 text-left"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        id={`tool-result-${tool.toolId}`}
      >
        {/* Status icon */}
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
          tool.status === 'has_savings'
            ? 'bg-emerald-500/15 text-emerald-400'
            : tool.status === 'optimal'
            ? 'bg-blue-500/15 text-blue-400'
            : 'bg-amber-500/15 text-amber-400'
        )}>
          {tool.status === 'has_savings' ? (
            <TrendingDown className="w-4 h-4" />
          ) : tool.status === 'optimal' ? (
            <Check className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-100 text-sm">{tool.displayName}</p>
          <p className="text-xs text-slate-500">
            {tool.currentPlanName} · {tool.currentSeats} seat{tool.currentSeats !== 1 ? 's' : ''} · {formatUSD(tool.currentMonthlySpend)}/mo
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          {tool.totalMonthlySavings > 0 ? (
            <>
              <p className="text-emerald-400 font-bold text-sm">{formatUSD(tool.totalMonthlySavings)} savings/mo</p>
              <p className="text-slate-500 text-xs">{formatUSD(tool.totalAnnualSavings)}/yr</p>
            </>
          ) : (
            <span className={cn(
              'text-xs font-medium px-2.5 py-1 rounded-full',
              tool.status === 'optimal'
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-slate-700 text-slate-400'
            )}>
              {tool.status === 'optimal' ? '✓ Optimal' : 'Review'}
            </span>
          )}
        </div>
      </button>

      {expanded && tool.recommendations.length > 0 && (
        <div className="px-5 pb-5 space-y-3 border-t border-slate-800 pt-4">
          {tool.recommendations.map((rec, i) => (
            <RecCard key={i} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditResults({ result, aiSummary, auditId }: AuditResultsProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const { totalMonthlySavings, totalAnnualSavings, isHighSavings, spendPerDev, benchmarkSpendPerDev, aboveAverageBenchmark } = result;
  const hasAnySavings = totalMonthlySavings > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Hero Savings Card ── */}
      <div className={cn(
        'card-glass p-8 text-center',
        isHighSavings ? 'glow-green' : ''
      )}>
        {hasAnySavings ? (
          <>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Your Total Potential Savings
            </p>
            <p className="savings-hero">{formatUSD(totalMonthlySavings)}</p>
            <p className="text-slate-300 text-lg mt-1 font-medium">per month</p>
            <p className="text-slate-500 text-sm mt-2">
              That's <span className="text-emerald-400 font-semibold">{formatUSD(totalAnnualSavings)}</span> per year
            </p>

            {isHighSavings && (
              <div className="mt-6 p-4 rounded-xl bg-brand-600/20 border border-brand-500/30">
                <p className="text-brand-300 font-semibold text-sm mb-1">
                  🎯 You qualify for a Credex consultation
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  At {formatUSD(totalMonthlySavings)}/mo in identified savings, a Credex advisor can negotiate vendor credits and bulk licensing — typically recovering an additional 20-30%.
                </p>
                <a
                  href="https://credex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-3 text-sm py-2 justify-center w-full"
                  id="credex-cta-high-savings"
                >
                  Book Free Consultation <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-slate-100">You're spending well</p>
            <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
              Your AI stack looks well-optimized. We didn't find any obvious overspend — nice work.
            </p>
            {!leadCaptured && (
              <button
                onClick={() => setShowLeadCapture(true)}
                className="btn-secondary mt-4 text-sm justify-center"
                id="notify-me-btn"
              >
                Notify me when rates change
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Benchmark ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AI Spend Per Team Member</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{formatUSD(spendPerDev, 2)}<span className="text-slate-500 text-sm font-normal">/mo</span></p>
          </div>
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold',
            aboveAverageBenchmark
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          )}>
            {aboveAverageBenchmark ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {aboveAverageBenchmark ? 'Above' : 'Below'} average
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-3">
          Industry benchmark for seed–Series A startups: <span className="text-slate-400">{formatUSD(benchmarkSpendPerDev)}/developer/month</span>
        </p>
      </div>

      {/* ── AI Summary ── */}
      {aiSummary && (
        <div className="card p-5 border-brand-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-wider">AI Analysis</p>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* ── Per-Tool Results ── */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Tool Breakdown
        </h2>
        <div className="space-y-2 animate-stagger">
          {result.tools
            .sort((a, b) => b.totalMonthlySavings - a.totalMonthlySavings)
            .map(tool => (
              <ToolResultCard key={tool.toolId} tool={tool} />
            ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <ShareButton auditId={auditId} />
        {!leadCaptured && hasAnySavings && (
          <button
            onClick={() => setShowLeadCapture(true)}
            className="btn-primary flex-1 justify-center text-sm py-2.5"
            id="get-full-report-btn"
          >
            <Sparkles className="w-4 h-4" />
            Get Full Report by Email
          </button>
        )}
      </div>

      {/* ── Lead Capture Modal ── */}
      {showLeadCapture && (
        <LeadCapture
          auditId={auditId}
          isHighSavings={isHighSavings}
          totalMonthlySavings={totalMonthlySavings}
          onSuccess={() => {
            setShowLeadCapture(false);
            setLeadCaptured(true);
          }}
          onClose={() => setShowLeadCapture(false)}
        />
      )}
    </div>
  );
}
