import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, FeedbackSubmission } from '../../types';
import { 
  FileText, 
  Star, 
  Calendar, 
  User, 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  Eye, 
  Lock, 
  ArrowLeft,
  X
} from 'lucide-react';

export const MyFeedback: React.FC = () => {
  const { currentUser, feedbacks, setActiveView } = useApp();
  const student = currentUser as Student;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);

  if (!student) return null;

  // Filter feedbacks strictly for the logged-in student
  const studentFeedbacks = feedbacks.filter(
    fb => fb.studentId === student.id || fb.studentId === student.studentId
  );

  const filtered = studentFeedbacks.filter(fb =>
    fb.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fb.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveView('student-dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#173B6C] tracking-tight">
            My Submitted Feedback
          </h1>
          <p className="text-xs text-slate-500">
            Records of your course evaluations for the current and prior terms
          </p>
        </div>

        <button
          onClick={() => setActiveView('give-feedback')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-colors shadow-sm self-start sm:self-center"
        >
          + Evaluate Another Course
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by course name, code, or faculty member..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
          />
        </div>

        <div className="text-xs text-slate-500 tabular-nums">
          Showing <strong>{filtered.length}</strong> of {studentFeedbacks.length} submissions
        </div>
      </div>

      {/* Empty State */}
      {studentFeedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-blue-50 text-[#173B6C] rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Evaluations Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              You haven't submitted any course evaluations for this term. Your evaluations help shape academic quality.
            </p>
          </div>
          <button
            onClick={() => setActiveView('give-feedback')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-colors shadow-sm"
          >
            Start First Course Evaluation
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
          No feedback matching "{searchTerm}". Try a different search term.
        </div>
      ) : (
        /* Submission Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(fb => (
            <div
              key={fb.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">
                      {fb.courseCode} · {fb.semester}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {fb.courseName}
                    </h3>
                    <p className="text-xs text-[#173B6C] font-semibold mt-0.5">
                      Faculty: {fb.facultyName}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold font-mono border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{fb.averageRating.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Overall Avg</span>
                  </div>
                </div>

                {/* Rating Criteria Mini Badges */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 block">Teaching</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.teachingQuality} / 5</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 block">Knowledge</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.subjectKnowledge} / 5</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg text-center">
                    <span className="text-[10px] text-slate-500 block">Doubts</span>
                    <span className="font-bold text-slate-800 font-mono">{fb.ratings.doubtResolution} / 5</span>
                  </div>
                </div>

                {/* Preview of written notes */}
                <div className="mt-3 bg-slate-50/60 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-2 italic">
                  "{fb.likedAspects}"
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${
                    fb.isAnonymous 
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {fb.isAnonymous ? <Lock className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span>{fb.isAnonymous ? 'Anonymous' : 'Named'}</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(fb.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedSubmission(fb)}
                  className="text-xs font-semibold text-[#173B6C] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#173B6C] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Feedback Details</h3>
                <p className="text-xs text-blue-100">
                  {selectedSubmission.courseCode} — {selectedSubmission.courseName}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">Faculty Evaluated:</span>
                  <span className="text-sm font-bold text-slate-900">{selectedSubmission.facultyName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[11px]">Average Score:</span>
                  <span className="text-base font-bold text-[#173B6C] font-mono tabular-nums">
                    {selectedSubmission.averageRating.toFixed(2)} / 5.0 ★
                  </span>
                </div>
              </div>

              {/* Criteria List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Criterion Scoring Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Teaching Quality</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.teachingQuality} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Subject Knowledge</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.subjectKnowledge} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Communication Skills</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.communicationSkills} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Doubt Resolution</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.doubtResolution} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Classroom Engagement</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.classroomEngagement} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 text-[10px] block">Course Content</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedSubmission.ratings.courseContentQuality} / 5 ★</span>
                  </div>
                </div>
              </div>

              {/* Qualitative */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Liked Aspects:</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                    "{selectedSubmission.likedAspects}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Recommended Improvements:</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                    "{selectedSubmission.improvements}"
                  </p>
                </div>

                {selectedSubmission.additionalComments && (
                  <div>
                    <span className="font-bold text-slate-800 block text-[11px]">Additional Comments:</span>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                      "{selectedSubmission.additionalComments}"
                    </p>
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Privacy Mode: <strong>{selectedSubmission.isAnonymous ? 'Anonymous' : 'Named'}</strong></span>
                <span>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
              </div>

            </div>

            <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
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
