import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedbackSubmission, Course, Faculty } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Award, 
  Star, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Lock, 
  User, 
  TrendingUp, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { feedbacks, courses, faculty, students, refreshData, showNotification } = useApp();

  // Filters State
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>('ALL');
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>('ALL');
  const [selectedRatingBracket, setSelectedRatingBracket] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'course'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal State for viewing individual feedback details
  const [selectedFeedbackModal, setSelectedFeedbackModal] = useState<FeedbackSubmission | null>(null);

  // Active Chart View Tab
  const [activeChartTab, setActiveChartTab] = useState<'overview' | 'courses' | 'faculty' | 'matrix'>('overview');

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      const matchCourse = selectedCourseFilter === 'ALL' || fb.courseId === selectedCourseFilter;
      const matchFaculty = selectedFacultyFilter === 'ALL' || fb.facultyId === selectedFacultyFilter;
      const matchSemester = selectedSemesterFilter === 'ALL' || fb.semester === selectedSemesterFilter;
      
      let matchRating = true;
      if (selectedRatingBracket === '5') matchRating = fb.averageRating >= 4.5;
      else if (selectedRatingBracket === '4') matchRating = fb.averageRating >= 3.5 && fb.averageRating < 4.5;
      else if (selectedRatingBracket === '3') matchRating = fb.averageRating >= 2.5 && fb.averageRating < 3.5;
      else if (selectedRatingBracket === 'below3') matchRating = fb.averageRating < 2.5;

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        fb.courseName.toLowerCase().includes(q) ||
        fb.courseCode.toLowerCase().includes(q) ||
        fb.facultyName.toLowerCase().includes(q) ||
        fb.likedAspects.toLowerCase().includes(q) ||
        fb.improvements.toLowerCase().includes(q) ||
        (!fb.isAnonymous && fb.studentName.toLowerCase().includes(q));

      return matchCourse && matchFaculty && matchSemester && matchRating && matchSearch;
    });
  }, [feedbacks, selectedCourseFilter, selectedFacultyFilter, selectedSemesterFilter, selectedRatingBracket, searchQuery]);

  // Sorted feedbacks
  const sortedFeedbacks = useMemo(() => {
    return [...filteredFeedbacks].sort((a, b) => {
      if (sortBy === 'date') {
        const diff = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        return sortDirection === 'asc' ? diff : -diff;
      }
      if (sortBy === 'rating') {
        return sortDirection === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating;
      }
      if (sortBy === 'course') {
        const diff = a.courseCode.localeCompare(b.courseCode);
        return sortDirection === 'asc' ? diff : -diff;
      }
      return 0;
    });
  }, [filteredFeedbacks, sortBy, sortDirection]);

  // Aggregate Key Metrics (Required by prompt)
  const totalSubmissions = feedbacks.length;
  const filteredSubmissionsCount = filteredFeedbacks.length;

  const overallAvgRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.averageRating, 0);
    return Number((sum / feedbacks.length).toFixed(2));
  }, [feedbacks]);

  const avgTeachingRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.ratings.teachingQuality, 0);
    return Number((sum / feedbacks.length).toFixed(2));
  }, [feedbacks]);

  const avgCourseRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.ratings.courseContentQuality, 0);
    return Number((sum / feedbacks.length).toFixed(2));
  }, [feedbacks]);

  const totalCourses = courses.length;
  const totalFacultyCount = faculty.length;

  // Completion rate calculation:
  // Estimated as (Total Submissions / (Total Courses * Estimated Enrolled Cohort Size))
  const completionRate = useMemo(() => {
    const studentCount = Math.max(students.length, 12);
    const potentialEvals = totalCourses * studentCount;
    return Math.min(100, Math.round((totalSubmissions / potentialEvals) * 100));
  }, [totalSubmissions, totalCourses, students]);

  // Rating Distribution (1 to 5 Stars)
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredFeedbacks.forEach(f => {
      const rounded = Math.round(f.averageRating);
      if (rounded >= 5) dist[5]++;
      else if (rounded === 4) dist[4]++;
      else if (rounded === 3) dist[3]++;
      else if (rounded === 2) dist[2]++;
      else dist[1]++;
    });
    return dist;
  }, [filteredFeedbacks]);

  // Course-wise Averages
  const courseAverages = useMemo(() => {
    return courses.map(course => {
      const courseFeedbacks = feedbacks.filter(f => f.courseId === course.id);
      const count = courseFeedbacks.length;
      const avg = count > 0
        ? Number((courseFeedbacks.reduce((a, b) => a + b.averageRating, 0) / count).toFixed(2))
        : 0;
      const assignedFac = faculty.find(f => f.id === course.facultyId);
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        facultyName: assignedFac?.name || 'Unassigned',
        count,
        avg,
      };
    });
  }, [courses, feedbacks, faculty]);

  // Faculty-wise Averages
  const facultyAverages = useMemo(() => {
    return faculty.map(fac => {
      const facFeedbacks = feedbacks.filter(f => f.facultyId === fac.id);
      const count = facFeedbacks.length;
      const avg = count > 0
        ? Number((facFeedbacks.reduce((a, b) => a + b.averageRating, 0) / count).toFixed(2))
        : 0;
      const teachingScore = count > 0
        ? Number((facFeedbacks.reduce((a, b) => a + b.ratings.teachingQuality, 0) / count).toFixed(2))
        : 0;
      return {
        id: fac.id,
        name: fac.name,
        title: fac.title,
        department: fac.department,
        count,
        avg,
        teachingScore,
      };
    });
  }, [faculty, feedbacks]);

  // CSV Export
  const handleExportCSV = () => {
    StorageService.exportFeedbackToCSV(filteredFeedbacks);
    showNotification('success', 'Export Complete', `Exported ${filteredFeedbacks.length} feedback records to CSV.`);
  };

  const handleResetFilters = () => {
    setSelectedCourseFilter('ALL');
    setSelectedFacultyFilter('ALL');
    setSelectedSemesterFilter('ALL');
    setSelectedRatingBracket('ALL');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200 uppercase tracking-wider">
              Institutional Quality Audit
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Evaluation Term: Fall 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#173B6C] tracking-tight mt-1">
            Faculty Feedback & Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated institutional course ratings, faculty teaching assessments, and student sentiment reports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-teal-300" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (7 Cards required by prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
        
        {/* 1. Total Submissions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Total Submissions</span>
          <span className="text-2xl font-extrabold text-[#173B6C] tabular-nums block font-mono">
            {totalSubmissions}
          </span>
          <span className="text-[10px] text-teal-600 block font-medium">Verified student logs</span>
        </div>

        {/* 2. Overall Avg Rating */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Overall Rating</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums font-mono">
              {overallAvgRating.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Out of 5.0 scale</span>
        </div>

        {/* 3. Avg Teaching Quality */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Teaching Quality</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#315F91] tabular-nums font-mono">
              {avgTeachingRating.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Pedagogical clarity</span>
        </div>

        {/* 4. Avg Course Content */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Course Content</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-teal-700 tabular-nums font-mono">
              {avgCourseRating.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-amber-500">★</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Syllabus relevance</span>
        </div>

        {/* 5. Total Courses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Total Courses</span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block font-mono">
            {totalCourses}
          </span>
          <span className="text-[10px] text-slate-500 block">Active catalog</span>
        </div>

        {/* 6. Total Faculty */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Total Faculty</span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums block font-mono">
            {totalFacultyCount}
          </span>
          <span className="text-[10px] text-slate-500 block">Instructors</span>
        </div>

        {/* 7. Feedback Completion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-slate-500 block truncate">Completion Rate</span>
          <span className="text-2xl font-extrabold text-emerald-700 tabular-nums block font-mono">
            {completionRate}%
          </span>
          <span className="text-[10px] text-emerald-600 block font-medium">Cohort participation</span>
        </div>

      </div>

      {/* Interactive Charts Section with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Chart Header & Segmented Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Academic Analytics & Visual Distributions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live graphical evaluations comparing courses, faculty, and rating brackets
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveChartTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'overview'
                  ? 'bg-white text-[#173B6C] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rating Breakdown
            </button>
            <button
              onClick={() => setActiveChartTab('courses')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'courses'
                  ? 'bg-white text-[#173B6C] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Course Averages
            </button>
            <button
              onClick={() => setActiveChartTab('faculty')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'faculty'
                  ? 'bg-white text-[#173B6C] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty Performance
            </button>
            <button
              onClick={() => setActiveChartTab('matrix')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeChartTab === 'matrix'
                  ? 'bg-white text-[#173B6C] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teaching vs Content
            </button>
          </div>
        </div>

        {/* TAB 1: Overall Rating Distribution */}
        {activeChartTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Overall Score Circle */}
            <div className="lg:col-span-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Aggregated Institutional Score
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-black text-[#173B6C] tabular-nums font-mono">
                  {overallAvgRating.toFixed(2)}
                </span>
                <span className="text-3xl text-amber-500">★</span>
              </div>
              <p className="text-xs text-slate-600">
                Calculated across <strong>{filteredFeedbacks.length}</strong> evaluated criteria sets
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Teaching Avg</span>
                  <span className="font-bold text-slate-800 font-mono">{avgTeachingRating} ★</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Content Avg</span>
                  <span className="font-bold text-slate-800 font-mono">{avgCourseRating} ★</span>
                </div>
              </div>
            </div>

            {/* Right: Distribution Horizontal Bars */}
            <div className="lg:col-span-8 space-y-3">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = ratingDistribution[stars as keyof typeof ratingDistribution];
                const total = filteredFeedbacks.length || 1;
                const percentage = Math.round((count / total) * 100);

                const barColors: Record<number, string> = {
                  5: 'bg-emerald-500',
                  4: 'bg-[#315F91]',
                  3: 'bg-amber-500',
                  2: 'bg-orange-500',
                  1: 'bg-red-500',
                };

                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-16 font-mono font-semibold text-slate-700 flex items-center gap-1">
                      <span>{stars} Star</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    </span>
                    <div className="flex-1 h-5 bg-slate-100 rounded-md overflow-hidden relative">
                      <div
                        className={`h-full ${barColors[stars]} transition-all duration-500 rounded-md`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-24 text-right font-mono text-slate-600 tabular-nums">
                      <span className="font-bold text-slate-900">{count}</span>
                      <span className="text-slate-400 text-[11px] ml-1">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: Course-wise Average Ratings Bar Chart */}
        {activeChartTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Benchmark Target: <strong>4.0 / 5.0 ★</strong> (University Excellence Threshold)</span>
              <span>Sorted by Course Code</span>
            </div>

            <div className="space-y-3">
              {courseAverages.map(course => {
                const widthPercent = (course.avg / 5.0) * 100;
                const meetsBenchmark = course.avg >= 4.0;

                return (
                  <div key={course.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#173B6C] mr-2">{course.code}</span>
                        <span className="font-semibold text-slate-900">{course.name}</span>
                        <span className="text-slate-500 text-[11px] ml-2">({course.facultyName})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">{course.count} evaluations</span>
                        <span className="font-bold text-[#173B6C] font-mono text-sm tabular-nums">
                          {course.avg > 0 ? `${course.avg.toFixed(2)} ★` : 'No reviews'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          meetsBenchmark ? 'bg-gradient-to-r from-[#173B6C] to-[#14B8A6]' : 'bg-amber-500'
                        }`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Faculty-wise Average Ratings Bar Chart */}
        {activeChartTab === 'faculty' && (
          <div className="space-y-3">
            {facultyAverages.map(fac => {
              const widthPercent = (fac.avg / 5.0) * 100;

              return (
                <div key={fac.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{fac.name}</span>
                      <span className="text-slate-500 text-[11px] ml-2">{fac.title} · {fac.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500 font-mono">Teaching: {fac.teachingScore} ★</span>
                      <span className="font-mono font-bold text-[#173B6C] text-sm tabular-nums">
                        {fac.avg > 0 ? `${fac.avg.toFixed(2)} ★` : 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#315F91] to-[#14B8A6] rounded-full transition-all duration-500"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: Teaching Quality vs Course Content Quality */}
        {activeChartTab === 'matrix' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Comparison between Instructor Delivery (Teaching Quality) versus Curriculum Architecture (Course Content Quality) across courses.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Course Code & Name</th>
                    <th className="py-2.5 px-3 font-semibold">Faculty Member</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Teaching Quality (1-5)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Course Content (1-5)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Quality Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map(course => {
                    const courseFeedbacks = feedbacks.filter(f => f.courseId === course.id);
                    const count = courseFeedbacks.length;
                    const teachingAvg = count > 0
                      ? Number((courseFeedbacks.reduce((a, b) => a + b.ratings.teachingQuality, 0) / count).toFixed(2))
                      : 0;
                    const contentAvg = count > 0
                      ? Number((courseFeedbacks.reduce((a, b) => a + b.ratings.courseContentQuality, 0) / count).toFixed(2))
                      : 0;
                    const delta = Number((teachingAvg - contentAvg).toFixed(2));
                    const assignedFac = faculty.find(f => f.id === course.facultyId);

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {course.code} — {course.name}
                        </td>
                        <td className="py-2.5 px-3 text-[#173B6C] font-medium">
                          {assignedFac?.name || 'Unassigned'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                          {teachingAvg > 0 ? `${teachingAvg} ★` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-teal-700">
                          {contentAvg > 0 ? `${contentAvg} ★` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {delta > 0 ? (
                            <span className="text-emerald-700">+{delta} (Teaching leads)</span>
                          ) : delta < 0 ? (
                            <span className="text-amber-700">{delta} (Content leads)</span>
                          ) : (
                            <span className="text-slate-400">Balanced</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Filter and Search Bar for Feedback Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#173B6C]" />
            <h3 className="text-sm font-bold text-slate-900">Filter Feedback Records</h3>
            <span className="text-xs text-slate-400">({filteredFeedbacks.length} matching)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Course filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Course
            </label>
            <select
              value={selectedCourseFilter}
              onChange={e => setSelectedCourseFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
            >
              <option value="ALL">All Courses ({courses.length})</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Faculty Member
            </label>
            <select
              value={selectedFacultyFilter}
              onChange={e => setSelectedFacultyFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
            >
              <option value="ALL">All Faculty ({faculty.length})</option>
              {faculty.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.department.replace('Department of ', '')})
                </option>
              ))}
            </select>
          </div>

          {/* Semester filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Semester
            </label>
            <select
              value={selectedSemesterFilter}
              onChange={e => setSelectedSemesterFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
            >
              <option value="ALL">All Semesters</option>
              <option value="Semester 3">Semester 3</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 5">Semester 5</option>
              <option value="Semester 6">Semester 6</option>
            </select>
          </div>

          {/* Rating Bracket filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Score Bracket
            </label>
            <select
              value={selectedRatingBracket}
              onChange={e => setSelectedRatingBracket(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20"
            >
              <option value="ALL">All Scores</option>
              <option value="5">High (4.5 to 5.0 ★)</option>
              <option value="4">Good (3.5 to 4.4 ★)</option>
              <option value="3">Average (2.5 to 3.4 ★)</option>
              <option value="below3">Attention Needed (&lt; 2.5 ★)</option>
            </select>
          </div>

        </div>

        {/* Live Search and Sorting */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search feedback text, student name (if named), or course..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="date">Submission Date</option>
              <option value="rating">Average Rating</option>
              <option value="course">Course Code</option>
            </select>
            <button
              onClick={() => setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600"
              title="Toggle Asc/Desc"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Feedback Data Table (Required by prompt) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Comprehensive Feedback Registry</h3>
            <p className="text-xs text-slate-500">
              Verified evaluations with anonymous student identity protection
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 tabular-nums">
            Showing {sortedFeedbacks.length} submissions
          </span>
        </div>

        {sortedFeedbacks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No feedback entries match your active filter criteria. Try resetting filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Course</th>
                  <th className="py-3 px-4 font-semibold">Faculty</th>
                  <th className="py-3 px-4 font-semibold text-center">Score</th>
                  <th className="py-3 px-4 font-semibold">Student Identity</th>
                  <th className="py-3 px-4 font-semibold">Qualitative Highlights</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedFeedbacks.map(fb => (
                  <tr key={fb.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div>
                        <span>{fb.courseCode}</span>
                        <span className="text-[11px] text-slate-500 block font-normal">{fb.courseName}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-[#173B6C] font-semibold">
                      {fb.facultyName}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap font-mono">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{fb.averageRating.toFixed(2)}</span>
                      </span>
                    </td>

                    {/* Anonymous Status Check - CRITICAL: Anonymous submissions must never reveal student identity! */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {fb.isAnonymous ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-teal-50 text-teal-800 rounded font-medium text-[11px] border border-teal-200">
                          <Lock className="w-3 h-3 text-teal-600" />
                          <span>Anonymous</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium text-[11px]">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{fb.studentName}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs text-slate-600 truncate italic">
                      "{fb.likedAspects}"
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                      {new Date(fb.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedFeedbackModal(fb)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#173B6C] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        Inspect
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Individual Feedback Inspection Modal */}
      {selectedFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 bg-[#173B6C] text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Feedback Inspection Record</h3>
                <p className="text-xs text-blue-100 font-mono">
                  Receipt: {selectedFeedbackModal.id} · {selectedFeedbackModal.semester}
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
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">Course:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedFeedbackModal.courseCode} — {selectedFeedbackModal.courseName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Faculty Member:</span>
                  <span className="font-bold text-[#173B6C] text-sm">
                    {selectedFeedbackModal.facultyName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Student Identity:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedFeedbackModal.isAnonymous ? '🔒 Anonymous Student (Shielded)' : `👤 ${selectedFeedbackModal.studentName}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Composite Rating:</span>
                  <span className="font-bold text-[#173B6C] font-mono text-base tabular-nums">
                    {selectedFeedbackModal.averageRating.toFixed(2)} / 5.0 ★
                  </span>
                </div>
              </div>

              {/* 6 Criteria Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Criterion Scoring Matrix
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Teaching Quality</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.teachingQuality} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Subject Knowledge</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.subjectKnowledge} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Communication</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.communicationSkills} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Doubt Resolution</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.doubtResolution} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Engagement</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.classroomEngagement} / 5 ★</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Course Content</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedFeedbackModal.ratings.courseContentQuality} / 5 ★</span>
                  </div>
                </div>
              </div>

              {/* Qualitative Statements */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Positive Observations:</span>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed italic mt-1">
                    "{selectedFeedbackModal.likedAspects}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">Areas Recommended for Improvement:</span>
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
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
