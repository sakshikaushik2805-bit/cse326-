import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Course, FeedbackRatingCriteria } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Star, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  BookOpen, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Lock,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';

const CRITERIA_CONFIG = [
  {
    key: 'teachingQuality' as keyof FeedbackRatingCriteria,
    label: 'Teaching Quality',
    description: 'Pacing, clarity of lecture explanations, syllabus alignment, and pedagogical effectiveness.',
  },
  {
    key: 'subjectKnowledge' as keyof FeedbackRatingCriteria,
    label: 'Subject Knowledge',
    description: 'Mastery of technical theoretical concepts, real-world domain depth, and accuracy.',
  },
  {
    key: 'communicationSkills' as keyof FeedbackRatingCriteria,
    label: 'Communication Skills',
    description: 'Articulation, auditory clarity, blackboard/slide organization, and bilingual support.',
  },
  {
    key: 'doubtResolution' as keyof FeedbackRatingCriteria,
    label: 'Doubt Resolution',
    description: 'Patience and willingness to clarify student inquiries during class and designated office hours.',
  },
  {
    key: 'classroomEngagement' as keyof FeedbackRatingCriteria,
    label: 'Classroom Engagement',
    description: 'Interactive discussions, quizzes, thought-provoking questions, and peer participation.',
  },
  {
    key: 'courseContentQuality' as keyof FeedbackRatingCriteria,
    label: 'Course Content Quality',
    description: 'Relevance of lecture notes, lab assignments, homework problems, and study references.',
  },
];

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Needs Improvement',
  3: 'Average',
  4: 'Very Good',
  5: 'Excellent',
};

