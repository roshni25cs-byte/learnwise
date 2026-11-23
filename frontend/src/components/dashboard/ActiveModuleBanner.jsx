import React from 'react';
import { BookMarked, Sparkles, Clock, Layers } from 'lucide-react';

export default function ActiveModuleBanner({ onNewAssessment }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-5 text-white shadow-md shadow-teal-900/10">
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-sm text-teal-100">
              Active Module Focus
            </span>
            <span className="text-xs text-teal-100 font-medium flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Term 2 • Week 7
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            CS302: Advanced Relational Data & Cognitive Architecture
          </h2>
          <p className="text-xs text-teal-100/90 max-w-xl">
            Currently mapping student submissions to CLO 4 (Query Optimization) & CLO 5 (Indexing Strategies) under Bloom's Taxonomy.
          </p>
        </div>

        <button
          onClick={onNewAssessment}
          className="flex-shrink-0 flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-sm hover:bg-teal-50 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Module Completion Indicator */}
      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-teal-200 font-medium">Syllabus Coverage:</span>
          <span className="font-bold text-white">4 of 6 Modules Completed (66%)</span>
        </div>
        <div className="w-36 bg-black/20 rounded-full h-2 overflow-hidden">
          <div className="bg-emerald-300 h-full rounded-full" style={{ width: '66%' }}></div>
        </div>
      </div>
    </div>
  );
}
