import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogOut, RefreshCw } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { useAuth } from '../context/AuthContext';
import { SCHOOL_CONFIG } from '../config/school';
import { resolvePostAuthRoute } from '../utils/authRouting';

export function PendingApprovalPage() {
  const navigate = useNavigate();
  const { profile, signOut, refreshProfile } = useAuth();
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const updated = await refreshProfile();
      if (updated && updated.account_status !== 'pending') {
        navigate(resolvePostAuthRoute(updated), { replace: true });
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AuthSplitLayout
      welcomeTitle="Account awaiting approval"
      welcomeDescription="Your student registration has been received and is queued for administrator review."
    >
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-5">
          <Clock className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Pending administrator approval
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {profile?.full_name ? (
            <>
              Hello <span className="font-semibold text-slate-900">{profile.full_name}</span>, your
              student account is currently awaiting approval from a school administrator.
            </>
          ) : (
            'Your student account is currently awaiting approval from a school administrator.'
          )}
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-1.5">
          <p className="font-semibold text-slate-800">Need assistance?</p>
          <p>
            Once approved, you will be able to access your Grade {profile?.grade ?? '6–10'} learning
            dashboard. For urgent inquiries, contact{' '}
            <span className="font-medium text-slate-900">{SCHOOL_CONFIG.supportEmail}</span>.
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{checking ? 'Checking status...' : 'Check approval status'}</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
