import React from 'react';
import { BLOOMS_TAXONOMY } from '../../utils/bloomsTaxonomy';
import { 
  BrainCircuit, 
  Lightbulb, 
  Wrench, 
  SearchCode, 
  Scale, 
  Sparkles,
  ChevronRight,
  BarChart3
} from 'lucide-react';

const icons = [BrainCircuit, Lightbulb, Wrench, SearchCode, Scale, Sparkles];

export default function BloomsMasterySidebar({ onSelectLevel, onOpenAnalytics }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Emerald gradient header matching user's uploaded screenshot */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Taxonomy Tracking
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">CLO & Bloom's Mastery</h3>
          </div>
          <button
            onClick={onOpenAnalytics}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            title="Open Full Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-emerald-100/90 mt-1">
          Continuous assessment mapping across 6 cognitive dimensions
        </p>
      </div>

      {/* Vertical list of 6 Cognitive Level cards matching screenshot */}
      <div className="p-3.5 space-y-2.5 flex-1 overflow-y-auto">
        {BLOOMS_TAXONOMY.map((item, idx) => {
          const Icon = icons[idx] || Sparkles;
          return (
            <div
              key={item.level}
              onClick={() => onSelectLevel(item)}
              className="group cursor-pointer p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all"
            >
              <div className="flex items-start space-x-3">
                {/* Circular Icon badge matching user's image */}
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-slate-700">
                      {item.defaultMastery}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                    {item.description}
                  </p>

                  {/* Horizontal progress bar matching UI design */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                      style={{ width: `${item.defaultMastery}%` }}
                    ></div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 self-center flex-shrink-0 transition-colors" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-500">
          Source: Bloom's Revised Taxonomy (Anderson & Krathwohl)
        </p>
      </div>
    </div>
  );
}
