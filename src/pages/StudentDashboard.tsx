import { BookOpen } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { useAuth } from '../context/AuthContext';

export function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <DashboardShell roleLabel="Student Portal">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome back, {profile?.full_name ?? 'Student'}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>Grade {profile?.grade ?? '—'}</span>
              <span aria-hidden="true">·</span>
              <span>Student ID: {profile?.student_id ?? '—'}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Learning Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Your student account is approved and active. Courses, assignments, and gradebook
            modules will appear here as they are enabled for your grade level.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
