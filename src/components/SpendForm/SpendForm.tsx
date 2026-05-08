import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Plus, Trash2, Zap, Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { PRICING, ALL_TOOL_IDS } from '../../lib/pricing-data';
import { runAudit } from '../../lib/audit-engine';
import { saveAudit } from '../../lib/supabase';
import { generateAISummary } from '../../lib/anthropic';
import { cn, loadFromStorage, saveToStorage, LOCAL_STORAGE_KEY } from '../../lib/utils';

// ─── Schema ───────────────────────────────────────────────────────────────────

const toolInputSchema = z.object({
  toolId: z.string().min(1),
  planId: z.string().min(1),
  monthlySpend: z.number().min(0).default(0),
  seats: z.number().min(1).default(1),
});

const formSchema = z.object({
  teamSize: z.number().min(1, 'Team size must be at least 1').default(5),
  useCase: z.enum(['coding', 'writing', 'research', 'data', 'mixed']).default('coding'),
  tools: z.array(toolInputSchema).min(1, 'Add at least one tool'),
});

type FormValues = z.infer<typeof formSchema>;
type ToolEntry = z.infer<typeof toolInputSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────

const USE_CASE_OPTIONS = [
  { value: 'coding',   label: 'Software Development' },
  { value: 'writing',  label: 'Content & Writing' },
  { value: 'research', label: 'Research & Analysis' },
  { value: 'data',     label: 'Data Science / ML' },
  { value: 'mixed',    label: 'Mixed / General' },
];

const DEFAULT_FORM: FormValues = {
  teamSize: 5,
  useCase: 'coding',
  tools: [{ toolId: 'cursor', planId: 'pro', monthlySpend: 20, seats: 1 }],
};

// ─── Tool Row ─────────────────────────────────────────────────────────────────

