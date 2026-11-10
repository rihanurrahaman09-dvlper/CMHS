import type { UserProfile, UserRole } from '../types/auth';

/**
 * Determines the exact route a user should be sent to based on their
 * database-verified profile. Fails closed: if profile is missing or
 * status/role is unrecognized, returns '/login'.
 */
export function resolvePostAuthRoute(profile: UserProfile | null): string {
  if (!profile) {
    return '/login';
  }

  if (profile.account_status === 'pending') {
    return '/pending-approval';
  }

  if (profile.account_status === 'suspended') {
    return '/suspended';
  }

  if (profile.account_status !== 'approved') {
    return '/login';
  }

  switch (profile.role) {
    case 'student':
      return '/student';
    case 'teacher':
      return '/teacher';
    case 'admin':
      return '/admin';
    default:
      return '/login';
  }
}

export function getDashboardPathForRole(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/student';
    case 'teacher':
      return '/teacher';
    case 'admin':
      return '/admin';
  }
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

export function validateStudentRegistration(input: {
  fullName: string;
  email: string;
  studentId: string;
  grade: number | '';
  password: string;
  confirmPassword: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.fullName.trim() || input.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const emailErr = validateEmail(input.email);
  if (emailErr) {
    errors.email = emailErr;
  }

  if (!input.studentId.trim()) {
    errors.studentId = 'Student ID is required.';
  }

  if (input.grade === '' || ![6, 7, 8, 9, 10].includes(Number(input.grade))) {
    errors.grade = 'Please select your grade (6 to 10).';
  }

  const passwordErr = validatePassword(input.password);
  if (passwordErr) {
    errors.password = passwordErr;
  }

  if (input.password !== input.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

/**
 * Maps raw Supabase/network errors to safe, user-friendly messages
 * without leaking internal database details.
 */
export function sanitizeAuthError(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : typeof (error as { message?: unknown }).message === 'string'
          ? (error as { message: string }).message
          : '';

  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'Invalid email address or password. Please check your credentials and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please verify your email address before signing in. Check your inbox for the confirmation link.';
  }
  if (lower.includes('user already registered')) {
    return 'An account with this email address already exists.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  if (lower.includes('expired') || lower.includes('invalid token') || lower.includes('otp')) {
    return 'This verification or reset link has expired or is invalid. Please request a new one.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Unable to reach the authentication server. Please check your internet connection.';
  }

  return 'Unable to complete your request. Please verify your information and try again.';
}
