import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { StorageService } from '../../services/storage';
import { BookOpen, Search, CheckCircle2, ChevronRight, User, Layers, ArrowLeft } from 'lucide-react';

export const CourseCatalog: React.FC = () => {
  const { currentUser, userRole, courses, faculty, setActiveView } = useApp();
  const student = currentUser as Student;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All');

  const semesters = ['All', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'];

  const filtered = courses.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = selectedSemester === 'All' || c.semester === selectedSemester;
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveView(userRole === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#173B6C] tracking-tight">
            Academic Course Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Official curriculum listings, syllabi objectives, and assigned faculty instructors
          </p>
        </div>

        {userRole === 'student' && (
          <button
            onClick={() => setActiveView('give-feedback')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-colors shadow-sm self-start sm:self-center"
          >
            Give Faculty Feedback
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by course code, name, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Semester:</span>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
          >
            {semesters.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => {
          const facultyMember = faculty.find(f => f.id === course.facultyId);
          const isSubmitted =
            userRole === 'student' && student
              ? StorageService.hasStudentSubmittedCourse(student.id || student.studentId, course.id, course.semester)
              : false;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="px-2.5 py-1 bg-blue-50 text-[#173B6C] font-mono text-xs font-bold rounded-md border border-blue-200">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {course.credits} Credits
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.department} · {course.semester}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Faculty badge */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                      Faculty Instructor
                    </span>
                    <span className="text-xs font-bold text-[#173B6C] block">
                      {facultyMember ? facultyMember.name : 'Unassigned'}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {facultyMember?.title || ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {userRole === 'student' ? (
                  isSubmitted ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Feedback Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveView('give-feedback')}
                      className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Evaluate This Course</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )
                ) : (
                  <span className="text-slate-400 text-[11px]">
                    Academic Year 2026-2027
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
