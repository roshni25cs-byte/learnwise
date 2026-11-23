import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Bell, Shield, BookOpen, GraduationCap, UserCheck, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function Navbar({ onOpenAIStudio, onOpenAnalytics, onOpenAdmin }) {
  const { user, switchRole, isAdmin, isFaculty, isStudent } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm mb-6">
      {/* Brand & Mode Indicator matching user's image */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">LearnWise Management</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">Bloom's Taxonomy & CLO Analytics Engine</p>
        </div>
      </div>

      {/* Center Interactive Quick Triggers */}
      <div className="hidden md:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs font-medium">
        <button
          onClick={onOpenAIStudio}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white text-blue-700 shadow-sm font-semibold hover:bg-blue-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Gemini AI Studio</span>
        </button>
        <button
          onClick={onOpenAnalytics}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
        >
          <span>Radar & Charts</span>
        </button>
        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-purple-700 hover:bg-purple-50 transition-colors font-semibold"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Faculty Approvals</span>
          </button>
        )}
      </div>

      {/* Right Controls: Role Switcher & User Avatar */}
      <div className="flex items-center space-x-3">
        {/* Role Demo Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => switchRole('FACULTY')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isFaculty ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faculty
          </button>
          <button
            onClick={() => switchRole('STUDENT')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isStudent ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              isAdmin ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Circular Action Icons matching the user's design */}
        <div className="flex items-center space-x-2">
          <button
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </button>
          
          {/* User Avatar Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-800 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{user?.role || 'FACULTY'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