export const FeedbackForm: React.FC = () => {
  const { currentUser, courses, faculty, feedbacks, refreshData, setActiveView, showNotification } = useApp();
  const student = currentUser as Student;

  // Multi-step state: 1 (Course), 2 (Ratings), 3 (Written), 4 (Privacy), 5 (Review), 6 (Success)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [ratings, setRatings] = useState<FeedbackRatingCriteria>({
    teachingQuality: 0,
    subjectKnowledge: 0,
    communicationSkills: 0,
    doubtResolution: 0,
    classroomEngagement: 0,
    courseContentQuality: 0,
  });
  const [likedAspects, setLikedAspects] = useState<string>('');
  const [improvements, setImprovements] = useState<string>('');
  const [additionalComments, setAdditionalComments] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);

  // Validation & Submission States
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{ id: string; date: string; avg: number } | null>(null);

  // Pre-select first eligible course if not set
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      // Find course not yet submitted by student
      const unsubmitted = courses.find(
        c => !StorageService.hasStudentSubmittedCourse(student?.id || student?.studentId, c.id, c.semester)
      );
      if (unsubmitted) {
        setSelectedCourseId(unsubmitted.id);
      } else {
        setSelectedCourseId(courses[0].id);
      }
    }
  }, [courses, selectedCourseId, student]);

  if (!student) return null;

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const assignedFaculty = selectedCourse ? faculty.find(f => f.id === selectedCourse.facultyId) : null;

  // Check if current course is already evaluated by this student
  const isAlreadySubmitted = selectedCourse
    ? StorageService.hasStudentSubmittedCourse(student.id || student.studentId, selectedCourse.id, selectedCourse.semester)
    : false;

  // Star Rating Component
  const StarRatingInput: React.FC<{
    criterionKey: keyof FeedbackRatingCriteria;
    currentVal: number;
    onChange: (val: number) => void;
  }> = ({ criterionKey, currentVal, onChange }) => {
    const [hoverVal, setHoverVal] = useState<number>(0);
    const activeVal = hoverVal || currentVal;

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverVal(0)}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverVal(star)}
              onClick={() => onChange(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
              title={`${star} - ${RATING_LABELS[star]}`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= activeVal
                    ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                    : 'text-slate-200 fill-slate-100 hover:text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
        
        <div className="w-36 text-xs font-semibold tabular-nums">
          {activeVal > 0 ? (
            <span className={`${activeVal >= 4 ? 'text-emerald-700' : activeVal >= 3 ? 'text-amber-700' : 'text-red-700'}`}>
              {activeVal} / 5 · {RATING_LABELS[activeVal]}
            </span>
          ) : (
            <span className="text-slate-400 font-normal italic">Select rating (1-5)</span>
          )}
        </div>
      </div>
    );
  };

  // Step Validation Handlers
  const validateStep1 = (): boolean => {
    setError(null);
    if (!selectedCourseId) {
      setError('Please select an active course to evaluate.');
      return false;
    }
    if (isAlreadySubmitted) {
      setError(`You have already submitted an evaluation for "${selectedCourse?.name}". Duplicate submissions are prevented to preserve academic evaluation integrity.`);
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    setError(null);
    for (const item of CRITERIA_CONFIG) {
      if (!ratings[item.key] || ratings[item.key] < 1) {
        setError(`Please provide a rating for "${item.label}". All 6 criteria are required.`);
        return false;
      }
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    setError(null);
    if (!likedAspects.trim() || likedAspects.trim().length < 15) {
      setError('Please provide at least 15 characters describing what you liked about the teaching.');
      return false;
    }
    if (!improvements.trim() || improvements.trim().length < 15) {
      setError('Please provide at least 15 characters on areas where teaching or course delivery could improve.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = () => {
    setError(null);
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = StorageService.submitFeedback({
        courseId: selectedCourseId,
        studentId: student.id || student.studentId,
        studentName: student.fullName,
        ratings,
        likedAspects,
        improvements,
        additionalComments,
        isAnonymous,
      });

      setIsSubmitting(false);

      if (res.success && res.submission) {
        setSubmittedReceipt({
          id: res.submission.id,
          date: new Date(res.submission.submittedAt).toLocaleString(),
          avg: res.submission.averageRating,
        });
        refreshData();
        setCurrentStep(6); // Success Step
        showNotification('success', 'Feedback Recorded', 'Your faculty evaluation has been securely registered in the academic repository.');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  // Calculate ongoing average
  const criteriaScores = Object.values(ratings).filter(v => v > 0);
  const currentAverage = criteriaScores.length > 0
    ? (criteriaScores.reduce((a, b) => a + b, 0) / criteriaScores.length).toFixed(2)
    : '0.0';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => setActiveView('student-dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-[#173B6C] tracking-tight">
            Faculty & Course Evaluation
          </h1>
          <p className="text-xs text-slate-500">
            Constructive, objective evaluations empower curriculum evolution and faculty recognition
          </p>
        </div>

        {currentStep < 6 && (
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-500 block">Step {currentStep} of 5</span>
            <span className="text-xs font-bold text-[#173B6C]">
              {currentStep === 1 && 'Course Selection'}
              {currentStep === 2 && 'Faculty Scoring'}
              {currentStep === 3 && 'Qualitative Feedback'}
              {currentStep === 4 && 'Privacy & Anonymity'}
              {currentStep === 5 && 'Review & Submit'}
            </span>
          </div>
        )}
      </div>

      {/* Wizard Step Progress Tracker */}
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, title: 'Course' },
              { num: 2, title: 'Evaluation' },
              { num: 3, title: 'Comments' },
              { num: 4, title: 'Privacy' },
              { num: 5, title: 'Review' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div
                  className={`h-2 rounded-full transition-all ${
                    step.num < currentStep
                      ? 'bg-emerald-500'
                      : step.num === currentStep
                      ? 'bg-[#173B6C]'
                      : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[11px] block mt-1.5 font-medium ${
                    step.num === currentStep
                      ? 'text-[#173B6C] font-bold'
                      : step.num < currentStep
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.num}. {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* Main Multi-Step Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        
        {/* STEP 1: Course Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Step 1: Course Selection</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the course you wish to evaluate. The designated faculty instructor will automatically be loaded.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Select Enrolled Course
              </label>
              <select
                value={selectedCourseId}
                onChange={e => {
                  setSelectedCourseId(e.target.value);
                  setError(null);
                }}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all font-medium"
              >
                {courses.map(course => {
                  const alreadyDone = StorageService.hasStudentSubmittedCourse(
                    student.id || student.studentId,
                    course.id,
                    course.semester
                  );
                  return (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.name} ({course.semester}){alreadyDone ? ' [Evaluated]' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Automatically Displayed Faculty and Course Card */}
            {selectedCourse && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                      Course Details
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedCourse.code}: {selectedCourse.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#173B6C] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {selectedCourse.credits} Academic Credits
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned Faculty Instructor:</span>
                    <span className="text-sm font-bold text-[#173B6C] block mt-0.5">
                      {assignedFaculty ? assignedFaculty.name : 'Unassigned'}
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      {assignedFaculty ? assignedFaculty.title : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Academic Department:</span>
                    <span className="font-medium text-slate-800 block mt-0.5">
                      {selectedCourse.department}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Active Term: {selectedCourse.semester}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] mb-1">Course Description:</span>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{selectedCourse.description}"
                  </p>
                </div>

                {isAlreadySubmitted && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Notice: You have already submitted feedback for this course. Please select another course or visit "My Feedback" to review your previous submission.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Faculty Evaluation Criteria */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Step 2: Faculty Evaluation</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluating: <span className="font-semibold text-[#173B6C]">{assignedFaculty?.name}</span> for{' '}
                  <span className="font-semibold text-slate-800">{selectedCourse?.name} ({selectedCourse?.code})</span>
                </p>
              </div>
              <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-xs">
                <span className="text-slate-500">Current Average: </span>
                <span className="font-bold text-[#173B6C] tabular-nums font-mono text-sm">{currentAverage} / 5.0</span>
              </div>
            </div>

            <div className="space-y-5">
              {CRITERIA_CONFIG.map((criterion, idx) => (
                <div
                  key={criterion.key}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{criterion.label}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 pl-7">
                        {criterion.description}
                      </p>
                    </div>

                    <div className="pl-7 sm:pl-0 pt-1 sm:pt-0">
                      <StarRatingInput
                        criterionKey={criterion.key}
                        currentVal={ratings[criterion.key]}
                        onChange={val => {
                          setRatings(prev => ({ ...prev, [criterion.key]: val }));
                          setError(null);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Written Qualitative Feedback */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Step 3: Written Qualitative Feedback</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share concrete observations. Constructive details give faculty actionable insights to improve pedagogy.
              </p>
            </div>

            <div className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>1. What did you like most about the teaching and course delivery? *</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {likedAspects.length} / 15 min chars
                  </span>
                </label>
                <textarea
                  value={likedAspects}
                  onChange={e => {
                    setLikedAspects(e.target.value);
                    setError(null);
                  }}
                  rows={3}
                  placeholder="e.g. Dr. Sharma effectively breaks down tree traversals on the board, provides clear assignment rubrics, and always clarifies conceptual edge cases..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>2. What specific areas could be improved? *</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {improvements.length} / 15 min chars
                  </span>
                </label>
                <textarea
                  value={improvements}
                  onChange={e => {
                    setImprovements(e.target.value);
                    setError(null);
                  }}
                  rows={3}
                  placeholder="e.g. Would appreciate more sample problems solved before midterms, or slower coverage during complex relational algebra derivations..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>3. Additional comments, suggestions, or lab feedback (Optional)</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">Optional</span>
                </label>
                <textarea
                  value={additionalComments}
                  onChange={e => setAdditionalComments(e.target.value)}
                  rows={2}
                  placeholder="e.g. Lab workstations and cloud dev environments worked smoothly throughout the semester..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 4: Privacy & Anonymity */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Step 4: Privacy & Submission Identity</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Decide whether to disclose your name or preserve total confidential anonymity.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#173B6C] rounded border-slate-300 focus:ring-[#173B6C]"
                />
                <div>
                  <span className="text-sm font-bold text-slate-900 block">
                    Submit this evaluation anonymously (Recommended)
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    When checked, your name (<span className="font-semibold text-slate-800">{student.fullName}</span>) and student ID (<span className="font-mono text-slate-800">{student.studentId}</span>) will be strictly shielded. Neither the faculty member nor the academic administrators viewing reports and CSV exports will be able to see who authored this feedback.
                  </p>
                </div>
              </label>

              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">FERPA & Anonymity Protocol</span>
                    <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
                      Identity data is stripped before saving into the public evaluation tables.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <Lock className="w-5 h-5 text-[#315F91] shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Duplicate Prevention Only</span>
                    <span className="text-[11px] text-slate-500 leading-normal block mt-0.5">
                      Your ID is only used internally to verify you don't submit twice for this course.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#173B6C] flex items-center justify-between">
              <span>Current Submission Mode:</span>
              <span className="font-bold uppercase tracking-wider text-xs">
                {isAnonymous ? '🔒 Anonymous Evaluation' : `👤 Disclosed: ${student.fullName}`}
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: Review and Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900">Step 5: Review & Final Submission</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Please verify your ratings and qualitative comments before submitting to the academic registry.
              </p>
            </div>

            {/* Course & Faculty Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Course:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedCourse?.code} — {selectedCourse?.name}
                </span>
                <span className="text-slate-500 block">
                  Faculty: <strong className="text-[#173B6C]">{assignedFaculty?.name}</strong> · {selectedCourse?.semester}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[11px] block">Overall Calculated Score:</span>
                <span className="text-xl font-extrabold text-[#173B6C] font-mono tabular-nums">
                  {currentAverage} / 5.0 ★
                </span>
              </div>
            </div>

            {/* Criteria Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Criteria Ratings
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#315F91] hover:underline font-semibold"
                >
                  Edit Ratings
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {CRITERIA_CONFIG.map(item => (
                  <div key={item.key} className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="text-[11px] text-slate-500 block truncate">{item.label}</span>
                    <span className="font-bold text-slate-800 text-sm font-mono tabular-nums">
                      {ratings[item.key]} / 5 ★
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Written Responses Summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Qualitative Feedback
                </h4>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-[#315F91] hover:underline font-semibold"
                >
                  Edit Comments
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 block text-[11px]">Strengths & Positive Aspects:</span>
                  <p className="text-slate-600 italic mt-0.5 whitespace-pre-wrap">{likedAspects}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block text-[11px]">Recommended Improvements:</span>
                  <p className="text-slate-600 italic mt-0.5 whitespace-pre-wrap">{improvements}</p>
                </div>
                {additionalComments && (
                  <div>
                    <span className="font-semibold text-slate-700 block text-[11px]">Additional Comments:</span>
                    <p className="text-slate-600 italic mt-0.5 whitespace-pre-wrap">{additionalComments}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy summary */}
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-lg text-xs">
              <span className="text-slate-600">Privacy Status:</span>
              <span className="font-semibold text-slate-800">
                {isAnonymous ? '🔒 Anonymous Submission' : `👤 Named: ${student.fullName}`}
              </span>
            </div>
          </div>
        )}

        {/* STEP 6: Success Confirmation Screen */}
        {currentStep === 6 && submittedReceipt && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Submission Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-[#173B6C] tracking-tight">
                Thank You for Your Feedback!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your evaluation for <strong className="text-slate-800">{selectedCourse?.name} ({selectedCourse?.code})</strong> has been securely logged into the academic records.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-left space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-mono text-[11px]">
                <span className="text-slate-500">Submission Receipt ID:</span>
                <span className="font-bold text-slate-800">{submittedReceipt.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Course:</span>
                  <span className="font-medium text-slate-800">{selectedCourse?.code}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Faculty:</span>
                  <span className="font-medium text-slate-800">{assignedFaculty?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Average Score:</span>
                  <span className="font-bold text-[#173B6C] font-mono">{submittedReceipt.avg.toFixed(2)} ★</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Timestamp:</span>
                  <span className="text-slate-600 text-[11px]">{submittedReceipt.date}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setActiveView('my-feedback')}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm"
              >
                View in "My Feedback"
              </button>
              <button
                onClick={() => {
                  // Reset form for next course
                  setCurrentStep(1);
                  setRatings({
                    teachingQuality: 0,
                    subjectKnowledge: 0,
                    communicationSkills: 0,
                    doubtResolution: 0,
                    classroomEngagement: 0,
                    courseContentQuality: 0,
                  });
                  setLikedAspects('');
                  setImprovements('');
                  setAdditionalComments('');
                  setSubmittedReceipt(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Evaluate Another Course
              </button>
              <button
                onClick={() => setActiveView('student-dashboard')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer (Steps 1 to 5) */}
        {currentStep < 6 && (
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:hover:text-slate-600 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && isAlreadySubmitted}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] disabled:opacity-50 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Academic Feedback</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
