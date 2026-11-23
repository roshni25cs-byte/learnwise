import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';

export default function DistributionCard({ onViewDetails }) {
  const distributionItems = [
    {
      label: 'Exceeding CLO Thresholds',
      count: '142 Students',
      percent: 68,
      color: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    {
      label: 'On-Track (Cognitive Parity)',
      count: '48 Students',
      percent: 23,
      color: 'bg-blue-500',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
    },
    {
      label: 'Requires Learning Support',
      count: '19 Students',
      percent: 9,
      color: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Assessment Distribution</h3>
          <p className="text-xs text-slate-500">Cohort performance across examinations</p>
        </div>
        <button
          onClick={onViewDetails}
          className="text-xs text-blue-600 font-semibold hover:text-blue-800 flex items-center"
        >
          <span>Details</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      <div className="space-y-4">
        {distributionItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.badgeBg}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-slate-700">{item.label}</span>
                </div>
                <span className="font-bold text-slate-800">{item.percent}%</span>
              </div>

              {/* Progress bar matching UI screenshot */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-500`}
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>

              <p className="text-[10px] text-slate-400 font-medium text-right">{item.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
