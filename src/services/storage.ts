/**
 * Sensus Academic Storage & LocalStorage Synchronization Service
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * LocalStorage is utilized for browser-level persistence and college viva / portfolio demonstration.
 * In an enterprise production deployment, this layer interfaces with an enterprise relational SQL database
 * with TLS, token-based JWT sessions, and role-based access control.
 */

import { Student, Admin, Course, Faculty, FeedbackSubmission, FeedbackRatingCriteria } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'clario_current_user',
  USER_ROLE: 'clario_user_role',
  STUDENTS: 'clario_students_v1',
  ADMINS: 'clario_admins_v1',
  COURSES: 'clario_courses_v1',
  FACULTY: 'clario_faculty_v2',
  FEEDBACKS: 'clario_feedbacks_v2',
  INIT_FLAG: 'clario_initialized_v2',
};

// Default Faculty Seed with unique login credentials (facultyId / password)
export const DEFAULT_FACULTY: Faculty[] = [
  {
    id: 'fac-1',
    facultyId: 'FAC-01',
    name: 'Dr. Sharma',
    title: 'Associate Professor',
    department: 'Department of Computer Science & Engineering',
    email: 'sharma.cs@university.edu',
    password: 'faculty123',
    office: 'Academic Block A, Room 304',
    bio: 'Specialist in Algorithms, Computational Complexity, and Data Structures with 14+ years of teaching excellence.',
    coursesTaught: ['course-1'],
    avatarUrl: '/src/assets/images/clario_faculty_portrait_1793459986698.jpg',
  },
  {
    id: 'fac-2',
    facultyId: 'FAC-02',
    name: 'Prof. Mehta',
    title: 'Assistant Professor',
    department: 'Department of Information Technology',
    email: 'mehta.it@university.edu',
    password: 'faculty123',
    office: 'Technology Tower B, Room 212',
    bio: 'Full-stack web architecture researcher, mentor for open-source collegiate hackathons and modern cloud UI systems.',
    coursesTaught: ['course-2'],
  },
  {
    id: 'fac-3',
    facultyId: 'FAC-03',
    name: 'Dr. Patel',
    title: 'Professor & Head of Department',
    department: 'Department of Computer Science & Engineering',
    email: 'patel.dbms@university.edu',
    password: 'faculty123',
    office: 'Academic Block A, Room 401',
    bio: 'Author of 3 database engineering textbooks, recognized for query optimization, distributed storage, and relational schema theory.',
    coursesTaught: ['course-3'],
  },
  {
    id: 'fac-4',
    facultyId: 'FAC-04',
    name: 'Prof. Rao',
    title: 'Senior Assistant Professor',
    department: 'Department of Computer Science & Engineering',
    email: 'rao.networks@university.edu',
    password: 'faculty123',
    office: 'Academic Block B, Room 108',
    bio: 'Expert in TCP/IP architectures, high-performance packet routing, and network protocol security.',
    coursesTaught: ['course-4'],
  },
  {
    id: 'fac-5',
    facultyId: 'FAC-05',
    name: 'Dr. Anita Roy',
    title: 'Associate Professor',
    department: 'Department of Cloud Computing & DevOps',
    email: 'anita.roy@university.edu',
    password: 'faculty123',
    office: 'Innovation Hub, Room 102',
    bio: 'Distributed systems and containerization specialist with industry leadership in enterprise infrastructure.',
    coursesTaught: ['course-5'],
  },
];

// Default Courses Seed (Includes all 4 required by prompt)
export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'CS201',
    name: 'Data Structures',
    facultyId: 'fac-1',
    semester: 'Semester 3',
    department: 'Computer Science',
    description: 'Fundamental linear and non-linear data structures, trees, graphs, hashing, asymptotic algorithm analysis, and memory management in C++.',
    credits: 4,
  },
  {
    id: 'course-2',
    code: 'CS305',
    name: 'Web Development',
    facultyId: 'fac-2',
    semester: 'Semester 5',
    department: 'Information Technology',
    description: 'Modern full-stack client-server architectures, responsive design systems, asynchronous state handling, RESTful APIs, and browser runtime performance.',
    credits: 4,
  },
  {
    id: 'course-3',
    code: 'CS302',
    name: 'Database Management',
    facultyId: 'fac-3',
    semester: 'Semester 4',
    department: 'Computer Science',
    description: 'Relational database theory, normal forms (1NF to BCNF), indexing, concurrency control, ACID properties, transaction management, and complex SQL.',
    credits: 4,
  },
  {
    id: 'course-4',
    code: 'CS401',
    name: 'Computer Networks',
    facultyId: 'fac-4',
    semester: 'Semester 5',
    department: 'Computer Science',
    description: 'OSI and TCP/IP stack reference models, sliding window protocols, subnetting, BGP/OSPF routing, transport layer congestion control, and transport encryption.',
    credits: 3,
  },
  {
    id: 'course-5',
    code: 'CS405',
    name: 'Cloud Computing & DevOps',
    facultyId: 'fac-5',
    semester: 'Semester 6',
    department: 'Computer Science',
    description: 'Virtualization, infrastructure as code, CI/CD automated deployment pipelines, microservices clustering, and serverless compute paradigms.',
    credits: 3,
  },
];

