import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storage';
import { 
  FileSpreadsheet, 
  Download, 
  Award, 
  Star, 
  TrendingUp, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { feedbacks, courses, faculty, showNotification, setActiveView } = useApp();

  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Filter feedbacks by term
  const termFeedbacks = useMemo(() => {
    return selectedSemester === 'ALL'
      ? feedbacks
      : feedbacks.filter(f => f.semester === selectedSemester);
  }, [feedbacks, selectedSemester]);

  // Aggregated faculty summary
  const facultySummary = useMemo(() => {
    return faculty.map(fac => {
      const records = termFeedbacks.filter(f => f.facultyId === fac.id);
      const count = records.length;
      const overallAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.averageRating, 0) / count).toFixed(2))
        : 0;

      const teachingAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.teachingQuality, 0) / count).toFixed(2))
        : 0;

      const knowledgeAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.subjectKnowledge, 0) / count).toFixed(2))
        : 0;

      const commsAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.communicationSkills, 0) / count).toFixed(2))
        : 0;

      const doubtsAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.doubtResolution, 0) / count).toFixed(2))
        : 0;

      const engagementAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.classroomEngagement, 0) / count).toFixed(2))
        : 0;

      return {
        id: fac.id,
        name: fac.name,
        department: fac.department,
        count,
        overallAvg,
        teachingAvg,
        knowledgeAvg,
        commsAvg,
        doubtsAvg,
        engagementAvg,
      };
    }).sort((a, b) => b.overallAvg - a.overallAvg);
  }, [faculty, termFeedbacks]);

  // Aggregated course summary
  const courseSummary = useMemo(() => {
    return courses.map(c => {
      const records = termFeedbacks.filter(f => f.courseId === c.id);
      const count = records.length;
      const overallAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.averageRating, 0) / count).toFixed(2))
        : 0;
      const contentAvg = count > 0
        ? Number((records.reduce((a, b) => a + b.ratings.courseContentQuality, 0) / count).toFixed(2))
        : 0;
      const fac = faculty.find(f => f.id === c.facultyId);

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        facultyName: fac?.name || 'Unassigned',
        semester: c.semester,
        count,
        overallAvg,
        contentAvg,
      };
    }).sort((a, b) => b.overallAvg - a.overallAvg);
  }, [courses, termFeedbacks, faculty]);

  const handleDownloadCSV = () => {
    StorageService.exportFeedbackToCSV(termFeedbacks);
    showNotification('success', 'CSV Generated', `Exported ${termFeedbacks.length} feedback evaluation rows.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
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
            Institutional Evaluation Reports & Accreditation Dossier
          </h1>
          <p className="text-xs text-slate-500">
            Export official academic accreditation files and review multi-dimensional faculty scorecards
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
        >
          <Download className="w-4 h-4 text-teal-300" />
          <span>Download Official CSV Spreadsheet</span>
        </button>
      </div>

      {/* Filter and Highlights Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-600">Filter Term:</span>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="py-1 px-3 bg-slate-50 border border-slate-300 rounded-lg text-xs"
          >
            <option value="ALL">All Semesters (Aggregate)</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 4">Semester 4</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 6">Semester 6</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Active Records: <strong>{termFeedbacks.length}</strong></span>
          <span>·</span>
          <span>Accreditation Standard: <strong>ABET / NAAC Criterion 3</strong></span>
        </div>
      </div>

      {/* Faculty Aggregated Evaluation Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Faculty Performance Index & Rubric Breakdown</h3>
          <p className="text-xs text-slate-500">
            Ranked by overall composite score across all evaluated sections
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Rank</th>
                <th className="py-2.5 px-3 font-semibold">Faculty Name</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold text-center">Reviews</th>
                <th className="py-2.5 px-3 font-semibold text-center">Overall</th>
                <th className="py-2.5 px-3 font-semibold text-center">Teaching</th>
                <th className="py-2.5 px-3 font-semibold text-center">Knowledge</th>
                <th className="py-2.5 px-3 font-semibold text-center">Comms</th>
                <th className="py-2.5 px-3 font-semibold text-center">Doubts</th>
                <th className="py-2.5 px-3 font-semibold text-center">Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {facultySummary.map((fac, idx) => (
                <tr key={fac.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">
                    #{idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-[#173B6C] whitespace-nowrap">
                    {fac.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {fac.department.replace('Department of ', '')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {fac.count}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 bg-amber-50/50">
                    {fac.overallAvg > 0 ? `${fac.overallAvg.toFixed(2)} ★` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {fac.teachingAvg > 0 ? fac.teachingAvg.toFixed(2) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {fac.knowledgeAvg > 0 ? fac.knowledgeAvg.toFixed(2) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {fac.commsAvg > 0 ? fac.commsAvg.toFixed(2) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {fac.doubtsAvg > 0 ? fac.doubtsAvg.toFixed(2) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {fac.engagementAvg > 0 ? fac.engagementAvg.toFixed(2) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Quality Index Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Course Syllabus & Curriculum Satisfaction Index</h3>
          <p className="text-xs text-slate-500">
            Evaluation of course syllabus relevance and student engagement by subject
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Course Code & Title</th>
                <th className="py-2.5 px-3 font-semibold">Designated Faculty</th>
                <th className="py-2.5 px-3 font-semibold">Semester</th>
                <th className="py-2.5 px-3 font-semibold text-center">Submissions</th>
                <th className="py-2.5 px-3 font-semibold text-center">Course Rating</th>
                <th className="py-2.5 px-3 font-semibold text-center">Content Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseSummary.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <span className="font-mono text-[#173B6C] mr-2">{c.code}</span>
                    <span>{c.name}</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#173B6C] font-medium">
                    {c.facultyName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {c.semester}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {c.count} logs
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                    {c.overallAvg > 0 ? `${c.overallAvg.toFixed(2)} ★` : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-teal-700">
                    {c.contentAvg > 0 ? `${c.contentAvg.toFixed(2)} ★` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
