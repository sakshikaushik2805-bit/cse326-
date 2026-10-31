import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Faculty, Course } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Mail, 
  MapPin, 
  BookOpen, 
  Star, 
  X, 
  AlertCircle,
  ArrowLeft 
} from 'lucide-react';

export const FacultyManagement: React.FC = () => {
  const { faculty, courses, feedbacks, refreshData, showNotification, setActiveView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFacultyId, setDeletingFacultyId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formTitle, setFormTitle] = useState('Assistant Professor');
  const [formDepartment, setFormDepartment] = useState('Department of Computer Science & Engineering');
  const [formEmail, setFormEmail] = useState('');
  const [formOffice, setFormOffice] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const titles = [
    'Assistant Professor',
    'Associate Professor',
    'Professor',
    'Professor & Head of Department',
    'Adjunct Lecturer',
  ];

  const departments = [
    'Department of Computer Science & Engineering',
    'Department of Information Technology',
    'Department of Electronics & Communication',
    'Department of Cloud Computing & DevOps',
    'Department of Artificial Intelligence & Data Science',
  ];

  const openAddModal = () => {
    setEditingFaculty(null);
    setFormName('');
    setFormTitle('Assistant Professor');
    setFormDepartment('Department of Computer Science & Engineering');
    setFormEmail('');
    setFormOffice('');
    setFormBio('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (f: Faculty) => {
    setEditingFaculty(f);
    setFormName(f.name);
    setFormTitle(f.title);
    setFormDepartment(f.department);
    setFormEmail(f.email);
    setFormOffice(f.office);
    setFormBio(f.bio);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError('Please enter the faculty member name.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setFormError('Please enter a valid academic email address.');
      return;
    }
    if (!formOffice.trim()) {
      setFormError('Please enter an office/room location.');
      return;
    }

    if (editingFaculty) {
      const res = StorageService.updateFaculty({
        ...editingFaculty,
        name: formName.trim(),
        title: formTitle,
        department: formDepartment,
        email: formEmail.trim().toLowerCase(),
        office: formOffice.trim(),
        bio: formBio.trim(),
      });
      if (res.success) {
        refreshData();
        setIsAddModalOpen(false);
        showNotification('success', 'Faculty Updated', `${formName} profile updated.`);
      } else {
        setFormError(res.message);
      }
    } else {
      const res = StorageService.addFaculty({
        name: formName.trim(),
        title: formTitle,
        department: formDepartment,
        email: formEmail.trim().toLowerCase(),
        office: formOffice.trim(),
        bio: formBio.trim(),
      });
      if (res.success) {
        refreshData();
        setIsAddModalOpen(false);
        showNotification('success', 'Faculty Added', `${formName} added to directory.`);
      } else {
        setFormError(res.message);
      }
    }
  };

  const confirmDelete = (facultyId: string) => {
    const res = StorageService.deleteFaculty(facultyId);
    if (res.success) {
      refreshData();
      setDeletingFacultyId(null);
      showNotification('success', 'Faculty Removed', res.message);
    } else {
      setDeletingFacultyId(null);
      showNotification('error', 'Cannot Delete Faculty', res.message);
    }
  };

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            Faculty Directory & Teaching Assignments
          </h1>
          <p className="text-xs text-slate-500">
            Manage academic instructors, course allocations, and teaching evaluation records
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 text-teal-300" />
          <span>Register Faculty Member</span>
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
            placeholder="Search by faculty name, department, or email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
          />
        </div>

        <span className="text-xs text-slate-500 tabular-nums">
          Total: <strong>{faculty.length}</strong> professors
        </span>
      </div>

      {/* Faculty Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(member => {
          // Find assigned courses
          const assignedCourses = courses.filter(c => c.facultyId === member.id);
          
          // Calculate average rating
          const facFeedbacks = feedbacks.filter(fb => fb.facultyId === member.id);
          const feedbackCount = facFeedbacks.length;
          const avgScore = feedbackCount > 0
            ? (facFeedbacks.reduce((a, b) => a + b.averageRating, 0) / feedbackCount).toFixed(2)
            : '0.00';

          return (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#173B6C] flex items-center justify-center font-bold text-base shadow-sm">
                      {member.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-500">{member.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-mono text-xs font-bold border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{avgScore}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5 tabular-nums">
                      {feedbackCount} reviews
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p className="text-xs text-[#173B6C] font-semibold">
                    {member.department}
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.office}</span>
                  </p>
                </div>

                {/* Assigned Courses Section */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Assigned Courses ({assignedCourses.length}):
                  </span>
                  {assignedCourses.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">No courses currently assigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedCourses.map(c => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 bg-blue-50 text-[#173B6C] rounded text-[11px] font-mono font-medium border border-blue-200"
                        >
                          {c.code}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {member.bio && (
                  <p className="text-xs text-slate-500 line-clamp-2 italic pt-1">
                    "{member.bio}"
                  </p>
                )}

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Faculty ID: {member.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1.5 text-slate-500 hover:text-[#173B6C] hover:bg-slate-100 rounded-md transition-colors"
                    title="Edit Faculty Information"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingFacultyId(member.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove Faculty Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add / Edit Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#173B6C] text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingFaculty ? `Edit Faculty: ${editingFaculty.name}` : 'Register New Faculty Member'}
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
                    Faculty Full Name *
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Dr. Anand Verma"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Title *
                  </label>
                  <select
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                  >
                    {titles.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department *
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="e.g. anand.v@university.edu"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Office / Room Location *
                  </label>
                  <input
                    type="text"
                    value={formOffice}
                    onChange={e => setFormOffice(e.target.value)}
                    placeholder="e.g. Block C, Room 302"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty Bio & Research Specialization
                </label>
                <textarea
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  rows={3}
                  placeholder="Summary of research areas, years of teaching, and academic leadership..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
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
                  {editingFaculty ? 'Save Profile' : 'Register Faculty'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Confirmation Dialog before Delete (Required by prompt) */}
      {deletingFacultyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Faculty Member Removal</h3>
              <p className="text-slate-500">
                Are you sure you want to remove this faculty member? If they have active course assignments, the system will prevent deletion until courses are reassigned.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFacultyId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deletingFacultyId)}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