// Default Sample Students
export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    studentId: 'STU-2024-001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@university.edu',
    password: 'student123',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester 5',
    createdAt: '2026-08-15T09:00:00.000Z',
  },
  {
    id: 'stu-2',
    studentId: 'STU-2024-042',
    fullName: 'Priya Nair',
    email: 'priya.nair@university.edu',
    password: 'student123',
    program: 'B.Tech Information Technology',
    semester: 'Semester 5',
    createdAt: '2026-08-16T10:30:00.000Z',
  },
];

// Default Administrator
export const DEFAULT_ADMINS: Admin[] = [
  {
    id: 'adm-1',
    adminId: 'ADMIN-01',
    fullName: 'Dr. Katherine Vance',
    email: 'admin@clario.edu',
    roleTitle: 'Dean of Academic Quality & Accreditation',
    password: 'admin123',
  },
];

// Default Realistic Feedback Submissions to populate Analytics immediately
export const DEFAULT_FEEDBACKS: FeedbackSubmission[] = [
  {
    id: 'fb-101',
    courseId: 'course-1',
    courseName: 'Data Structures',
    courseCode: 'CS201',
    facultyId: 'fac-1',
    facultyName: 'Dr. Sharma',
    semester: 'Semester 3',
    academicYear: '2026-2027',
    studentId: 'stu-2',
    studentName: 'Priya Nair',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 4,
      doubtResolution: 5,
      classroomEngagement: 5,
      courseContentQuality: 5,
    },
    averageRating: 4.83,
    likedAspects: 'Dr. Sharma visualizes complex binary search trees and heap structures on the whiteboard with unmatched clarity. Lab practice sessions directly reinforced the lecture proofs.',
    improvements: 'More practice problems on dynamic programming and graph flow would be beneficial before midterm exams.',
    additionalComments: 'One of the best foundational engineering courses I have experienced so far.',
    isAnonymous: false,
    submittedAt: '2026-10-18T14:22:00.000Z',
  },
  {
    id: 'fb-102',
    courseId: 'course-2',
    courseName: 'Web Development',
    courseCode: 'CS305',
    facultyId: 'fac-2',
    facultyName: 'Prof. Mehta',
    semester: 'Semester 5',
    academicYear: '2026-2027',
    studentId: 'stu-999', // anonymous submission from peer
    studentName: 'Anonymous Student',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 5,
      doubtResolution: 4,
      classroomEngagement: 5,
      courseContentQuality: 5,
    },
    averageRating: 4.83,
    likedAspects: 'Prof. Mehta brings real production code examples to class instead of outdated legacy syntax. Modern reactive state management was taught thoroughly.',
    improvements: 'Would appreciate extended server lab hours for deploying distributed backend projects.',
    additionalComments: 'Exceptional enthusiasm and very supportive during project reviews.',
    isAnonymous: true,
    submittedAt: '2026-10-20T09:15:00.000Z',
  },
  {
    id: 'fb-103',
    courseId: 'course-3',
    courseName: 'Database Management',
    courseCode: 'CS302',
    facultyId: 'fac-3',
    facultyName: 'Dr. Patel',
    semester: 'Semester 4',
    academicYear: '2026-2027',
    studentId: 'stu-888',
    studentName: 'Anonymous Student',
    ratings: {
      teachingQuality: 4,
      subjectKnowledge: 5,
      communicationSkills: 4,
      doubtResolution: 4,
      classroomEngagement: 3,
      courseContentQuality: 4,
    },
    averageRating: 4.0,
    likedAspects: 'In-depth rigorous focus on BCNF decomposition and query optimizer mechanics. Homework assignments were challenging and practical.',
    improvements: 'Lectures can occasionally move very fast through relational algebra derivations. Slowing down slightly would aid comprehension.',
    additionalComments: 'Very knowledgeable faculty with strong academic standards.',
    isAnonymous: true,
    submittedAt: '2026-10-22T11:45:00.000Z',
  },
  {
    id: 'fb-104',
    courseId: 'course-4',
    courseName: 'Computer Networks',
    courseCode: 'CS401',
    facultyId: 'fac-4',
    facultyName: 'Prof. Rao',
    semester: 'Semester 5',
    academicYear: '2026-2027',
    studentId: 'stu-777',
    studentName: 'Rohan Deshmukh',
    ratings: {
      teachingQuality: 4,
      subjectKnowledge: 4,
      communicationSkills: 4,
      doubtResolution: 4,
      classroomEngagement: 4,
      courseContentQuality: 4,
    },
    averageRating: 4.0,
    likedAspects: 'Wireshark packet capture labs were extremely helpful in understanding TCP 3-way handshakes and sliding window flow control.',
    improvements: 'Provide more practice questions for subnetting and IP address allocation.',
    additionalComments: 'Punctual and always approachable during designated office hours.',
    isAnonymous: false,
    submittedAt: '2026-10-25T16:10:00.000Z',
  },
  {
    id: 'fb-105',
    courseId: 'course-1',
    courseName: 'Data Structures',
    courseCode: 'CS201',
    facultyId: 'fac-1',
    facultyName: 'Dr. Sharma',
    semester: 'Semester 3',
    academicYear: '2026-2027',
    studentId: 'stu-666',
    studentName: 'Anonymous Student',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 5,
      doubtResolution: 5,
      classroomEngagement: 4,
      courseContentQuality: 5,
    },
    averageRating: 4.83,
    likedAspects: 'Every assignment is graded with thoughtful inline feedback. The weekly office hours helped clear all doubts on tree traversals.',
    improvements: 'Include an introduction to balanced AVL trees in the syllabus prior to red-black trees.',
    additionalComments: 'Inspiring mentor who encourages student participation.',
    isAnonymous: true,
    submittedAt: '2026-10-28T13:05:00.000Z',
  },
  {
    id: 'fb-106',
    courseId: 'course-2',
    courseName: 'Web Development',
    courseCode: 'CS305',
    facultyId: 'fac-2',
    facultyName: 'Prof. Mehta',
    semester: 'Semester 5',
    academicYear: '2026-2027',
    studentId: 'stu-1',
    studentName: 'Aarav Sharma',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 5,
      doubtResolution: 5,
      classroomEngagement: 4,
      courseContentQuality: 5,
    },
    averageRating: 4.83,
    likedAspects: 'Prof. Mehta demonstrates modern full-stack web architectures with unmatched clarity. Real coding demonstrations during lectures kept everyone engaged.',
    improvements: 'Would love an extra workshop on cloud deployments with Docker containers.',
    additionalComments: 'One of my favorite subjects this semester!',
    isAnonymous: false,
    submittedAt: '2026-10-29T10:15:00.000Z',
  },
  {
    id: 'fb-107',
    courseId: 'course-3',
    courseName: 'Database Management',
    courseCode: 'CS302',
    facultyId: 'fac-3',
    facultyName: 'Dr. Patel',
    semester: 'Semester 4',
    academicYear: '2026-2027',
    studentId: 'stu-333',
    studentName: 'Kavita Sundaram',
    ratings: {
      teachingQuality: 4,
      subjectKnowledge: 5,
      communicationSkills: 4,
      doubtResolution: 4,
      classroomEngagement: 4,
      courseContentQuality: 5,
    },
    averageRating: 4.33,
    likedAspects: 'The practical SQL query tuning assignments were very industry-relevant. Normalization concepts were explained systematically.',
    improvements: 'More practice sessions on distributed transactions and 2-phase commit protocols.',
    additionalComments: 'Strongly recommend Dr. Patel for core systems courses.',
    isAnonymous: false,
    submittedAt: '2026-10-29T14:40:00.000Z',
  },
  {
    id: 'fb-108',
    courseId: 'course-4',
    courseName: 'Computer Networks',
    courseCode: 'CS401',
    facultyId: 'fac-4',
    facultyName: 'Prof. Rao',
    semester: 'Semester 5',
    academicYear: '2026-2027',
    studentId: 'stu-555',
    studentName: 'Anonymous Student',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 4,
      doubtResolution: 4,
      classroomEngagement: 4,
      courseContentQuality: 4,
    },
    averageRating: 4.33,
    likedAspects: 'Hands-on socket programming exercises and network protocol trace simulations were fantastic.',
    improvements: 'More visual slide animations for TCP window congestion avoidance.',
    additionalComments: 'Very structured and predictable exam patterns.',
    isAnonymous: true,
    submittedAt: '2026-10-30T09:20:00.000Z',
  },
  {
    id: 'fb-109',
    courseId: 'course-5',
    courseName: 'Cloud Computing & DevOps',
    courseCode: 'CS405',
    facultyId: 'fac-5',
    facultyName: 'Dr. Anita Roy',
    semester: 'Semester 6',
    academicYear: '2026-2027',
    studentId: 'stu-444',
    studentName: 'Anonymous Student',
    ratings: {
      teachingQuality: 5,
      subjectKnowledge: 5,
      communicationSkills: 5,
      doubtResolution: 4,
      classroomEngagement: 5,
      courseContentQuality: 5,
    },
    averageRating: 4.83,
    likedAspects: 'Dr. Roy covers modern Kubernetes cluster orchestration and CI/CD pipelines with great enthusiasm. Assignments were very practical.',
    improvements: 'Allow more cloud budget credits for running multiple test clusters.',
    additionalComments: 'A cutting-edge course that prepared us directly for software engineering internships.',
    isAnonymous: true,
    submittedAt: '2026-10-30T16:50:00.000Z',
  },
];

