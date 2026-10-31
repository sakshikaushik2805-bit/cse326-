import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Faculty, FeedbackSubmission } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Star, 
  Award, 
  BookOpen, 
  Users, 
  Download, 
  Filter, 
  Search, 
  Lock, 
  User, 
  Eye, 
  CheckCircle2, 
  MessageSquare, 
  Calendar, 
  Mail, 
  MapPin, 
  X,
  TrendingUp,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { currentUser, userRole, courses, feedbacks, showNotification } = useApp();
  const faculty = currentUser as Faculty;

  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('ALL');
  const [selectedFeedbackModal, setSelectedFeedbackModal] = useState<FeedbackSubmission | null>(null);

  // STRICT ACCESS CONTROL:
  // Faculty members MUST ONLY see evaluations belonging to their unique faculty ID.
  const myFeedbacks = useMemo(() => {
    if (!faculty || userRole !== 'faculty') return [];
    return feedbacks.filter(fb => fb.facultyId === faculty.id);
  }, [feedbacks, faculty, userRole]);

  // My assigned courses
  const myCourses = useMemo(() => {
    if (!faculty) return [];
    return courses.filter(c => c.facultyId === faculty.id);
  }, [courses, faculty]);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return myFeedbacks.filter(fb => {
      const matchCourse = selectedCourseFilter === 'ALL' || fb.courseId === selectedCourseFilter;
      
      let matchRating = true;
      if (selectedRatingFilter === '5') matchRating = fb.averageRating >= 4.5;
      else if (selectedRatingFilter === '4') matchRating = fb.averageRating >= 3.5 && fb.averageRating < 4.5;
      else if (selectedRatingFilter === '3') matchRating = fb.averageRating >= 2.5 && fb.averageRating < 3.5;
      else if (selectedRatingFilter === 'below3') matchRating = fb.averageRating < 2.5;

      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        fb.courseName.toLowerCase().includes(q) ||
        fb.courseCode.toLowerCase().includes(q) ||
        fb.likedAspects.toLowerCase().includes(q) ||
        fb.improvements.toLowerCase().includes(q);

      return matchCourse && matchRating && matchSearch;
    });
  }, [myFeedbacks, selectedCourseFilter, selectedRatingFilter, searchTerm]);

  // Metric aggregates (Strictly scoped to this faculty)
  const totalReviews = myFeedbacks.length;
  
  const overallAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.averageRating, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  const teachingAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.ratings.teachingQuality, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  const knowledgeAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.ratings.subjectKnowledge, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  const commsAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.ratings.communicationSkills, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  const doubtsAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.ratings.doubtResolution, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  const engagementAvg = useMemo(() => {
    if (myFeedbacks.length === 0) return 0;
    const sum = myFeedbacks.reduce((acc, f) => acc + f.ratings.classroomEngagement, 0);
    return Number((sum / myFeedbacks.length).toFixed(2));
  }, [myFeedbacks]);

  if (!faculty || userRole !== 'faculty') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Access Denied. Please log in through the Faculty Portal.
      </div>
    );
  }

  // Export CSV scoped strictly to this faculty member
  const handleExportMyCSV = () => {
    StorageService.exportFeedbackToCSV(filteredFeedbacks);
    showNotification('success', 'Export Complete', `Exported ${filteredFeedbacks.length} personal feedback evaluations.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Faculty Profile Hero Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-100/40 to-blue-50/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {faculty.avatarUrl ? (
              <img
                src={faculty.avatarUrl}
                alt={faculty.name}
                className="w-16 h-16 rounded-2xl object-cover shadow-md border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[#173B6C] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                {faculty.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  Faculty Portal · Individual Evaluation Dossier
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-mono font-bold">Faculty ID: {faculty.facultyId}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight">
                {faculty.name}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-600">
                {faculty.title} · <span className="font-medium text-slate-800">{faculty.department}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{faculty.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{faculty.office}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <button
              onClick={handleExportMyCSV}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>Export My Evaluations (CSV)</span>
            </button>
          </div>
        </div>

        {/* Security & Access Isolation Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-teal-800 bg-teal-50/60 p-3 rounded-xl border border-teal-200">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Isolated Faculty View:</strong> You are viewing feedback specifically mapped to your unique faculty ID (<span className="font-mono">{faculty.facultyId}</span>). Feedback for other professors is strictly restricted to department chairs and administrators.
          </span>
        </div>
      </div>

      {/* KPI Cards: My Performance Dimensions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* 1. Overall Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">My Overall Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#173B6C] tabular-nums font-mono">
              {overallAvg.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Across {totalReviews} evaluations</span>
        </div>

        {/* 2. Teaching Quality */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Teaching Quality</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {teachingAvg.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block">Pacing & Clarity</span>
        </div>

        {/* 3. Subject Knowledge */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Subject Mastery</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {knowledgeAvg.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-blue-600 font-medium block">Technical Depth</span>
        </div>

        {/* 4. Communication Skills */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Communication</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {commsAvg.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Articulation</span>
        </div>

        {/* 5. Doubt Resolution */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Doubt Resolution</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {doubtsAvg.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Office Hour Help</span>
        </div>

        {/* 6. Total Reviews */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Total Reviews</span>
          <span className="text-2xl font-extrabold text-teal-700 tabular-nums font-mono">
            {totalReviews}
          </span>
          <span className="text-[10px] text-teal-600 font-medium block">Student Submissions</span>
        </div>

      </div>

      {/* My Courses Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Assigned Courses</h3>
            <p className="text-xs text-slate-500">
              Active courses assigned to you for teaching and evaluation this term
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium tabular-nums">
            {myCourses.length} Assigned Course(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map(course => {
            const courseFeedbacks = myFeedbacks.filter(f => f.courseId === course.id);
            const courseAvg = courseFeedbacks.length > 0
              ? (courseFeedbacks.reduce((a, b) => a + b.averageRating, 0) / courseFeedbacks.length).toFixed(2)
              : '0.00';

            return (
              <div
                key={course.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-[#173B6C] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-mono tabular-nums">
                    {courseAvg} ★
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {course.name}
                </h4>

                <p className="text-xs text-slate-500">
                  {course.semester} · {course.credits} Credits · {courseFeedbacks.length} student review(s)
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 italic">
                  "{course.description}"
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Feedback Registry for this Faculty */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Feedback & Evaluations</h3>
            <p className="text-xs text-slate-500">
              Read constructive student reviews and pedagogical insights
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Filter by course */}
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="ALL">All My Courses</option>
              {myCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>

            {/* Filter by rating */}
            <select
              value={selectedRatingFilter}
              onChange={e => setSelectedRatingFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="ALL">All Ratings</option>
              <option value="5">Excellent (5 Stars)</option>
              <option value="4">Very Good (4 Stars)</option>
              <option value="3">Average (3 Stars)</option>
            </select>
          </div>
        </div>

        {/* Live Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search written feedback comments..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
          />
        </div>

        {/* Feedback Cards List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            No feedback entries match your active filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map(fb => (
              <div
                key={fb.id}
                className="p-5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#173B6C] bg-white px-2 py-0.5 rounded border border-slate-200">
                      {fb.courseCode}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {fb.courseName}
                    </span>
                    <span className="text-slate-400 text-xs">·</span>
                    <span className="text-slate-500 text-xs">{fb.semester}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 text-xs font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{fb.averageRating.toFixed(2)} ★</span>
                    </div>

                    {/* Anonymous Protection: NEVER reveal student identity if marked anonymous! */}
                    {fb.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        <Lock className="w-3 h-3 text-teal-600" />
                        <span>Anonymous Student</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        <User className="w-3 h-3 text-slate-500" />
                        <span>{fb.studentName}</span>
                      </span>
                    )}

                    <span className="text-slate-400 text-[11px] font-mono">
                      {new Date(fb.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Rating Criteria Mini Badges */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Teaching</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.teachingQuality} / 5</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Knowledge</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.subjectKnowledge} / 5</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Comms</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.communicationSkills} / 5</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Doubts</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.doubtResolution} / 5</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Engagement</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.classroomEngagement} / 5</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-slate-400 block text-[10px]">Content</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.courseContentQuality} / 5</span>
                  </div>
                </div>

                {/* Qualitative Feedback Text */}
                <div className="space-y-2 pt-1 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">What Worked Well:</span>
                    <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-0.5">
                      "{fb.likedAspects}"
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Recommended Areas for Improvement:</span>
                    <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-0.5">
                      "{fb.improvements}"
                    </p>
                  </div>

                  {fb.additionalComments && (
                    <div>
                      <span className="font-semibold text-slate-700 block text-[11px]">Additional Observations:</span>
                      <p className="text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-0.5">
                        "{fb.additionalComments}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setSelectedFeedbackModal(fb)}
                    className="text-xs font-semibold text-[#173B6C] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Full Evaluation Modal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal View for Inspection */}
      {selectedFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#173B6C] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Student Evaluation Record</h3>
                <p className="text-xs text-blue-100 font-mono">
                  {selectedFeedbackModal.courseCode} — {selectedFeedbackModal.courseName}
                </p>
              </div>
              <button
                onClick={() => setSelectedFeedbackModal(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[11px] block">Student Identity:</span>
                  <span className="font-bold text-slate-900">
                    {selectedFeedbackModal.isAnonymous ? '🔒 Anonymous Student (Shielded)' : `👤 ${selectedFeedbackModal.studentName}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[11px] block">Overall Rating:</span>
                  <span className="text-base font-bold text-[#173B6C] font-mono tabular-nums">
                    {selectedFeedbackModal.averageRating.toFixed(2)} / 5.0 ★
                  </span>
                </div>
              </div>

              {/* Criteria */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Criterion Scoring Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Teaching Quality</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.teachingQuality} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Subject Knowledge</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.subjectKnowledge} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Communication</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.communicationSkills} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Doubt Resolution</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.doubtResolution} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Engagement</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.classroomEngagement} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Course Content</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.courseContentQuality} / 5 ★</span>
                  </div>
                </div>
              </div>

              {/* Qualitative */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Strengths:</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic mt-1">
                    "{selectedFeedbackModal.likedAspects}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Improvements:</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic mt-1">
                    "{selectedFeedbackModal.improvements}"
                  </p>
                </div>

                {selectedFeedbackModal.additionalComments && (
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">Additional Feedback:</span>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic mt-1">
                      "{selectedFeedbackModal.additionalComments}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 text-slate-400 text-[11px] flex justify-between">
                <span>Timestamp: {new Date(selectedFeedbackModal.submittedAt).toLocaleString()}</span>
                <span>Term: {selectedFeedbackModal.semester}</span>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFeedbackModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
