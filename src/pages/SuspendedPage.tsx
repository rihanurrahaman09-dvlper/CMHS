import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldAlert } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { useAuth } from '../context/AuthContext';
import { SCHOOL_CONFIG } from '../config/school';

export function SuspendedPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AuthSplitLayout
      welcomeTitle="Account access suspended"
      welcomeDescription="Access to this school portal has been restricted by an administrator."
    >
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-6 h-6" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Access suspended
        </h2>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Your account has been suspended and cannot access the learning platform at this time.
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-1.5">
          <p className="font-semibold text-slate-800">How to resolve this</p>
          <p>
            Please contact your school administrator or email{' '}
            <span className="font-medium text-slate-900">{SCHOOL_CONFIG.supportEmail}</span> for
            more information about your account status.
          </p>
        </div>

        <div className="mt-7">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
