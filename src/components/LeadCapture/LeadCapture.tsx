import { useState } from 'react';
import { X, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { saveLead } from '../../lib/supabase';
import { cn, formatUSD } from '../../lib/utils';

// ─── Schema ───────────────────────────────────────────────────────────────────

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
  website: z.string().max(0, 'Bot detected'), // honeypot
});

type LeadFormValues = z.infer<typeof leadSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

type LeadCaptureProps = {
  auditId: string | null;
  isHighSavings: boolean;
  totalMonthlySavings: number;
  onSuccess: () => void;
  onClose: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadCapture({
  auditId,
  isHighSavings,
  totalMonthlySavings,
  onSuccess,
  onClose,
}: LeadCaptureProps) {
  const [form, setForm] = useState<LeadFormValues>({
    email: '',
    companyName: '',
    role: '',
    teamSize: '',
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field: keyof LeadFormValues, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (parsed.data.website) return; // honeypot — silently reject

    setIsSubmitting(true);
    try {
      const saved = await saveLead({
        auditId: auditId ?? 'preview',
        email: parsed.data.email,
        companyName: parsed.data.companyName,
        role: parsed.data.role,
        teamSize: parsed.data.teamSize ? parseInt(parsed.data.teamSize) : undefined,
        honeypot: parsed.data.website,
      });

      // Also call the API route for Resend email
      if (saved !== false) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auditId,
            email: parsed.data.email,
            companyName: parsed.data.companyName,
            role: parsed.data.role,
            isHighSavings,
            totalMonthlySavings,
          }),
        }).catch(() => {}); // Non-fatal
      }

      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch {
      setErrors({ email: 'Something went wrong. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-capture-title"
    >
      <div className="w-full max-w-md card p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 id="lead-capture-title" className="text-lg font-bold text-slate-100">
              {isHighSavings
                ? `Unlock ${formatUSD(totalMonthlySavings)}/mo in savings`
                : 'Get your full audit report'}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {isHighSavings
                ? "We'll send your personalized audit + connect you with a Credex advisor."
                : "We'll email you the full breakdown and notify you of new savings opportunities."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-100 font-semibold">Check your inbox!</p>
            <p className="text-slate-400 text-sm mt-1">Your audit report is on its way.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot — hidden from real users */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={e => update('website', e.target.value)}
              />
            </div>

            {/* Email — required */}
            <div>
              <label className="label" htmlFor="lead-email">Work Email *</label>
              <input
                id="lead-email"
                type="email"
                autoComplete="email"
                className={cn('input', errors.email && 'border-red-500 focus:ring-red-500/50')}
                placeholder="you@company.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Company name — optional */}
            <div>
              <label className="label" htmlFor="lead-company">Company Name <span className="text-slate-600">(optional)</span></label>
              <input
                id="lead-company"
                type="text"
                className="input"
                placeholder="Acme Inc."
                value={form.companyName}
                onChange={e => update('companyName', e.target.value)}
              />
            </div>

            {/* Role — optional */}
            <div>
              <label className="label" htmlFor="lead-role">Your Role <span className="text-slate-600">(optional)</span></label>
              <input
                id="lead-role"
                type="text"
                className="input"
                placeholder="Engineering Manager, CTO…"
                value={form.role}
                onChange={e => update('role', e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center"
              id="submit-lead-btn"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Send My Report</>
              )}
            </button>

            <p className="text-center text-xs text-slate-600">
              No spam. Unsubscribe any time. Your data is never sold.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
