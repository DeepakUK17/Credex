import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — audit storage will be disabled');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuditToolInput = {
  toolId: string;
  planId: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: 'coding' | 'writing' | 'research' | 'data' | 'mixed';
  tools: AuditToolInput[];
};

export type AuditRecord = {
  id: string;
  created_at: string;
  team_size: number;
  use_case: string;
  tools: AuditToolInput[];
  results: unknown;
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string | null;
  is_high_savings: boolean;
};

export type LeadInput = {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  honeypot?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function saveAudit(data: {
  teamSize: number;
  useCase: string;
  tools: AuditToolInput[];
  results: unknown;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string | null;
  isHighSavings: boolean;
}): Promise<string | null> {
  if (!supabase) return null;

  const { data: row, error } = await supabase
    .from('audits')
    .insert({
      team_size: data.teamSize,
      use_case: data.useCase,
      tools: data.tools,
      results: data.results,
      total_monthly_savings: data.totalMonthlySavings,
      total_annual_savings: data.totalAnnualSavings,
      ai_summary: data.aiSummary,
      is_high_savings: data.isHighSavings,
    })
    .select('id')
    .single();

  if (error) {
    console.error('saveAudit error:', error.message);
    return null;
  }

  return row?.id ?? null;
}

export async function getAudit(id: string): Promise<AuditRecord | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getAudit error:', error.message);
    return null;
  }

  return data as AuditRecord;
}

export async function saveLead(lead: LeadInput): Promise<boolean> {
  if (!supabase) return false;
  if (lead.honeypot) return false; // bot detected

  const { error } = await supabase.from('leads').insert({
    audit_id: lead.auditId,
    email: lead.email,
    company_name: lead.companyName,
    role: lead.role,
    team_size: lead.teamSize,
  });

  if (error) {
    console.error('saveLead error:', error.message);
    return false;
  }

  return true;
}
