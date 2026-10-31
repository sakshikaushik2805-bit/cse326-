import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';

// Landing & Auth Views
import { LandingPage } from './components/landing/LandingPage';
import { StudentLogin } from './components/auth/StudentLogin';
import { StudentRegister } from './components/auth/StudentRegister';
import { AdminLogin } from './components/auth/AdminLogin';
import { AdminRegister } from './components/auth/AdminRegister';
import { FacultyLogin } from './components/auth/FacultyLogin';
import { FacultyRegister } from './components/auth/FacultyRegister';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { FeedbackForm } from './components/student/FeedbackForm';
import { MyFeedback } from './components/student/MyFeedback';
import { CourseCatalog } from './components/student/CourseCatalog';
import { Guidelines } from './components/student/Guidelines';

// Faculty Portal Views
import { FacultyDashboard } from './components/faculty/FacultyDashboard';

// Admin Portal Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CourseManagement } from './components/admin/CourseManagement';
import { FacultyManagement } from './components/admin/FacultyManagement';
import { AdminReports } from './components/admin/AdminReports';

const AppContent: React.FC = () => {
  const { activeView, userRole } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      // Landing & Authentication
      case 'landing':
        return <LandingPage />;
      case 'student-login':
        return <StudentLogin />;
      case 'student-register':
        return <StudentRegister />;
      case 'faculty-login':
        return <FacultyLogin />;
      case 'faculty-register':
        return <FacultyRegister />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-register':
        return <AdminRegister />;

      // Faculty Views (Role-protected: Only logged-in Faculty can access)
      case 'faculty-dashboard':
        return userRole === 'faculty' ? <FacultyDashboard /> : <FacultyLogin />;

      // Student Views (Role-protected: Only logged-in Students can access)
      case 'student-dashboard':
        return userRole === 'student' ? <StudentDashboard /> : <StudentLogin />;
      case 'give-feedback':
        return userRole === 'student' ? <FeedbackForm /> : <StudentLogin />;
      case 'my-feedback':
        return userRole === 'student' ? <MyFeedback /> : <StudentLogin />;
      case 'courses':
        return <CourseCatalog />;
      case 'guidelines':
        return <Guidelines />;

      // Admin Views (Role-protected: Only logged-in Admins can access)
      case 'admin-dashboard':
        return userRole === 'admin' ? <AdminDashboard /> : <AdminLogin />;
      case 'admin-courses':
        return userRole === 'admin' ? <CourseManagement /> : <AdminLogin />;
      case 'admin-faculty':
        return userRole === 'admin' ? <FacultyManagement /> : <AdminLogin />;
      case 'admin-reports':
        return userRole === 'admin' ? <AdminReports /> : <AdminLogin />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FB] text-slate-800 antialiased selection:bg-[#173B6C] selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
