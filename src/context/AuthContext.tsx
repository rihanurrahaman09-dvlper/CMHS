import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { StudentGrade, UserProfile } from '../types/auth';
import { sanitizeAuthError } from '../utils/authRouting';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileError: string | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; profile: UserProfile | null }>;
  signUpStudent: (params: {
    fullName: string;
    email: string;
    studentId: string;
    grade: StudentGrade;
    password: string;
  }) => Promise<{ error: string | null; needsEmailVerification: boolean }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!supabase) return null;
    setProfileError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, account_status, student_id, grade, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // Fail closed: never guess a role if profile is missing or unreadable
      setProfile(null);
      setProfileError(
        'Your account profile could not be verified. Please contact your school administrator.'
      );
      return null;
    }

    const typedProfile = data as UserProfile;
    setProfile(typedProfile);
    return typedProfile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const client = supabase;
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data, error } = await client.auth.getSession();
        if (!mounted) return;

        if (error) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        const currentSession = data.session;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
        setProfileError(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return {
          error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
          profile: null,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        return { error: sanitizeAuthError(error), profile: null };
      }

      const loadedProfile = await fetchProfile(data.user.id);
      if (!loadedProfile) {
        return {
          error: 'Your account profile could not be verified. Please contact your school administrator.',
          profile: null,
        };
      }

      return { error: null, profile: loadedProfile };
    },
    [fetchProfile]
  );

  const signUpStudent = useCallback(
    async (params: {
      fullName: string;
      email: string;
      studentId: string;
      grade: StudentGrade;
      password: string;
    }) => {
      if (!supabase) {
        return {
          error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
          needsEmailVerification: false,
        };
      }

      // Security: Never send a role from the client. The database trigger
      // assigns 'student' and 'pending' status automatically.
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: params.fullName.trim(),
            student_id: params.studentId.trim(),
            grade: params.grade,
          },
        },
      });

      if (error) {
        return { error: sanitizeAuthError(error), needsEmailVerification: false };
      }

      const needsEmailVerification = !data.session;
      return { error: null, needsEmailVerification };
    },
    []
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
    setProfileError(null);
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    if (!supabase) {
      return {
        error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: sanitizeAuthError(error) };
    }

    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) {
      return {
        error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: sanitizeAuthError(error) };
    }

    return { error: null };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        profileError,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUpStudent,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
