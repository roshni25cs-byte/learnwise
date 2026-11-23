import React from 'react';
import { Award, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PerformanceSummaryCard({ onExploreCLO }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-700 p-5 text-white shadow-lg shadow-sky-900/10 transition-all hover:shadow-sky-900/20">
      {/* Decorative background glow circles matching UI screenshot */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-cyan-400/20 blur-lg pointer-events-none"></div>

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-cyan-100 mb-2">
            Cognitive Quotient
          </span>
          <h3 className="text-lg font-bold tracking-tight text-white">Performance Overview</h3>
          <p className="text-xs text-cyan-100/80 mt-0.5">Assessed across 6 Bloom's Taxonomy tiers</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
          <Award className="w-5 h-5 text-cyan-200" />
        </div>
      </div>

      {/* Metric Indicators */}
      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
        <div>
          <p className="text-[10px] text-cyan-200 font-medium">CLO Target</p>
          <p className="text-sm font-extrabold text-white">18 / 24</p>
        </div>
        <div className="border-x border-white/15 px-2">
          <p className="text-[10px] text-cyan-200 font-medium">Mastery Index</p>
          <p className="text-sm font-extrabold text-white">4.3 / 6.0</p>
        </div>
        <div>
          <p className="text-[10px] text-cyan-200 font-medium">Cohort Pass</p>
          <p className="text-sm font-extrabold text-emerald-300">86.4%</p>
        </div>
      </div>

      {/* Progress ring & Pill Action matching screenshot */}
      <div className="relative z-10 mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full border-2 border-white/60 border-t-white flex items-center justify-center font-bold text-[11px]">
            78%
          </div>
          <span className="text-xs font-semibold text-white">Optimal Competency</span>
        </div>
        <button
          onClick={onExploreCLO}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white text-sky-800 text-xs font-bold shadow-sm hover:bg-cyan-50 transition-colors"
        >
          <span>View Matrix</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
