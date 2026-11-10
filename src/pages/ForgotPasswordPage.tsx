import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/authRouting';

export function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setSubmitting(true);
    try {
      const { error: resetErr } = await resetPasswordForEmail(email);
      if (resetErr) {
        setError(resetErr);
        return;
      }
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      welcomeTitle="Reset your password"
      welcomeDescription="We will send a secure password reset link to your registered school email address."
    >
      <div className="w-full max-w-md mx-auto">
        {sent ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reset email sent
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              If an account exists for <span className="font-semibold text-slate-900">{email}</span>, you
              will receive a password reset link shortly.
            </p>
            <div className="mt-7">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back to sign in</span>
              </Link>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Forgot password?
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                Enter your email address and we will send you a reset link.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourschool.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send reset email</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthSplitLayout>
  );
}
