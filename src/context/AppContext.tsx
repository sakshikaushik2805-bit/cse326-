/**
 * Sensus Academic Context & State Provider
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Admin, Course, Faculty, FeedbackSubmission, ViewState, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  currentUser: (Student | Admin | Faculty) | null;
  userRole: UserRole;
  activeView: ViewState;
  courses: Course[];
  faculty: Faculty[];
  feedbacks: FeedbackSubmission[];
  students: Student[];
  notification: ToastNotification | null;
  setActiveView: (view: ViewState) => void;
  showNotification: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  dismissNotification: () => void;
  loginStudent: (idOrEmail: string, pass: string) => { success: boolean; message: string };
  registerStudent: (data: Omit<Student, 'id' | 'createdAt'>) => { success: boolean; message: string };
  loginAdmin: (adminId: string, pass: string) => { success: boolean; message: string };
  registerAdmin: (data: Omit<Admin, 'id'>) => { success: boolean; message: string };
  loginFaculty: (idOrEmail: string, pass: string) => { success: boolean; message: string };
  registerFaculty: (data: Omit<Faculty, 'id' | 'coursesTaught'>) => { success: boolean; message: string };
  logout: () => void;
  refreshData: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<(Student | Admin | Faculty) | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [activeView, setActiveView] = useState<ViewState>('landing');
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [notification, setNotification] = useState<ToastNotification | null>(null);

  // Initialize storage and sync on mount
  useEffect(() => {
    StorageService.initialize();
    refreshData();

    // Check existing session
    const savedUser = StorageService.getCurrentUser();
    const savedRole = StorageService.getUserRole();
    if (savedUser && savedRole) {
      setCurrentUser(savedUser);
      setUserRole(savedRole);
      if (savedRole === 'student') {
        setActiveView('student-dashboard');
      } else if (savedRole === 'faculty') {
        setActiveView('faculty-dashboard');
      } else {
        setActiveView('admin-dashboard');
      }
    }
  }, []);

  const refreshData = () => {
    setCourses(StorageService.getCourses());
    setFaculty(StorageService.getFaculty());
    setFeedbacks(StorageService.getFeedbacks());
    setStudents(StorageService.getStudents());
    const user = StorageService.getCurrentUser();
    const role = StorageService.getUserRole();
    setCurrentUser(user);
    setUserRole(role);
  };

  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `${Date.now()}`;
    setNotification({ id, type, title, message });
    setTimeout(() => {
      setNotification(prev => (prev?.id === id ? null : prev));
    }, 4500);
  };

  const dismissNotification = () => setNotification(null);

  const loginStudent = (idOrEmail: string, pass: string) => {
    const res = StorageService.authenticateStudent(idOrEmail, pass);
    if (res.success && res.student) {
      StorageService.setCurrentSession(res.student, 'student');
      setCurrentUser(res.student);
      setUserRole('student');
      setActiveView('student-dashboard');
      showNotification('success', 'Welcome Back', `Logged in as ${res.student.fullName} (${res.student.studentId})`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Login Failed', res.message);
    return { success: false, message: res.message };
  };

  const registerStudent = (data: Omit<Student, 'id' | 'createdAt'>) => {
    const res = StorageService.registerStudent(data);
    if (res.success && res.student) {
      StorageService.setCurrentSession(res.student, 'student');
      setCurrentUser(res.student);
      setUserRole('student');
      refreshData();
      setActiveView('student-dashboard');
      showNotification('success', 'Registration Complete', `Welcome to Sensus, ${res.student.fullName}!`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Registration Error', res.message);
    return { success: false, message: res.message };
  };

  const loginAdmin = (adminId: string, pass: string) => {
    const res = StorageService.authenticateAdmin(adminId, pass);
    if (res.success && res.admin) {
      StorageService.setCurrentSession(res.admin, 'admin');
      setCurrentUser(res.admin);
      setUserRole('admin');
      setActiveView('admin-dashboard');
      showNotification('success', 'Academic Admin Portal', `Welcome, ${res.admin.fullName}`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Admin Login Failed', res.message);
    return { success: false, message: res.message };
  };

  const registerAdmin = (data: Omit<Admin, 'id'>) => {
    const res = StorageService.registerAdmin(data);
    if (res.success && res.admin) {
      StorageService.setCurrentSession(res.admin, 'admin');
      setCurrentUser(res.admin);
      setUserRole('admin');
      refreshData();
      setActiveView('admin-dashboard');
      showNotification('success', 'Admin Registration Complete', `Welcome to Sensus, ${res.admin.fullName}!`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Admin Registration Error', res.message);
    return { success: false, message: res.message };
  };

  const loginFaculty = (idOrEmail: string, pass: string) => {
    const res = StorageService.authenticateFaculty(idOrEmail, pass);
    if (res.success && res.faculty) {
      StorageService.setCurrentSession(res.faculty, 'faculty');
      setCurrentUser(res.faculty);
      setUserRole('faculty');
      setActiveView('faculty-dashboard');
      showNotification('success', 'Faculty Portal', `Welcome, ${res.faculty.name}`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Faculty Login Failed', res.message);
    return { success: false, message: res.message };
  };

  const registerFaculty = (data: Omit<Faculty, 'id' | 'coursesTaught'>) => {
    const res = StorageService.addFaculty(data);
    if (res.success && res.faculty) {
      StorageService.setCurrentSession(res.faculty, 'faculty');
      setCurrentUser(res.faculty);
      setUserRole('faculty');
      refreshData();
      setActiveView('faculty-dashboard');
      showNotification('success', 'Faculty Registration Complete', `Welcome to Sensus, ${res.faculty.name}!`);
      return { success: true, message: res.message };
    }
    showNotification('error', 'Registration Error', res.message);
    return { success: false, message: res.message };
  };

  const logout = () => {
    StorageService.clearSession();
    setCurrentUser(null);
    setUserRole(null);
    setActiveView('landing');
    showNotification('info', 'Logged Out', 'You have been safely signed out.');
  };

  const resetDemoData = () => {
    StorageService.resetToDefaults();
    refreshData();
    showNotification('info', 'System Reset', 'Catalog, faculty, and sample evaluations reset to default state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        activeView,
        courses,
        faculty,
        feedbacks,
        students,
        notification,
        setActiveView,
        showNotification,
        dismissNotification,
        loginStudent,
        registerStudent,
        loginAdmin,
        registerAdmin,
        loginFaculty,
        registerFaculty,
        logout,
        refreshData,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