export class StorageService {
  /**
   * Initializes local storage with defaults if not present
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INIT_FLAG);
    if (!initialized) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
      localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(DEFAULT_FACULTY));
      localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(DEFAULT_FEEDBACKS));
      localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
    }
  }

  /**
   * Reset all data back to the clean demonstration seed
   */
  static resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(DEFAULT_COURSES));
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(DEFAULT_FACULTY));
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(DEFAULT_FEEDBACKS));
    localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
  }

  // --- Auth & Session ---
  static getCurrentUser(): (Student | Admin | Faculty) | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static getUserRole(): 'student' | 'admin' | 'faculty' | null {
    if (typeof window === 'undefined') return null;
    return (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as 'student' | 'admin' | 'faculty') || null;
  }

  static setCurrentSession(user: Student | Admin | Faculty, role: 'student' | 'admin' | 'faculty'): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  }

  static clearSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  }

  // --- Students ---
  static getStudents(): Student[] {
    if (typeof window === 'undefined') return DEFAULT_STUDENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : DEFAULT_STUDENTS;
  }

  static registerStudent(studentData: Omit<Student, 'id' | 'createdAt'>): { success: boolean; message: string; student?: Student } {
    const students = this.getStudents();
    
    // Check if Student ID or Email already exists
    const idExists = students.some(s => s.studentId.trim().toLowerCase() === studentData.studentId.trim().toLowerCase());
    if (idExists) {
      return { success: false, message: `Student ID "${studentData.studentId}" is already registered.` };
    }

    const emailExists = students.some(s => s.email.trim().toLowerCase() === studentData.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: `Email "${studentData.email}" is already associated with an account.` };
    }

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return { success: true, message: 'Registration successful! You can now log in.', student: newStudent };
  }

  static authenticateStudent(idOrEmail: string, pass: string): { success: boolean; message: string; student?: Student } {
    const students = this.getStudents();
    const query = idOrEmail.trim().toLowerCase();

    const student = students.find(
      s => (s.studentId.toLowerCase() === query || s.email.toLowerCase() === query) && s.password === pass
    );

    if (student) {
      return { success: true, message: 'Authentication successful.', student };
    }
    return { success: false, message: 'Invalid Student ID/Email or password. Please verify your credentials.' };
  }

  // --- Admins ---
  static getAdmins(): Admin[] {
    if (typeof window === 'undefined') return DEFAULT_ADMINS;
    const raw = localStorage.getItem(STORAGE_KEYS.ADMINS);
    return raw ? JSON.parse(raw) : DEFAULT_ADMINS;
  }

  static saveAdmins(admins: Admin[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  }

  static registerAdmin(adminData: Omit<Admin, 'id'>): { success: boolean; message: string; admin?: Admin } {
    const admins = this.getAdmins();
    const idExists = admins.some(a => a.adminId.trim().toUpperCase() === adminData.adminId.trim().toUpperCase());
    if (idExists) {
      return { success: false, message: `Administrator ID "${adminData.adminId}" is already registered.` };
    }

    const emailExists = admins.some(a => a.email.trim().toLowerCase() === adminData.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: `An administrator with email "${adminData.email}" already exists.` };
    }

    const newAdmin: Admin = {
      ...adminData,
      id: `admin-${Date.now()}`,
      adminId: adminData.adminId.trim().toUpperCase(),
      email: adminData.email.trim().toLowerCase(),
      fullName: adminData.fullName.trim(),
      roleTitle: adminData.roleTitle.trim() || 'Academic Administrator',
      password: adminData.password || 'admin123',
    };

    admins.push(newAdmin);
    this.saveAdmins(admins);
    return { success: true, message: 'Administrator account registered successfully.', admin: newAdmin };
  }

  static authenticateAdmin(adminIdOrEmail: string, pass: string): { success: boolean; message: string; admin?: Admin } {
    const admins = this.getAdmins();
    const query = adminIdOrEmail.trim().toLowerCase();

    const admin = admins.find(
      a => (a.adminId.toLowerCase() === query || a.email.toLowerCase() === query) && a.password === pass
    );

    if (admin) {
      return { success: true, message: 'Administrator authentication verified.', admin };
    }
    return { success: false, message: 'Invalid Administrator ID or password. Please verify your credentials.' };
  }

  // --- Faculty Authentication ---
  static authenticateFaculty(facultyIdOrEmail: string, pass: string): { success: boolean; message: string; faculty?: Faculty } {
    const facultyList = this.getFaculty();
    const query = facultyIdOrEmail.trim().toLowerCase();

    const faculty = facultyList.find(
      f => (f.facultyId.toLowerCase() === query || f.email.toLowerCase() === query || f.id.toLowerCase() === query) && f.password === pass
    );

    if (faculty) {
      return { success: true, message: 'Faculty authentication verified.', faculty };
    }
    return { success: false, message: 'Invalid Faculty ID/Email or password. Please verify your credentials.' };
  }

  // --- Courses ---
  static getCourses(): Course[] {
    if (typeof window === 'undefined') return DEFAULT_COURSES;
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    return raw ? JSON.parse(raw) : DEFAULT_COURSES;
  }

  static saveCourses(courses: Course[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }

  static addCourse(courseData: Omit<Course, 'id'>): { success: boolean; message: string; course?: Course } {
    const courses = this.getCourses();
    const codeExists = courses.some(c => c.code.trim().toUpperCase() === courseData.code.trim().toUpperCase());
    if (codeExists) {
      return { success: false, message: `Course Code "${courseData.code}" already exists.` };
    }

    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      code: courseData.code.trim().toUpperCase(),
    };

    courses.push(newCourse);
    this.saveCourses(courses);

    // Also update faculty's coursesTaught
    this.linkCourseToFaculty(newCourse.facultyId, newCourse.id);

    return { success: true, message: 'Course successfully added to catalog.', course: newCourse };
  }

  static updateCourse(course: Course): { success: boolean; message: string } {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index === -1) {
      return { success: false, message: 'Course not found.' };
    }

    const previousFacultyId = courses[index].facultyId;
    courses[index] = course;
    this.saveCourses(courses);

    if (previousFacultyId !== course.facultyId) {
      this.unlinkCourseFromFaculty(previousFacultyId, course.id);
      this.linkCourseToFaculty(course.facultyId, course.id);
    }

    return { success: true, message: 'Course updated successfully.' };
  }

  static deleteCourse(courseId: string): { success: boolean; message: string } {
    const courses = this.getCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      return { success: false, message: 'Course not found.' };
    }

    const filtered = courses.filter(c => c.id !== courseId);
    this.saveCourses(filtered);
    this.unlinkCourseFromFaculty(course.facultyId, courseId);

    return { success: true, message: 'Course and related assignments removed.' };
  }

  // --- Faculty ---
  static getFaculty(): Faculty[] {
    if (typeof window === 'undefined') return DEFAULT_FACULTY;
    const raw = localStorage.getItem(STORAGE_KEYS.FACULTY);
    return raw ? JSON.parse(raw) : DEFAULT_FACULTY;
  }

  static saveFaculty(facultyList: Faculty[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(facultyList));
  }

  static addFaculty(facultyData: Omit<Faculty, 'id' | 'coursesTaught' | 'facultyId'> & { facultyId?: string; password?: string }): { success: boolean; message: string; faculty?: Faculty } {
    const facultyList = this.getFaculty();
    const emailExists = facultyList.some(f => f.email.trim().toLowerCase() === facultyData.email.trim().toLowerCase());
    if (emailExists) {
      return { success: false, message: `Faculty with email "${facultyData.email}" already exists.` };
    }

    const generatedFacultyId = facultyData.facultyId?.trim().toUpperCase() || `FAC-${(facultyList.length + 1).toString().padStart(2, '0')}`;

    const newFaculty: Faculty = {
      ...facultyData,
      id: `fac-${Date.now()}`,
      facultyId: generatedFacultyId,
      password: facultyData.password || 'faculty123',
      coursesTaught: [],
    };

    facultyList.push(newFaculty);
    this.saveFaculty(facultyList);
    return { success: true, message: 'Faculty member successfully registered.', faculty: newFaculty };
  }

  static updateFaculty(faculty: Faculty): { success: boolean; message: string } {
    const facultyList = this.getFaculty();
    const index = facultyList.findIndex(f => f.id === faculty.id);
    if (index === -1) {
      return { success: false, message: 'Faculty member not found.' };
    }

    facultyList[index] = faculty;
    this.saveFaculty(facultyList);
    return { success: true, message: 'Faculty member details updated successfully.' };
  }

  static deleteFaculty(facultyId: string): { success: boolean; message: string } {
    const facultyList = this.getFaculty();
    const faculty = facultyList.find(f => f.id === facultyId);
    if (!faculty) {
      return { success: false, message: 'Faculty member not found.' };
    }

    // Check if courses are currently assigned
    const courses = this.getCourses();
    const assignedCourses = courses.filter(c => c.facultyId === facultyId);
    if (assignedCourses.length > 0) {
      return {
        success: false,
        message: `Cannot remove ${faculty.name}. They are currently assigned to ${assignedCourses.length} active course(s). Reassign these courses first.`,
      };
    }

    const filtered = facultyList.filter(f => f.id !== facultyId);
    this.saveFaculty(filtered);
    return { success: true, message: 'Faculty member removed from directory.' };
  }

  private static linkCourseToFaculty(facultyId: string, courseId: string) {
    const facultyList = this.getFaculty();
    const f = facultyList.find(fac => fac.id === facultyId);
    if (f) {
      if (!f.coursesTaught.includes(courseId)) {
        f.coursesTaught.push(courseId);
        this.saveFaculty(facultyList);
      }
    }
  }

  private static unlinkCourseFromFaculty(facultyId: string, courseId: string) {
    const facultyList = this.getFaculty();
    const f = facultyList.find(fac => fac.id === facultyId);
    if (f) {
      f.coursesTaught = f.coursesTaught.filter(id => id !== courseId);
      this.saveFaculty(facultyList);
    }
  }

  // --- Feedback Submissions ---
  static getFeedbacks(): FeedbackSubmission[] {
    if (typeof window === 'undefined') return DEFAULT_FEEDBACKS;
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
    return raw ? JSON.parse(raw) : DEFAULT_FEEDBACKS;
  }

  static saveFeedbacks(feedbacks: FeedbackSubmission[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  }

  /**
   * Duplicate submission check:
   * Prevents duplicate submission for the same student, course, and evaluation semester.
   */
  static hasStudentSubmittedCourse(studentId: string, courseId: string, semester: string): boolean {
    const feedbacks = this.getFeedbacks();
    return feedbacks.some(
      fb => fb.studentId === studentId && fb.courseId === courseId && fb.semester === semester
    );
  }

  static submitFeedback(feedbackData: {
    courseId: string;
    studentId: string;
    studentName: string;
    ratings: FeedbackRatingCriteria;
    likedAspects: string;
    improvements: string;
    additionalComments?: string;
    isAnonymous: boolean;
  }): { success: boolean; message: string; submission?: FeedbackSubmission } {
    const courses = this.getCourses();
    const course = courses.find(c => c.id === feedbackData.courseId);
    if (!course) {
      return { success: false, message: 'Selected course not found.' };
    }

    const facultyList = this.getFaculty();
    const faculty = facultyList.find(f => f.id === course.facultyId);
    const facultyName = faculty ? faculty.name : 'Unknown Faculty';

    // Duplicate check
    if (this.hasStudentSubmittedCourse(feedbackData.studentId, course.id, course.semester)) {
      return {
        success: false,
        message: `You have already submitted an evaluation for "${course.name}" (${course.code}) for ${course.semester}. Duplicate submissions are not permitted.`,
      };
    }

    // Calculate criteria average
    const criteriaValues = Object.values(feedbackData.ratings);
    const sum = criteriaValues.reduce((acc, val) => acc + val, 0);
    const averageRating = Number((sum / criteriaValues.length).toFixed(2));

    const newFeedback: FeedbackSubmission = {
      id: `fb-${Date.now()}`,
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
      facultyId: course.facultyId,
      facultyName: facultyName,
      semester: course.semester,
      academicYear: '2026-2027',
      studentId: feedbackData.studentId,
      studentName: feedbackData.isAnonymous ? 'Anonymous Student' : feedbackData.studentName,
      ratings: feedbackData.ratings,
      averageRating,
      likedAspects: feedbackData.likedAspects.trim(),
      improvements: feedbackData.improvements.trim(),
      additionalComments: feedbackData.additionalComments?.trim() || '',
      isAnonymous: feedbackData.isAnonymous,
      submittedAt: new Date().toISOString(),
    };

    const feedbacks = this.getFeedbacks();
    feedbacks.unshift(newFeedback); // latest first
    this.saveFeedbacks(feedbacks);

    return { success: true, message: 'Evaluation submitted successfully! Thank you for your feedback.', submission: newFeedback };
  }

  static getFeedbacksForStudent(studentId: string): FeedbackSubmission[] {
    const feedbacks = this.getFeedbacks();
    return feedbacks.filter(fb => fb.studentId === studentId);
  }

  /**
   * Faculty feedback access control:
   * Returns ONLY feedbacks where facultyId strictly matches the requested faculty member.
   */
  static getFeedbacksForFaculty(facultyId: string): FeedbackSubmission[] {
    const feedbacks = this.getFeedbacks();
    return feedbacks.filter(fb => fb.facultyId === facultyId);
  }

  /**
   * Generates and downloads a clean CSV file of feedback records.
   * Ensures that student identity remains completely shielded for anonymous evaluations.
   */
  static exportFeedbackToCSV(feedbacksToExport: FeedbackSubmission[]): void {
    if (typeof window === 'undefined') return;

    const headers = [
      'Submission ID',
      'Course Code',
      'Course Name',
      'Faculty Member',
      'Semester',
      'Academic Year',
      'Overall Rating',
      'Teaching Quality',
      'Subject Knowledge',
      'Communication Skills',
      'Doubt Resolution',
      'Classroom Engagement',
      'Course Content Quality',
      'Student Identity',
      'What Worked Well',
      'Areas for Improvement',
      'Additional Comments',
      'Submission Date',
    ];

    const escapeCSV = (str: string | number | undefined | null) => {
      if (str === undefined || str === null) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const rows = feedbacksToExport.map(fb => [
      escapeCSV(fb.id),
      escapeCSV(fb.courseCode),
      escapeCSV(fb.courseName),
      escapeCSV(fb.facultyName),
      escapeCSV(fb.semester),
      escapeCSV(fb.academicYear),
      escapeCSV(fb.averageRating.toFixed(2)),
      escapeCSV(fb.ratings.teachingQuality),
      escapeCSV(fb.ratings.subjectKnowledge),
      escapeCSV(fb.ratings.communicationSkills),
      escapeCSV(fb.ratings.doubtResolution),
      escapeCSV(fb.ratings.classroomEngagement),
      escapeCSV(fb.ratings.courseContentQuality),
      escapeCSV(fb.isAnonymous ? 'Anonymous' : fb.studentName),
      escapeCSV(fb.likedAspects),
      escapeCSV(fb.improvements),
      escapeCSV(fb.additionalComments || 'None'),
      escapeCSV(new Date(fb.submittedAt).toLocaleDateString()),
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sensus_Feedback_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