function ToolRow({
  tool,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  tool: ToolEntry;
  index: number;
  onChange: (index: number, field: keyof ToolEntry, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const pricing = PRICING[tool.toolId];
  const plans = pricing?.plans ?? [];

  return (
    <div className="tool-card group animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Tool selector */}
        <div className="flex-1 min-w-0">
          <label className="label" htmlFor={`tool-${index}-id`}>AI Tool</label>
          <div className="relative">
            <select
              id={`tool-${index}-id`}
              className="select pr-8"
              value={tool.toolId}
              onChange={e => onChange(index, 'toolId', e.target.value)}
            >
              {ALL_TOOL_IDS.map(id => (
                <option key={id} value={id}>{PRICING[id].displayName}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Plan selector */}
        <div className="flex-1 min-w-0">
          <label className="label" htmlFor={`tool-${index}-plan`}>Plan</label>
          <div className="relative">
            <select
              id={`tool-${index}-plan`}
              className="select pr-8"
              value={tool.planId}
              onChange={e => onChange(index, 'planId', e.target.value)}
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.monthlyPricePerSeat > 0 ? `— $${p.monthlyPricePerSeat}/seat` : '— Free'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Remove button */}
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="mt-6 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
            aria-label={`Remove ${pricing?.displayName ?? 'tool'}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Monthly spend */}
        <div>
          <label className="label" htmlFor={`tool-${index}-spend`}>Monthly Spend ($)</label>
          <input
            id={`tool-${index}-spend`}
            type="number"
            min={0}
            step={1}
            className="input"
            placeholder="0"
            value={tool.monthlySpend || ''}
            onChange={e => onChange(index, 'monthlySpend', parseFloat(e.target.value) || 0)}
          />
        </div>

        {/* Seats */}
        <div>
          <label className="label" htmlFor={`tool-${index}-seats`}>Seats / Users</label>
          <input
            id={`tool-${index}-seats`}
            type="number"
            min={1}
            step={1}
            className="input"
            placeholder="1"
            value={tool.seats || ''}
            onChange={e => onChange(index, 'seats', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpendForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormValues>(() =>
    loadFromStorage<FormValues>(LOCAL_STORAGE_KEY, DEFAULT_FORM)
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save on every change
  useEffect(() => {
    saveToStorage(LOCAL_STORAGE_KEY, form);
  }, [form]);

  const updateGlobal = useCallback(<K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTool = useCallback((index: number, field: keyof ToolEntry, value: string | number) => {
    setForm(prev => {
      const tools = [...prev.tools];
      // When toolId changes, reset plan to first available
      if (field === 'toolId') {
        const firstPlan = PRICING[value as string]?.plans[0]?.id ?? '';
        tools[index] = { ...tools[index], toolId: value as string, planId: firstPlan };
      } else {
        tools[index] = { ...tools[index], [field]: value };
      }
      return { ...prev, tools };
    });
  }, []);

  const addTool = useCallback(() => {
    setForm(prev => ({
      ...prev,
      tools: [
        ...prev.tools,
        { toolId: 'github_copilot', planId: 'individual', monthlySpend: 10, seats: 1 },
      ],
    }));
  }, []);

  const removeTool = useCallback((index: number) => {
    setForm(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.issues.map(e => e.message));
      return;
    }

    setIsSubmitting(true);
    try {
      const auditResult = runAudit(parsed.data);

      // Generate AI summary (with fallback)
      const summaryInput = {
        auditResult,
        teamSize: parsed.data.teamSize,
        useCase: parsed.data.useCase,
      };
      const aiSummary = await generateAISummary(summaryInput);

      // Save to Supabase
      const auditId = await saveAudit({
        teamSize: parsed.data.teamSize,
        useCase: parsed.data.useCase,
        tools: parsed.data.tools,
        results: auditResult.tools,
        totalMonthlySavings: auditResult.totalMonthlySavings,
        totalAnnualSavings: auditResult.totalAnnualSavings,
        aiSummary,
        isHighSavings: auditResult.isHighSavings,
      });

      // Navigate to results; pass result via state as fallback when no Supabase
      navigate(auditId ? `/audit/${auditId}` : '/audit/preview', {
        state: { auditResult, aiSummary, formInput: parsed.data },
      });
    } catch (err) {
      console.error(err);
      setErrors(['Something went wrong. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMonthlySpend = form.tools.reduce((s, t) => s + (t.monthlySpend || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Global settings */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-200 mb-4">Team Context</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="team-size">Team Size</label>
            <input
              id="team-size"
              type="number"
              min={1}
              max={10000}
              className="input"
              value={form.teamSize || ''}
              onChange={e => updateGlobal('teamSize', parseInt(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="label" htmlFor="use-case">Primary Use Case</label>
            <div className="relative">
              <select
                id="use-case"
                className="select pr-8"
                value={form.useCase}
                onChange={e => updateGlobal('useCase', e.target.value as FormValues['useCase'])}
              >
                {USE_CASE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tool entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200">
            AI Tools
            <span className="ml-2 text-xs font-normal text-slate-500">
              ({form.tools.length} added · ${totalMonthlySpend.toFixed(0)}/mo total)
            </span>
          </h2>
          <button
            type="button"
            onClick={addTool}
            className={cn(
              'text-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
              'text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 border border-brand-500/30',
              'transition-all duration-150 font-medium'
            )}
            disabled={form.tools.length >= 8}
          >
            <Plus className="w-3.5 h-3.5" />
            Add tool
          </button>
        </div>

        {form.tools.map((tool, i) => (
          <ToolRow
            key={i}
            tool={tool}
            index={i}
            onChange={updateTool}
            onRemove={removeTool}
            canRemove={form.tools.length > 1}
          />
        ))}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            {errors.map((e, i) => (
              <p key={i} className="text-sm text-red-400">{e}</p>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center text-base py-4"
        id="run-audit-btn"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing your stack…
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Run Free Audit
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-600">
        No account required · Results in seconds · Pricing data verified {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
    </form>
  );
}
