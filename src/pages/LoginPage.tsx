import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { useAuth } from '../context/AuthContext';
import { useCatCompanion } from '../context/CatCompanionContext';
import { resolvePostAuthRoute, validateEmail } from '../utils/authRouting';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, user, profile, profileError, loading: authLoading } = useAuth();
  const { setCatReaction } = useCatCompanion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && profile) {
      navigate(resolvePostAuthRoute(profile), { replace: true });
    }
  }, [authLoading, user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setFormError(emailErr);
      return;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    try {
      const { error, profile: loadedProfile } = await signIn(email, password);
      if (error) {
        setFormError(error);
        return;
      }
      if (loadedProfile) {
        setCatReaction('celebrating', 'Welcome back!');
        navigate(resolvePostAuthRoute(loadedProfile), { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = formError || profileError;

  return (
    <AuthSplitLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Enter your school email and password to continue.
          </p>
        </div>

        {displayError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setCatReaction('watching-email')}
                onBlur={() => setCatReaction('idle')}
                placeholder="you@yourschool.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setCatReaction('watching-password')}
                onBlur={() => setCatReaction('idle')}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:bg-slate-400 text-white text-sm font-semibold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            New student in Grades 6–10?{' '}
            <Link
              to="/register"
              className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
            >
              Create student account
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
