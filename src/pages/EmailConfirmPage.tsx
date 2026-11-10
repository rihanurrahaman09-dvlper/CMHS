import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { supabase } from '../lib/supabase';
import { sanitizeAuthError } from '../utils/authRouting';

type VerifyState = 'verifying' | 'success' | 'error';

export function EmailConfirmPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>('verifying');
  const [message, setMessage] = useState<string>('Verifying your email address...');

  useEffect(() => {
    const verify = async () => {
      if (!supabase) {
        setState('error');
        setMessage('Supabase is not configured. Unable to verify email.');
        return;
      }

      const errorDescription = searchParams.get('error_description');
      if (errorDescription) {
        setState('error');
        setMessage(sanitizeAuthError(errorDescription));
        return;
      }

      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type') as 'signup' | 'email' | 'recovery' | null;

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });

        if (error) {
          setState('error');
          setMessage(sanitizeAuthError(error));
          return;
        }

        setState('success');
        setMessage('Your email address has been verified successfully.');
        return;
      }

      // Check if Supabase already exchanged the session via URL hash
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setState('success');
        setMessage('Your email address has been verified successfully.');
        return;
      }

      setState('error');
      setMessage('This confirmation link is invalid or has expired. Please request a new one.');
    };

    verify();
  }, [searchParams]);

  return (
    <AuthSplitLayout
      welcomeTitle="Email Verification"
      welcomeDescription="Confirming your school email address keeps your account secure."
    >
      <div className="w-full max-w-md mx-auto text-center">
        {state === 'verifying' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verifying email
            </h2>
            <p className="mt-3 text-sm text-slate-600">{message}</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Email verified
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{message}</p>
            <div className="mt-7">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Continue to sign in
              </Link>
            </div>
          </>
        )}

        {state === 'error' && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verification failed
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{message}</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
              >
                Return to sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
              >
                Register again
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthSplitLayout>
  );
}
