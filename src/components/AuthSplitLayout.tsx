import React from 'react';
import { BookOpen, Compass, GraduationCap, AlertTriangle } from 'lucide-react';
import { SCHOOL_CONFIG } from '../config/school';
import { useAuth } from '../context/AuthContext';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  welcomeTitle?: string;
  welcomeDescription?: string;
}

export function AuthSplitLayout({
  children,
  welcomeTitle = 'Welcome to your learning hub',
  welcomeDescription = 'Access your classes, assignments, grades, and school announcements in one secure place.',
}: AuthSplitLayoutProps) {
  const { isConfigured } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="animate-fade-slide-up w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Panel: Soft Mint-Green Educational Showcase */}
        <div className="lg:col-span-6 bg-[#ECFDF5] relative p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Soft green decorative shapes */}
          <div
            aria-hidden="true"
            className="animate-float-slow absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-200/40 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="animate-float-medium absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-teal-200/35 pointer-events-none"
          />

          {/* Top: School Logo & Name */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight text-slate-900 leading-tight">
                {SCHOOL_CONFIG.name}
              </span>
              <span className="block text-xs font-medium text-emerald-800">
                {SCHOOL_CONFIG.tagline}
              </span>
            </div>
          </div>

          {/* Center: Educational Illustration */}
          <div className="relative z-10 my-8 flex flex-col items-center">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-emerald-100/60 border border-emerald-200/70 shadow-sm">
              <img
                src="/src/assets/images/student_studying_illustration_1794325754885.jpg"
                alt="Student studying with books and laptop"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* Subtle Educational Decorative Icons */}
            <div className="mt-5 flex items-center justify-center gap-6 text-emerald-700/80" aria-hidden="true">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <BookOpen className="w-4 h-4" />
                <span>Grades 6–10</span>
              </div>
              <span className="text-emerald-400">·</span>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Compass className="w-4 h-4" />
                <span>Guided Learning</span>
              </div>
            </div>
          </div>

          {/* Bottom: Welcome Heading & Description */}
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              {welcomeTitle}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-700 leading-relaxed">
              {welcomeDescription}
            </p>
          </div>
        </div>

        {/* Right Panel: Clean White Form Area */}
        <div className="lg:col-span-6 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          {!isConfigured && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Supabase connection required</p>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Configure <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and{' '}
                  <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code> in
                  your environment variables to enable live authentication.
                </p>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
