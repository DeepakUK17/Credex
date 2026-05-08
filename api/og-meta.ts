/**
 * api/og-meta.ts — Serverless function: serve OG meta tags for social crawlers.
 *
 * Social crawlers (Twitter, LinkedIn, Slack) don't execute JS, so a pure React SPA
 * cannot serve dynamic OG tags. This function returns a minimal HTML shell with
 * correct meta tags + an instant JS redirect to the full SPA route.
 *
 * See ARCHITECTURE.md for the full trade-off discussion.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  let title = 'AI Spend Audit — Find Your Hidden AI Savings | Credex';
  let description = 'Engineering teams overpay for AI tools by 30-40%. Audit your stack in 60 seconds — free.';

  if (id && typeof id === 'string' && supabase) {
    try {
      const { data } = await supabase
        .from('audits')
        .select('total_monthly_savings, total_annual_savings')
        .eq('id', id)
        .single();

      if (data?.total_monthly_savings > 0) {
        const monthly = Math.round(data.total_monthly_savings);
        title = `I found $${monthly}/mo in AI savings — check yours free | Credex`;
        description = `See exactly where your team is overpaying on Cursor, Claude, ChatGPT, and Copilot. Free audit in 60 seconds.`;
      }
    } catch {
      // Use defaults
    }
  }

  const appUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://ai-spend-audit.vercel.app';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${appUrl}/og-default.png" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${appUrl}/audit/${id}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${appUrl}/og-default.png" />
  <meta http-equiv="refresh" content="0;url=/audit/${id}" />
  <script>window.location.replace('/audit/${id}');</script>
</head>
<body>
  <p>Redirecting to audit results…</p>
  <p><a href="/audit/${id}">Click here if you are not redirected automatically</a></p>
</body>
</html>`);
}
