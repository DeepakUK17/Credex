/**
 * api/leads.ts — Serverless function: save lead and send transactional email via Resend.
 *
 * Honeypot check happens here too as a server-side safety net.
 * See ARCHITECTURE.md for abuse protection rationale.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'audit@credex.com'; // Must be verified in Resend
const REPLY_TO = 'hello@credex.com';

type LeadPayload = {
  auditId: string | null;
  email: string;
  companyName?: string;
  role?: string;
  isHighSavings: boolean;
  totalMonthlySavings: number;
  honeypot?: string;
};

async function sendEmail(to: string, isHighSavings: boolean, savings: number, auditId: string | null) {
  if (!RESEND_API_KEY) return;

  const auditUrl = auditId ? `https://ai-spend-audit.vercel.app/audit/${auditId}` : null;

  const subject = isHighSavings
    ? `Your AI Spend Audit: $${savings.toFixed(0)}/mo in savings identified`
    : 'Your AI Spend Audit Results';

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Inter, system-ui, sans-serif; background: #0f172a; color: #cbd5e1; max-width: 600px; margin: 0 auto; padding: 32px 24px;">
  <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
    <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
      <span style="color: white; font-size: 20px;">⚡</span>
    </div>
    <h1 style="color: #f1f5f9; font-size: 24px; margin: 0 0 12px; font-weight: 700;">Your AI Spend Audit is Ready</h1>
    ${isHighSavings
      ? `<p style="color: #4ade80; font-size: 28px; font-weight: 800; margin: 8px 0;">$${savings.toFixed(0)}/month in savings found</p>
         <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">That's <strong style="color: #f1f5f9;">$${(savings * 12).toFixed(0)}/year</strong> you could be reinvesting in your team.</p>`
      : `<p style="color: #60a5fa; font-size: 18px; font-weight: 600; margin: 8px 0;">✓ Your AI stack looks well-optimized</p>
         <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">We didn't find any obvious overspend — your team is spending well on AI tools.</p>`
    }
  </div>
  ${auditUrl ? `
  <div style="text-align: center; margin: 24px 0;">
    <a href="${auditUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">View Full Audit Report →</a>
  </div>` : ''}
  ${isHighSavings ? `
  <div style="background: #1e293b; border: 1px solid #4f46e5; border-radius: 12px; padding: 20px; margin-top: 16px;">
    <p style="color: #818cf8; font-weight: 600; margin: 0 0 8px; font-size: 14px;">💡 Next step: Book a Credex consultation</p>
    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 16px;">At this savings level, a Credex advisor can negotiate vendor credits and bulk licensing — typically unlocking an additional 20-30% discount beyond what we identified.</p>
    <a href="https://credex.com" style="display: inline-block; background: #312e81; color: #a5b4fc; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid #4f46e5;">Book Free Consultation →</a>
  </div>` : ''}
  <p style="color: #475569; font-size: 12px; text-align: center; margin-top: 32px;">
    You received this because you ran an AI Spend Audit at Credex.<br>
    <a href="#" style="color: #475569;">Unsubscribe</a> · <a href="https://credex.com/privacy" style="color: #475569;">Privacy Policy</a>
  </p>
</body>
</html>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html, reply_to: REPLY_TO }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as LeadPayload;

  // Server-side honeypot check
  if (body.honeypot) {
    return res.status(200).json({ ok: true }); // Silently accept to confuse bots
  }

  if (!body.email || !body.email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    await sendEmail(body.email, body.isHighSavings, body.totalMonthlySavings, body.auditId ?? null);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Lead email error:', err);
    return res.status(200).json({ ok: true }); // Don't expose errors to client
  }
}
