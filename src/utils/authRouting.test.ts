import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolvePostAuthRoute,
  validateEmail,
  validatePassword,
  validateStudentRegistration,
  sanitizeAuthError,
} from './authRouting';
import type { UserProfile } from '../types/auth';

const baseProfile: UserProfile = {
  id: 'user-123',
  full_name: 'Aarav Sharma',
  role: 'student',
  account_status: 'approved',
  student_id: 'STU-2026-01',
  grade: 8,
  created_at: '2026-01-01T00:00:00Z',
};

test('resolvePostAuthRoute fails closed when profile is null', () => {
  assert.equal(resolvePostAuthRoute(null), '/login');
});

test('resolvePostAuthRoute routes pending users to /pending-approval regardless of role', () => {
  assert.equal(
    resolvePostAuthRoute({ ...baseProfile, account_status: 'pending', role: 'admin' }),
    '/pending-approval'
  );
});

test('resolvePostAuthRoute routes suspended users to /suspended', () => {
  assert.equal(
    resolvePostAuthRoute({ ...baseProfile, account_status: 'suspended' }),
    '/suspended'
  );
});

test('resolvePostAuthRoute routes approved users to their role-specific dashboard', () => {
  assert.equal(resolvePostAuthRoute({ ...baseProfile, role: 'student' }), '/student');
  assert.equal(resolvePostAuthRoute({ ...baseProfile, role: 'teacher' }), '/teacher');
  assert.equal(resolvePostAuthRoute({ ...baseProfile, role: 'admin' }), '/admin');
});

test('validateEmail catches empty and malformed emails', () => {
  assert.ok(validateEmail(''));
  assert.ok(validateEmail('not-an-email'));
  assert.equal(validateEmail('student@school.edu'), null);
});

test('validatePassword enforces minimum length', () => {
  assert.ok(validatePassword(''));
  assert.ok(validatePassword('short'));
  assert.equal(validatePassword('StrongPass123'), null);
});

test('validateStudentRegistration validates all required fields and grade 6-10', () => {
  const errors = validateStudentRegistration({
    fullName: 'A',
    email: 'bad',
    studentId: '',
    grade: '',
    password: '123',
    confirmPassword: '456',
  });
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.studentId);
  assert.ok(errors.grade);
  assert.ok(errors.password);
  assert.ok(errors.confirmPassword);

  const valid = validateStudentRegistration({
    fullName: 'Maya Patel',
    email: 'maya@school.edu',
    studentId: 'STU-104',
    grade: 9,
    password: 'Password123',
    confirmPassword: 'Password123',
  });
  assert.deepEqual(valid, {});
});

test('sanitizeAuthError hides internal errors and translates known auth errors', () => {
  assert.match(sanitizeAuthError(new Error('Invalid login credentials')), /Invalid email address or password/);
  assert.match(sanitizeAuthError(new Error('Email not confirmed')), /verify your email/);
  assert.doesNotMatch(sanitizeAuthError(new Error('PG::UniqueViolation: detail=Key (id)')), /PG::UniqueViolation/);
});
