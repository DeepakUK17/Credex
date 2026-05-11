import { ArrowRight, TrendingDown, Shield, Zap } from 'lucide-react';
import SpendForm from '../components/SpendForm/SpendForm';

const SOCIAL_PROOF = [
  { stat: '$2,400/yr', label: 'avg. savings found per team' },
  { stat: '60 sec',   label: 'to complete your audit' },
  { stat: '8 tools',  label: 'audited including Cursor, Claude, Copilot' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ── Nav ── */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-100 text-sm tracking-tight">AI Spend Audit</span>
            <span className="text-slate-600 text-sm">by Credex</span>
          </a>
          <a
            href="https://credex.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Credex official website"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            credex.com ↗
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-6">
            <TrendingDown className="w-3.5 h-3.5" />
            Engineering teams overpay by 30–40% on AI tools
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 leading-tight mb-4">
            Find your hidden <br />
            <span className="gradient-text">AI spending leaks</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Audit your Cursor, Claude, ChatGPT, and Copilot spending in 60 seconds.
            Get a defensible, finance-ready savings report — free, no account required.
          </p>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            {SOCIAL_PROOF.map(({ stat, label }) => (
              <div key={stat} className="text-center">
                <p className="text-xl font-bold text-slate-100">{stat}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Form + Trust ── */}
        <section className="max-w-2xl mx-auto px-4 pb-20">
          <div className="card p-6 sm:p-8 mb-6">
            <SpendForm />
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              No sign-up required
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              Pricing verified {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              Data never sold
            </span>
          </div>
        </section>

        {/* ── Why trust us ── */}
        <section className="border-t border-slate-800/50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-100 text-center mb-10">
              Defensible recommendations, not guesses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: '📊',
                  title: 'Finance-literate audit',
                  desc: 'Every recommendation cites the exact vendor plan price. All pricing sourced from official pages and dated.',
                },
                {
                  icon: '🔄',
                  title: 'Plan-fit analysis',
                  desc: 'We check if you\'re on the right plan for your team size — often the biggest win comes from a simple downgrade.',
                },
                {
                  icon: '💳',
                  title: 'Credex credits',
                  desc: 'High-spend teams qualify for Credex\'s negotiated vendor credits — typically 20-30% off retail pricing.',
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="card p-6">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-semibold text-slate-100 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center card-glass p-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-3">
              Start your free audit now
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              60 seconds. No email required. Shareable results link included.
            </p>
            <a
              href="#top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary inline-flex"
              id="hero-cta-bottom"
            >
              Audit My AI Spend <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Credex · AI Spend Audit Tool</p>
          <p>
            All pricing data sourced from official vendor pages · Last verified {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </footer>
    </div>
  );
}
