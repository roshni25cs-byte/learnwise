import React from 'react';
import { Target, CheckSquare, Layers } from 'lucide-react';

export default function LearningGoalsCard() {
  const goals = [
    { title: 'Higher-Order Bloom Mastery', progress: 72, target: 'Level 4 to 6' },
    { title: 'Database Normalization CLO 3', progress: 85, target: '3NF & BCNF' },
    { title: 'Distributed Transactions', progress: 45, target: '2PC Protocol' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Target Learning Goals</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">Term 1</span>
      </div>

      <div className="space-y-3">
        {goals.map((goal, idx) => (
          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">{goal.title}</span>
              <span className="text-teal-600 font-bold">{goal.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>Target: {goal.target}</span>
              <span className="text-slate-500 font-medium">Evidence-Based</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
