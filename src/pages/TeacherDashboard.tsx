import { Presentation } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { useAuth } from '../context/AuthContext';

export function TeacherDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardShell roleLabel="Teacher Portal">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Presentation className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome, {profile?.full_name ?? 'Teacher'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Faculty &amp; Teaching Workspace
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Teaching Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Your teacher account is verified. Class rosters, lesson planning, and grading tools
            will be available in this workspace.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
