export type UserRole = 'student' | 'teacher' | 'admin';

export type AccountStatus = 'pending' | 'approved' | 'suspended';

export type StudentGrade = 6 | 7 | 8 | 9 | 10;

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  account_status: AccountStatus;
  student_id: string | null;
  grade: number | null;
  created_at: string;
}

export interface StudentRegistrationInput {
  fullName: string;
  email: string;
  studentId: string;
  grade: StudentGrade | '';
  password: string;
  confirmPassword: string;
}
