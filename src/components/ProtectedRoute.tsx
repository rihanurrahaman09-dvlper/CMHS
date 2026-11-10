import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import { resolvePostAuthRoute } from '../utils/authRouting';

interface ProtectedRouteProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRole, children }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <p className="text-sm font-medium">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Fail closed: no authenticated user or no verified profile
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Enforce account status before role access
  if (profile.account_status === 'pending') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (profile.account_status === 'suspended') {
    return <Navigate to="/suspended" replace />;
  }

  if (profile.account_status !== 'approved') {
    return <Navigate to="/login" replace />;
  }

  // Enforce role-based access
  if (profile.role !== allowedRole) {
    return <Navigate to={resolvePostAuthRoute(profile)} replace />;
  }

  return <>{children}</>;
}
