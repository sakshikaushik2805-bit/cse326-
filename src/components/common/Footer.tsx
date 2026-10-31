import React from 'react';
import { GraduationCap, ShieldCheck, Database, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#315F91] flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Sensus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Feedback. Our Progress. An institutional portal for continuous academic quality improvement and course evaluation.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FERPA & Anonymity Protected</span>
            </div>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Student Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('student-login')} className="hover:text-white transition-colors">
                  Student Sign In
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('student-register')} className="hover:text-white transition-colors">
                  New Student Registration
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('courses')} className="hover:text-white transition-colors">
                  Course Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('guidelines')} className="hover:text-white transition-colors">
                  Evaluation Rubric & Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Academic Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Academic Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('faculty-login')} className="hover:text-teal-400 font-medium transition-colors">
                  Faculty Portal Sign In
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('faculty-register')} className="hover:text-white transition-colors">
                  Register Faculty Account
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-login')} className="hover:text-white transition-colors">
                  Administrator Portal
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-register')} className="hover:text-white transition-colors">
                  Register Administrator
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="hover:text-white transition-colors">
                  Analytics & Visual Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Quality Framework */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-200 font-medium">
              <Award className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Institutional Quality Framework</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Equipped with student privacy safeguards, cryptographically protected anonymous feedback channels, and role-based institutional evaluation analytics.
            </p>
            <div className="pt-1 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Academic Year: 2026-2027</span>
              <span className="text-teal-400 font-medium">Portal Active</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Sensus University Systems. All academic evaluation rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Anonymous Evaluation Protocol v2.4</span>
            <span>·</span>
            <span>Accredited Academic Quality Assurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
