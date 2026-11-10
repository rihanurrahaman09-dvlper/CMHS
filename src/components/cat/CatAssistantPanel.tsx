import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, KeyRound, Mail, UserPlus, X } from 'lucide-react';
import { SCHOOL_CONFIG } from '../../config/school';

interface CatAssistantPanelProps {
  onClose: () => void;
}

type HelpTopic = 'general' | 'login' | 'register' | 'support' | null;

export function CatAssistantPanel({ onClose }: CatAssistantPanelProps) {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<HelpTopic>(null);

  return (
    <div
      role="dialog"
      aria-label="School Companion Help"
      className="animate-bubble-pop mb-3 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/15 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-[#ECFDF5] px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Campus Companion</h3>
          <p className="text-xs text-emerald-800">Here to help you navigate</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant panel"
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-emerald-100/70 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-slate-600 leading-relaxed">
          Hi there! Choose a quick topic below for instant help with {SCHOOL_CONFIG.name}.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTopic('general')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-colors ${
              activeTopic === 'general'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Help</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('login')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-colors ${
              activeTopic === 'login'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Login Help</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('register')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-colors ${
              activeTopic === 'register'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Registration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('support')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left text-xs font-medium transition-colors ${
              activeTopic === 'support'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>Support</span>
          </button>
        </div>

        {activeTopic && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-700 leading-relaxed space-y-2">
            {activeTopic === 'general' && (
              <p>
                Students in Grades 6–10 can register for an account. Teachers and administrators
                sign in with school-issued credentials.
              </p>
            )}
            {activeTopic === 'login' && (
              <>
                <p>
                  Use your school email and password. Forgot your password? You can reset it anytime.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/forgot-password');
                    onClose();
                  }}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Go to Forgot Password →
                </button>
              </>
            )}
            {activeTopic === 'register' && (
              <>
                <p>
                  New students need their Student ID and Grade (6–10). After verifying your email,
                  an administrator will approve your account.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/register');
                    onClose();
                  }}
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Open Student Registration →
                </button>
              </>
            )}
            {activeTopic === 'support' && (
              <p>
                Need help with your account status? Email{' '}
                <span className="font-semibold text-slate-900">{SCHOOL_CONFIG.supportEmail}</span>.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
