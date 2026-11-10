import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthSplitLayout } from '../components/AuthSplitLayout';
import { useAuth } from '../context/AuthContext';
import type { StudentGrade } from '../types/auth';
import { validateStudentRegistration } from '../utils/authRouting';

const GRADES: StudentGrade[] = [6, 7, 8, 9, 10];

export function RegisterPage() {
  const { signUpStudent } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [grade, setGrade] = useState<StudentGrade | ''>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errors = validateStudentRegistration({
      fullName,
      email,
      studentId,
      grade,
      password,
      confirmPassword,
    });

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await signUpStudent({
        fullName,
        email,
        studentId,
        grade: grade as StudentGrade,
        password,
      });

      if (error) {
        setSubmitError(error);
        return;
      }

      setRegisteredEmail(email.trim());
    } finally {
      setSubmitting(false);
    }
  };

  if (registeredEmail) {
    return (
      <AuthSplitLayout
        welcomeTitle="Verify your email address"
        welcomeDescription="One quick step before your student account is reviewed by your school administrator."
      >
        <div className="w-full max-w-md mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Check your inbox
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            We sent a verification link to{' '}
            <span className="font-semibold text-slate-900">{registeredEmail}</span>.
            Please click the link in that email to confirm your address.
          </p>
          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">What happens next?</p>
            <p>1. Confirm your email address using the link we sent.</p>
            <p>2. A school administrator will review and approve your student account.</p>
            <p>3. Once approved, you can sign in to your Grade {grade} dashboard.</p>
          </div>
          <div className="mt-7">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      welcomeTitle="Student Registration"
      welcomeDescription="Create your student account for Grades 6–10. Teacher and administrator accounts are provisioned by the school."
    >
      <div className="w-full max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create student account
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Public registration is for students in Grades 6–10.
          </p>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="reg-fullname" className="block text-sm font-medium text-slate-700 mb-1">
              Full name
            </label>
            <input
              id="reg-fullname"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Maya Patel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              required
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@yourschool.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reg-student-id" className="block text-sm font-medium text-slate-700 mb-1">
                Student ID
              </label>
              <input
                id="reg-student-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU-2026-01"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                required
              />
              {fieldErrors.studentId && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.studentId}</p>
              )}
            </div>

            <div>
              <label htmlFor="reg-grade" className="block text-sm font-medium text-slate-700 mb-1">
                Grade
              </label>
              <select
                id="reg-grade"
                value={grade}
                onChange={(e) =>
                  setGrade(e.target.value ? (Number(e.target.value) as StudentGrade) : '')
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                required
              >
                <option value="">Select grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
              {fieldErrors.grade && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.grade}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-3.5 pr-11 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-slate-700 mb-1">
              Confirm password
            </label>
            <input
              id="reg-confirm-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Submitting registration...</span>
              </>
            ) : (
              <span>Submit registration request</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
