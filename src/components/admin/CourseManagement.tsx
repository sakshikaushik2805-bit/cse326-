import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  UserCheck, 
  Layers,
  ArrowLeft 
} from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const { courses, faculty, feedbacks, refreshData, showNotification, setActiveView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formFacultyId, setFormFacultyId] = useState('');
  const [formSemester, setFormSemester] = useState('Semester 5');
  const [formDepartment, setFormDepartment] = useState('Computer Science');
  const [formCredits, setFormCredits] = useState<number>(4);
  const [formDescription, setFormDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const departments = ['Computer Science', 'Information Technology', 'Electronics & Comm.', 'Data Science', 'Basic Sciences'];

  const openAddModal = () => {
    setEditingCourse(null);
    setFormCode('');
    setFormName('');
    setFormFacultyId(faculty[0]?.id || '');
    setFormSemester('Semester 5');
    setFormDepartment('Computer Science');
    setFormCredits(4);
    setFormDescription('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormCode(c.code);
    setFormName(c.name);
    setFormFacultyId(c.facultyId);
    setFormSemester(c.semester);
    setFormDepartment(c.department);
    setFormCredits(c.credits);
    setFormDescription(c.description);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formCode.trim()) {
      setFormError('Please enter a course code (e.g. CS501).');
      return;
    }
    if (!formName.trim()) {
      setFormError('Please enter the full course name.');
      return;
    }
    if (!formFacultyId) {
      setFormError('Please assign a faculty member to this course.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Please enter a brief course syllabus description.');
      return;
    }

    if (editingCourse) {
      const res = StorageService.updateCourse({
        ...editingCourse,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        facultyId: formFacultyId,
        semester: formSemester,
        department: formDepartment,
        credits: Number(formCredits),
        description: formDescription.trim(),
      });
      if (res.success) {
        refreshData();
        setIsAddModalOpen(false);
        showNotification('success', 'Course Updated', `Course ${formCode.toUpperCase()} was updated.`);
      } else {
        setFormError(res.message);
      }
    } else {
      const res = StorageService.addCourse({
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        facultyId: formFacultyId,
        semester: formSemester,
        department: formDepartment,
        credits: Number(formCredits),
        description: formDescription.trim(),
      });
      if (res.success) {
        refreshData();
        setIsAddModalOpen(false);
        showNotification('success', 'Course Created', `Course ${formCode.toUpperCase()} was added to the catalog.`);
      } else {
        setFormError(res.message);
      }
    }
  };

  const confirmDelete = (courseId: string) => {
    const res = StorageService.deleteCourse(courseId);
    if (res.success) {
      refreshData();
      setDeletingCourseId(null);
      showNotification('success', 'Course Deleted', res.message);
    } else {
      showNotification('error', 'Delete Failed', res.message);
    }
  };

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveView('admin-dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#173B6C] tracking-tight">
            Course Catalog Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, update, and manage official university courses and faculty assignments
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by code, course name, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
          />
        </div>

        <span className="text-xs text-slate-500 tabular-nums">
          Total: <strong>{courses.length}</strong> courses
        </span>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                <th className="py-3 px-4 font-semibold">Course Code & Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Faculty</th>
                <th className="py-3 px-4 font-semibold">Semester</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold text-center">Credits</th>
                <th className="py-3 px-4 font-semibold text-center">Evaluations</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(course => {
                const fac = faculty.find(f => f.id === course.facultyId);
                const evalCount = feedbacks.filter(fb => fb.courseId === course.id).length;

                return (
                  <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#173B6C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {course.code}
                        </span>
                        <span>{course.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#173B6C] font-medium">
                      {fac ? fac.name : <span className="text-amber-600 italic">Unassigned</span>}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {course.semester}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {course.department}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                      {course.credits}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 tabular-nums">
                      {evalCount} logs
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 text-slate-500 hover:text-[#173B6C] hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Course"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingCourseId(course.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#173B6C] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingCourse ? `Edit Course: ${editingCourse.code}` : 'Add New Academic Course'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    placeholder="e.g. CS201"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 font-mono uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Credits *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formCredits}
                    onChange={e => setFormCredits(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Title / Name *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Faculty Instructor *
                </label>
                <select
                  value={formFacultyId}
                  onChange={e => setFormFacultyId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  required
                >
                  <option value="">Select Faculty...</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formSemester}
                    onChange={e => setFormSemester(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={formDepartment}
                    onChange={e => setFormDepartment(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Description / Syllabus Objectives *
                </label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Summarize course goals, core topics, and laboratory components..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-lg shadow-sm"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Confirmation Dialog before Delete (Required by prompt) */}
      {deletingCourseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Course Removal</h3>
              <p className="text-slate-500">
                Are you sure you want to delete this course? This action will remove the course mapping from the catalog.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourseId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deletingCourseId)}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
