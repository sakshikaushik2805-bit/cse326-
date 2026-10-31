import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  BookOpen, 
  ArrowRight, 
  Lock, 
  FileSpreadsheet,
  Award,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-800">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-semibold text-[#173B6C]">
                <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Next-Generation Academic Evaluation Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B6C] tracking-tight leading-[1.12]">
                Your Feedback. <br />
                <span className="text-[#315F91]">Our Progress.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                A smarter academic feedback platform that empowers students to share their experiences and helps institutions improve teaching and learning through transparent, data-driven course evaluations.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('student-login')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-[#173B6C] hover:bg-[#112d53] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <GraduationCap className="w-4 h-4 text-teal-300" />
                  <span>Student Portal</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => setActiveView('faculty-login')}
                  className="px-5 py-3 text-sm font-semibold text-[#173B6C] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#14B8A6]" />
                  <span>Faculty Portal</span>
                </button>

                <button
                  onClick={() => setActiveView('admin-login')}
                  className="px-4 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-[#315F91]" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Trust & Proof points */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900 text-lg tabular-nums block">100%</span>
                  <span>Anonymity Protected</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-lg tabular-nums block">6 Core</span>
                  <span>Evaluation Dimensions</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-lg tabular-nums block">Real-Time</span>
                  <span>Dean Analytics</span>
                </div>
              </div>

            </div>

            {/* Right Media Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
                <img
                  src="/src/assets/images/clario_analytics_preview_1793459987030.jpg"
                  alt="Sensus Academic Analytics Dashboard Preview"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-slate-900/90 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-medium">Live Academic Evaluation Term: Fall 2026</span>
                  </div>
                  <button
                    onClick={() => setActiveView('admin-login')}
                    className="text-xs text-teal-300 hover:text-teal-200 font-semibold underline"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Campus Architectural Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative h-64 sm:h-80 md:h-96">
          <img
            src="/assets/aistudio/image_c961c59a.png"
            alt="University Campus Academic Center"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent flex items-end p-6 sm:p-8">
            <div className="text-white space-y-1">
              <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Excellence in Higher Education
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Cultivating Pedagogical Quality Across Every Department
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Bridging constructive student perspectives directly with departmental heads and faculty development programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: About Sensus */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-[#315F91] uppercase tracking-wider">
            About Sensus
          </span>
          <h2 className="text-3xl font-bold text-[#173B6C] tracking-tight">
            Institutional Feedback Reimagined
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Sensus was engineered to replace clunky legacy paper surveys with a transparent, confidential, and actionable digital evaluation ecosystem designed specifically for modern higher education institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#173B6C] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Empowerment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every learner gets a confidential, structured voice to evaluate course delivery, laboratory sessions, and professor engagement without fear of bias.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Faculty Mentorship</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Professors receive constructive, metric-grounded insights into teaching pace, clarity of explanations, and course relevance for professional development.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Accreditation & Governance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Academic deans and department chairs access verifiable audit logs, cohort performance matrices, and clean CSV exports for institutional accreditation.
            </p>
          </div>

        </div>
      </section>

      {/* Section: Why Feedback Matters */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#14B8A6] uppercase tracking-wider">
                Continuous Academic Improvement
              </span>
              <h2 className="text-3xl font-bold text-[#173B6C] tracking-tight">
                Why Systematic Feedback Matters
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Course evaluations are not just end-of-semester obligations. When executed systematically, feedback transforms curriculum design, optimizes teaching methodologies, and elevates overall institutional reputation.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">
                    <strong>Refines Course Syllabi:</strong> Identifies obsolete topics and highlights the need for contemporary industry tools.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">
                    <strong>Eliminates Subjectivity:</strong> Replaces rumors with standardized 6-point evaluation metrics.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">
                    <strong>Empowers Accreditation:</strong> Supplies concrete student satisfaction data required by NBA, NAAC, and ABET bodies.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#F5F7FB] p-8 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-extrabold text-[#173B6C] tabular-nums">94.8%</div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Institutional Retention</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Universities responding to structured student input experience significantly higher student engagement.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-extrabold text-[#14B8A6] tabular-nums">0%</div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Identity Leakage</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Anonymous submissions are cryptographically separated from personal student identifiers in administrator views.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-extrabold text-[#315F91] tabular-nums">6x</div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Faster Review Turnaround</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Instant automated aggregation replaces weeks of manual paper survey collation and statistical spreadsheet work.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-extrabold text-amber-600 tabular-nums">1-Click</div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Audit Reports</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Export complete department evaluation spreadsheets with cleaned metrics directly for accreditation dossiers.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Section: Platform Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-[#315F91] uppercase tracking-wider">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-bold text-[#173B6C] tracking-tight">
            Designed for Academic Rigor & Seamless Usability
          </h2>
          <p className="text-slate-600 text-sm">
            Everything your college needs to run frictionless, trustworthy course assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#173B6C] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">5-Step Guided Evaluation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step-by-step wizard guiding students through course selection, 6-criterion faculty scoring, thoughtful qualitative responses, privacy choices, and review.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#14B8A6] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Strict Privacy & Anonymity</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students can choose whether to submit with their name or completely anonymously. Administrator tables and CSV exports strictly mask anonymous student identities.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#315F91] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Dean & Admin Analytics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visual dashboards featuring rating distributions, course comparisons, faculty averages, submission timelines, and teaching quality vs content correlations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Duplicate Submission Guard</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enforces institutional integrity by preventing multiple submissions for the same course and semester by the same authenticated student.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Course & Faculty Mapping</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pre-configured academic mappings for Data Structures, Web Development, Database Management, and Computer Networks with full admin CRUD controls.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Standardized CSV Export</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate formatted evaluation spreadsheets with sanitized fields, timestamp tracking, and individual criteria columns ready for committee review.
            </p>
          </div>

        </div>
      </section>

      {/* Section: How It Works */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-[#315F91] uppercase tracking-wider">
              Workflows
            </span>
            <h2 className="text-3xl font-bold text-[#173B6C] tracking-tight">
              How Sensus Works
            </h2>
            <p className="text-slate-600 text-sm">
              A transparent, 3-step closed-loop evaluation workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#173B6C] text-white flex items-center justify-center text-xs font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Authenticate & Select Course</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student logs into their personalized portal. The system automatically lists active semester courses and displays the assigned professor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#315F91] text-white flex items-center justify-center text-xs font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Provide Structured Evaluation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rate the faculty across 6 standardized dimensions (1 to 5 stars), submit qualitative feedback on strengths and improvements, and choose anonymity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#14B8A6] text-white flex items-center justify-center text-xs font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Analyze & Implement Action</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submissions automatically feed administrative dashboards. Deans review aggregated scores, identify teaching trends, and export accreditation files.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Benefits for Students and Administrators */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* For Students */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#173B6C] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Benefits for Students</h3>
                <p className="text-xs text-slate-500">Empowering student voices safely</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Protected Anonymity:</strong> Submit honest observations knowing your grades or personal standing are never affected.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Personal Evaluation History:</strong> Track all your submitted reviews, ratings, and course history in one private tab.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Direct Impact:</strong> See curriculum, lab experiments, and lecture pacing actively improve based on student consensus.</span>
              </li>
            </ul>

            <button
              onClick={() => setActiveView('student-login')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#173B6C] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-2"
            >
              <span>Access Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* For Faculty & Admins */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#14B8A6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Benefits for Faculty & Deans</h3>
                <p className="text-xs text-slate-500">Actionable institutional intelligence</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Holistic Evaluation Dimensions:</strong> Beyond basic scores, assess communication, doubt resolution, and subject mastery separately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Filterable Visualizations:</strong> Filter feedback trends by course, department, faculty, semester, and rating brackets.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Curriculum Audit Ready:</strong> Instant CSV exports and completion metrics for institutional accreditation panels.</span>
              </li>
            </ul>

            <button
              onClick={() => setActiveView('admin-login')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Access Administrator Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-300" />
            </button>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-[#173B6C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight">Ready to evaluate this semester's courses?</h3>
            <p className="text-sm text-blue-200">
              Student feedback takes less than 3 minutes per course and drives real academic change.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('student-login')}
              className="px-5 py-2.5 text-xs font-semibold text-[#173B6C] bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors"
            >
              Start Student Evaluation
            </button>
            <button
              onClick={() => setActiveView('faculty-login')}
              className="px-4 py-2.5 text-xs font-semibold text-teal-300 border border-teal-400/40 hover:bg-white/10 rounded-lg transition-colors"
            >
              Faculty Portal
            </button>
            <button
              onClick={() => setActiveView('admin-login')}
              className="px-4 py-2.5 text-xs font-semibold text-slate-200 border border-white/20 hover:bg-white/10 rounded-lg transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
