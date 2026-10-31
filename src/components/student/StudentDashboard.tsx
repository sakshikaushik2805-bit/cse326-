import React from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  MessageSquarePlus, 
  FileText, 
  BookOpen, 
  Compass, 
  ArrowRight, 
  Star,
  Award,
  ChevronRight
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser, courses, faculty, feedbacks, setActiveView } = useApp();
  const student = currentUser as Student;

  if (!student) return null;

  // Calculate student stats
  const studentSubmissions = feedbacks.filter(fb => fb.studentId === student.id || fb.studentId === student.studentId);
  const submittedCourseIds = new Set(studentSubmissions.map(fb => fb.courseId));

  const totalCourses = courses.length;
  const submittedCount = submittedCourseIds.size;
  const pendingCount = Math.max(0, totalCourses - submittedCount);
  const completionRate = totalCourses > 0 ? Math.round((submittedCount / totalCourses) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Student Profile Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-100/50 to-teal-50/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#173B6C] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              {student.fullName.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Student Portal · Active Term
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-mono">ID: {student.studentId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
                Welcome back, {student.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {student.program} · <span className="font-medium text-slate-800">{student.semester}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('give-feedback')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4 text-teal-300" />
              <span>Evaluate Course Faculty</span>
            </button>
            <button
              onClick={() => setActiveView('my-feedback')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              My Submissions ({submittedCount})
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-medium">Term Evaluation Progress</span>
            <span className="font-bold text-[#173B6C] tabular-nums">{completionRate}% Completed</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#173B6C] to-[#14B8A6] rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#173B6C] flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Available Courses</span>
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">{totalCourses}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Feedback Submitted</span>
            <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">{submittedCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">Pending Evaluations</span>
            <span className="text-2xl font-extrabold text-amber-700 tabular-nums">{pendingCount}</span>
          </div>
        </div>

      </div>

      {/* 4 Action Cards required by prompt */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
          Quick Access Portals
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Give Feedback */}
          <button
            onClick={() => setActiveView('give-feedback')}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#173B6C]/40 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#173B6C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquarePlus className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B6C] transition-colors">
                1. Give Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Complete structured 5-step faculty assessments with star criteria and privacy protection.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#173B6C]">
              <span>Start Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 2: My Feedback */}
          <button
            onClick={() => setActiveView('my-feedback')}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#173B6C]/40 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B6C] transition-colors">
                2. My Feedback
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Review your historical course evaluations, submitted ratings, qualitative notes, and anonymous tags.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#14B8A6]">
              <span>View History ({submittedCount})</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 3: Course Information */}
          <button
            onClick={() => setActiveView('courses')}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#173B6C]/40 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B6C] transition-colors">
                3. Course Information
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Explore syllabus descriptions, credit allocations, and designated faculty instructors.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 4: Feedback Guidelines */}
          <button
            onClick={() => setActiveView('guidelines')}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#173B6C]/40 transition-all text-left group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#173B6C] transition-colors">
                4. Feedback Guidelines
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Learn how constructive evaluations are weighed, objective criteria rubrics, and privacy standards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Read Rubrics</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

        </div>
      </div>

      {/* Courses Evaluation Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Current Semester Course Evaluation List</h3>
            <p className="text-xs text-slate-500">
              Complete an evaluation for each enrolled course before the term deadline
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Term Deadline: <span className="font-semibold text-slate-800">November 30, 2026</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {courses.map(course => {
            const facultyMember = faculty.find(f => f.id === course.facultyId);
            const isSubmitted = submittedCourseIds.has(course.id);
            const submissionRecord = studentSubmissions.find(s => s.courseId === course.id);

            return (
              <div
                key={course.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {course.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{course.name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">({course.credits} Credits)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Assigned Faculty: <span className="font-semibold text-[#173B6C]">{facultyMember?.name || 'Unassigned'}</span> · {course.semester}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {isSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Submitted</span>
                        {submissionRecord && (
                          <span className="text-emerald-700 font-mono tabular-nums">
                            ({submissionRecord.averageRating.toFixed(1)} ★)
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setActiveView('my-feedback')}
                        className="text-xs text-[#315F91] hover:underline font-medium"
                      >
                        View
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveView('give-feedback')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Evaluate Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
