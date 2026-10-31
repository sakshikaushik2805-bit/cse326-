/**
 * Sensus Academic Feedback & Course Evaluation Portal - Types
 */

export type UserRole = 'student' | 'admin' | 'faculty' | null;

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  password?: string;
  program: string;
  semester: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  adminId: string;
  fullName: string;
  email: string;
  roleTitle: string;
  password?: string;
}

export interface Faculty {
  id: string;
  facultyId: string; // Unique faculty employee code e.g. FAC-01
  name: string;
  title: string;
  department: string;
  email: string;
  password?: string;
  office: string;
  bio: string;
  coursesTaught: string[]; // course IDs
  avatarUrl?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  facultyId: string;
  semester: string;
  department: string;
  description: string;
  credits: number;
}

export interface FeedbackRatingCriteria {
  teachingQuality: number; // 1-5
  subjectKnowledge: number; // 1-5
  communicationSkills: number; // 1-5
  doubtResolution: number; // 1-5
  classroomEngagement: number; // 1-5
  courseContentQuality: number; // 1-5
}

export interface FeedbackSubmission {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyId: string;
  facultyName: string;
  semester: string;
  academicYear: string;
  studentId: string; // Internal identifier for duplicate detection
  studentName: string;
  ratings: FeedbackRatingCriteria;
  averageRating: number;
  likedAspects: string;
  improvements: string;
  additionalComments?: string;
  isAnonymous: boolean;
  submittedAt: string;
}

export type ViewState =
  | 'landing'
  | 'student-login'
  | 'student-register'
  | 'admin-login'
  | 'admin-register'
  | 'faculty-login'
  | 'faculty-register'
  | 'student-dashboard'
  | 'give-feedback'
  | 'my-feedback'
  | 'courses'
  | 'guidelines'
  | 'profile'
  | 'faculty-dashboard'
  | 'faculty-courses'
  | 'admin-dashboard'
  | 'admin-courses'
  | 'admin-faculty'
  | 'admin-reports';
