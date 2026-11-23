import React from 'react';
import { BLOOMS_TAXONOMY } from '../../utils/bloomsTaxonomy';
import { 
  BrainCircuit, 
  Lightbulb, 
  Wrench, 
  SearchCode, 
  Scale, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const icons = [BrainCircuit, Lightbulb, Wrench, SearchCode, Scale, Sparkles];

export default function BloomsActionGrid({ onSelectLevel }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Bloom's Taxonomy Cognitive Engine</h3>
          <p className="text-xs text-slate-500">Select any cognitive level to generate questions or review analytics</p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          6 Levels Active
        </span>
      </div>

      {/* Grid of 6 Circular/Card Elements matching the uploaded image */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {BLOOMS_TAXONOMY.map((item, idx) => {
          const Icon = icons[idx] || Sparkles;
          return (
            <button
              key={item.level}
              onClick={() => onSelectLevel(item)}
              className="group relative flex flex-col items-center text-center p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
            >
              {/* Circular Icon with rich gradient matching the screenshot */}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md mb-2.5 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                {item.stage}
              </span>

              {/* Progress mini tag */}
              <div className="mt-2 flex items-center space-x-1">
                <span className="text-[10px] font-extrabold text-slate-700">
                  {item.defaultMastery}%
                </span>
                <span className="text-[9px] text-slate-400">Mastery</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
