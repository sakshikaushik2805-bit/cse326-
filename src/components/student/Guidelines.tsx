import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, ShieldCheck, Star, HelpCircle, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export const Guidelines: React.FC = () => {
  const { userRole, setActiveView } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <button
          onClick={() => setActiveView(userRole === 'admin' ? 'admin-dashboard' : 'student-dashboard')}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-[#173B6C] tracking-tight">
          Academic Feedback Guidelines & Evaluation Rubric
        </h1>
        <p className="text-xs text-slate-500">
          Standards for providing constructive, objective, and actionable faculty course evaluations
        </p>
      </div>

      {/* Code of Conduct Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-[#173B6C]">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold">Purpose of Course Evaluations</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Course evaluations are an integral component of the university's continuous quality improvement framework. The feedback gathered directly informs department curriculum reviews, faculty development workshops, laboratory equipment upgrades, and accreditation audits (e.g. NAAC, NBA, ABET).
        </p>
      </div>

      {/* 5-Point Rating Rubric Standard */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>The Standard 5-Point Evaluation Rubric</span>
        </h3>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
            <div className="sm:col-span-3 font-bold text-emerald-800 font-mono">
              5 ★ — Excellent
            </div>
            <div className="sm:col-span-9 text-slate-600">
              Faculty consistently demonstrates exceptional clarity, inspires critical inquiry, delivers timely feedback, and goes above and beyond in doubt resolution and laboratory guidance.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
            <div className="sm:col-span-3 font-bold text-blue-800 font-mono">
              4 ★ — Very Good
            </div>
            <div className="sm:col-span-9 text-slate-600">
              Clear lectures, strong domain command, thorough syllabus coverage, and helpful engagement. Only minor areas for improvement.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
            <div className="sm:col-span-3 font-bold text-amber-800 font-mono">
              3 ★ — Average
            </div>
            <div className="sm:col-span-9 text-slate-600">
              Meets foundational syllabus requirements, but could improve pacing, engagement, or provide clearer explanation of complex proofs and homework problems.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
            <div className="sm:col-span-3 font-bold text-orange-800 font-mono">
              2 ★ — Needs Improvement
            </div>
            <div className="sm:col-span-9 text-slate-600">
              Lecture pacing was consistently uneven, communication was difficult to follow, or doubts were frequently left unresolved.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
            <div className="sm:col-span-3 font-bold text-red-800 font-mono">
              1 ★ — Poor
            </div>
            <div className="sm:col-span-9 text-slate-600">
              Substantial deficiencies in teaching delivery, frequent absenteeism or lack of syllabus coverage, and refusal to address questions.
            </div>
          </div>
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Constructive Feedback Best Practices</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li>• <strong>Be Specific:</strong> Mention specific topics (e.g. "Dynamic Programming" or "B-Trees") where lecture examples helped or were unclear.</li>
            <li>• <strong>Focus on Behaviors:</strong> Discuss pace, board readability, assignment difficulty, and office hour availability.</li>
            <li>• <strong>Propose Solutions:</strong> Suggest practical adjustments such as uploading lecture slides earlier or adding practice quiz sessions.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Unacceptable Feedback Practices</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
            <li>• <strong>No Ad-Hominem Remarks:</strong> Personal insults, discriminatory remarks, or comments regarding appearance or accents are prohibited.</li>
            <li>• <strong>Don't Score Based on Grades:</strong> Evaluations should reflect pedagogical quality and effort, not personal exam performance.</li>
            <li>• <strong>Avoid Vague Rants:</strong> Comments like "everything was bad" without context do not assist department heads in making improvements.</li>
          </ul>
        </div>

      </div>

      {/* Privacy Guarantee */}
      <div className="p-5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>The Sensus Privacy & FERPA Compliance Commitment</span>
        </h4>
        <p className="leading-relaxed">
          When you mark your submission as <strong>Anonymous</strong>, your student credentials (name and ID) are strictly withheld from all faculty members and administrator report dashboards. The platform enforces duplicate validation internally to ensure one vote per student per course, without compromising your privacy.
        </p>
      </div>

    </div>
  );
};
