import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getAudit } from '../lib/supabase';
import AuditResults from '../components/AuditResults/AuditResults';
import type { AuditResult } from '../lib/audit-engine';

type LocationState = {
  auditResult: AuditResult;
  aiSummary: string | null;
  formInput: { teamSize: number; useCase: string };
} | null;

export default function AuditPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const locationState = (location.state ?? null) as LocationState;

  const [auditResult, setAuditResult] = useState<AuditResult | null>(
    locationState?.auditResult ?? null
  );
  const [aiSummary, setAiSummary] = useState<string | null>(
    locationState?.aiSummary ?? null
  );

  const [loading, setLoading] = useState(!locationState?.auditResult);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we navigated here directly (shared URL) without state, fetch from Supabase
    if (!auditResult && id && id !== 'preview') {
      getAudit(id)
        .then(record => {
          if (!record) {
            setError('This audit was not found. It may have expired or the link is incorrect.');
            return;
          }
          // Reconstruct the AuditResult from the stored record
          setAuditResult(record.results as unknown as AuditResult);
          setAiSummary(record.ai_summary);

        })
        .catch(() => setError('Failed to load audit. Please try again.'))
        .finally(() => setLoading(false));
    }
  }, [id, auditResult]);

  // Update page title dynamically for OG purposes
  useEffect(() => {
    if (auditResult) {
      document.title = auditResult.totalMonthlySavings > 0
        ? `I found ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(auditResult.totalMonthlySavings)}/mo in AI savings — check yours | Credex`
        : 'My AI stack is well-optimized — check yours | Credex';
    }
  }, [auditResult]);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link
            to="/"
            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            New audit
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400 text-sm font-medium">Audit Results</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading your audit results…</p>
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <p className="text-slate-100 font-semibold mb-2">Audit not found</p>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <Link to="/" className="btn-primary inline-flex">
              Run a New Audit
            </Link>
          </div>
        ) : auditResult ? (
          <AuditResults
            result={auditResult}
            aiSummary={aiSummary}
            auditId={id && id !== 'preview' ? id : null}
          />
        ) : null}
      </main>
    </div>
  );
}
