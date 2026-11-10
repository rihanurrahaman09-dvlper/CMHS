import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut } from 'lucide-react';
import { SCHOOL_CONFIG } from '../config/school';
import { useAuth } from '../context/AuthContext';

interface DashboardShellProps {
  roleLabel: string;
  children: React.ReactNode;
}

export function DashboardShell({ roleLabel, children }: DashboardShellProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-base font-bold text-slate-900 truncate">
              {SCHOOL_CONFIG.name}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">
              {roleLabel}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
