import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Eye, EyeOff, Lock, User, ArrowLeft, UserPlus, Shield } from 'lucide-react';

export const FacultyLogin: React.FC = () => {
  const { loginFaculty, setActiveView } = useApp();
  const [facultyIdOrEmail, setFacultyIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!facultyIdOrEmail.trim()) {
      setError('Please provide your Faculty ID or university email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginFaculty(facultyIdOrEmail, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.message);
      }
    }, 200);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F5F7FB]">
      <div className="max-w-md w-full space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-teal-50 text-[#14B8A6] rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-teal-200">
              <BookOpen className="w-6 h-6 text-[#173B6C]" />
            </div>
            <h2 className="text-2xl font-bold text-[#173B6C] tracking-tight">Faculty Portal</h2>
            <p className="text-xs text-slate-500">
              Sign in to view your personalized student feedback, evaluation scores, and course analytics
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex flex-col gap-1.5">
              <div className="font-semibold">{error}</div>
              <p className="text-[11px] text-red-600">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveView('faculty-register')}
                  className="underline font-bold text-red-800 hover:text-red-900"
                >
                  Register your faculty credentials here
                </button>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Faculty ID or University Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={facultyIdOrEmail}
                  onChange={e => setFacultyIdOrEmail(e.target.value)}
                  placeholder="Enter your Faculty ID or email"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all font-mono"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B6C]/20 focus:border-[#173B6C] transition-all font-mono"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#173B6C] hover:bg-[#122e54] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <BookOpen className="w-3.5 h-3.5 text-teal-300" />
                  <span>Sign In to Faculty Portal</span>
                </>
              )}
            </button>
          </form>

          {/* User Registration Callout */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1.5">
            <p className="text-xs text-slate-700 font-medium">
              Need to add or set up your faculty credentials?
            </p>
            <button
              type="button"
              onClick={() => setActiveView('faculty-register')}
              className="w-full py-2 px-3 text-xs font-semibold text-[#173B6C] bg-white border border-[#173B6C]/30 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Register / Add Faculty Credentials</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => setActiveView('student-login')}
              className="hover:underline text-slate-600"
            >
              Student Portal
            </button>
            <button
              type="button"
              onClick={() => setActiveView('admin-login')}
              className="text-[#315F91] hover:underline font-semibold flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
