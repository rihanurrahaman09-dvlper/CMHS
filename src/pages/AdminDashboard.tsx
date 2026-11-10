import { ShieldCheck } from 'lucide-react';
import { DashboardShell } from '../components/DashboardShell';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard() {
  const { profile, user } = useAuth();

  return (
    <DashboardShell roleLabel="Administrator Portal">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome, {profile?.full_name ?? 'Administrator'}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              Administrator · {user?.email ?? 'Verified Staff'}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Administration Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl">
            Your administrator session is active. Student approval workflows, staff provisioning,
            and school-wide settings will be added here in subsequent modules.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
