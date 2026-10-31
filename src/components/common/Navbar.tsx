import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Shield, User, LogOut, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, userRole, activeView, setActiveView, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicPage = [
    'landing',
    'student-login',
    'student-register',
    'admin-login',
    'admin-register',
    'faculty-login',
    'faculty-register',
  ].includes(activeView);

  const getDashboardView = () => {
    if (userRole === 'student') return 'student-dashboard';
    if (userRole === 'faculty') return 'faculty-dashboard';
    if (userRole === 'admin') return 'admin-dashboard';
    return 'landing';
  };

  const getUserDisplayName = () => {
    if (!currentUser) return '';
    return (currentUser as any).name || (currentUser as any).fullName || '';
  };

  const getUserSubtitle = () => {
    if (userRole === 'faculty') return `Faculty · ${(currentUser as any).facultyId || 'Instructor'}`;
    if (userRole === 'student') return `Student · ${(currentUser as any).studentId || 'Enrolled'}`;
    if (userRole === 'admin') return 'Administrator';
    return '';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveView(getDashboardView())}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#173B6C] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#173B6C] block leading-none">
                Sensus
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase block mt-0.5">
                Feedback & Evaluation
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {isPublicPage ? (
              <>
                <button
                  onClick={() => setActiveView('landing')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'landing' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Home
                </button>
                <a
                  href="#about"
                  onClick={() => {
                    if (activeView !== 'landing') setActiveView('landing');
                  }}
                  className="hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0"
                >
                  About
                </a>
                <a
                  href="#features"
                  onClick={() => {
                    if (activeView !== 'landing') setActiveView('landing');
                  }}
                  className="hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => {
                    if (activeView !== 'landing') setActiveView('landing');
                  }}
                  className="hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0"
                >
                  How It Works
                </a>
              </>
            ) : userRole === 'faculty' ? (
              <>
                <button
                  onClick={() => setActiveView('faculty-dashboard')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'faculty-dashboard' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  My Analytics & Feedback
                </button>
                <button
                  onClick={() => setActiveView('courses')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'courses' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Course Catalog
                </button>
                <button
                  onClick={() => setActiveView('guidelines')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'guidelines' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Evaluation Rubric
                </button>
              </>
            ) : userRole === 'student' ? (
              <>
                <button
                  onClick={() => setActiveView('student-dashboard')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'student-dashboard' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('give-feedback')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'give-feedback' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Evaluate Faculty
                </button>
                <button
                  onClick={() => setActiveView('my-feedback')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'my-feedback' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  My Submissions
                </button>
                <button
                  onClick={() => setActiveView('courses')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'courses' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveView('guidelines')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'guidelines' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Guidelines
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveView('admin-dashboard')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'admin-dashboard' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Analytics Overview
                </button>
                <button
                  onClick={() => setActiveView('admin-courses')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'admin-courses' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Courses
                </button>
                <button
                  onClick={() => setActiveView('admin-faculty')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'admin-faculty' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Faculty Directory
                </button>
                <button
                  onClick={() => setActiveView('admin-reports')}
                  className={`hover:text-[#173B6C] transition-colors whitespace-nowrap shrink-0 ${
                    activeView === 'admin-reports' ? 'text-[#173B6C] font-semibold' : ''
                  }`}
                >
                  Reports & Export
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: Primary Action / User Profile */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {getUserSubtitle()}
                  </div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('student-login')}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Student Login
                </button>
                <button
                  onClick={() => setActiveView('faculty-login')}
                  className="px-3 py-2 text-xs font-medium text-[#173B6C] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Faculty Portal
                </button>
                <button
                  onClick={() => setActiveView('admin-login')}
                  className="px-3 py-2 text-xs font-medium text-white bg-[#173B6C] hover:bg-[#122e54] rounded-lg transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {currentUser ? (
            <div className="pb-3 border-b border-slate-100 mb-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-slate-800">{getUserDisplayName()}</p>
                <p className="text-xs text-slate-500">{getUserSubtitle()}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 text-xs text-red-600 bg-red-50 rounded-md font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : null}

          {isPublicPage ? (
            <>
              <button
                onClick={() => {
                  setActiveView('landing');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveView('student-login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Student Login
              </button>
              <button
                onClick={() => {
                  setActiveView('faculty-login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-[#14B8A6] font-semibold"
              >
                Faculty Portal
              </button>
              <button
                onClick={() => {
                  setActiveView('student-register');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Student Registration
              </button>
              <button
                onClick={() => {
                  setActiveView('admin-login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-[#173B6C] font-semibold"
              >
                Administrator Portal
              </button>
            </>
          ) : userRole === 'faculty' ? (
            <>
              <button
                onClick={() => {
                  setActiveView('faculty-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-[#173B6C] font-semibold"
              >
                My Feedback & Analytics
              </button>
              <button
                onClick={() => {
                  setActiveView('courses');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Course Catalog
              </button>
              <button
                onClick={() => {
                  setActiveView('guidelines');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Evaluation Rubrics
              </button>
            </>
          ) : userRole === 'student' ? (
            <>
              <button
                onClick={() => {
                  setActiveView('student-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('give-feedback');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Give Feedback
              </button>
              <button
                onClick={() => {
                  setActiveView('my-feedback');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                My Feedback
              </button>
              <button
                onClick={() => {
                  setActiveView('courses');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Course Information
              </button>
              <button
                onClick={() => {
                  setActiveView('guidelines');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Feedback Guidelines
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setActiveView('admin-dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Analytics Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('admin-courses');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Course Management
              </button>
              <button
                onClick={() => {
                  setActiveView('admin-faculty');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Faculty Management
              </button>
              <button
                onClick={() => {
                  setActiveView('admin-reports');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-slate-700 hover:text-[#173B6C]"
              >
                Reports & Export
              </button>
            </>
          )}


        </div>
      )}
    </header>
  );
};
