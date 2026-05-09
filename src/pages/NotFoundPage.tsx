import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-600/30 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-brand-400" />
        </div>
        <h1 className="text-6xl font-black text-slate-800 mb-3">404</h1>
        <p className="text-xl font-semibold text-slate-100 mb-2">Page not found</p>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          This audit link may have expired or the URL is incorrect.
          Run a new audit — it takes 60 seconds.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <ArrowLeft className="w-4 h-4" />
          Run a New Audit
        </Link>
      </div>
    </div>
  );
}
