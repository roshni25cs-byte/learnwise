import React, { useState } from 'react';
import { X, BarChart3, PieChart, TrendingUp, Radar, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

export default function AnalyticsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('blooms'); // blooms, clos, distribution, trend

  if (!isOpen) return null;

  // 6-Axis Bloom's Taxonomy Cognitive Radar Data
  const bloomsRadarData = [
    { subject: 'Remember', studentScore: 88, classAverage: 82, fullMark: 100 },
    { subject: 'Understand', studentScore: 82, classAverage: 78, fullMark: 100 },
    { subject: 'Apply', studentScore: 74, classAverage: 71, fullMark: 100 },
    { subject: 'Analyse', studentScore: 68, classAverage: 65, fullMark: 100 },
    { subject: 'Evaluate', studentScore: 59, classAverage: 62, fullMark: 100 },
    { subject: 'Create', studentScore: 52, classAverage: 55, fullMark: 100 },
  ];

  // CLO Achievement Bar Data
  const cloBarData = [
    { clo: 'CLO 1', achieved: 92, target: 80, title: 'Relational Principles' },
    { clo: 'CLO 2', achieved: 84, target: 75, title: 'Algebraic Queries' },
    { clo: 'CLO 3', achieved: 76, target: 70, title: 'SQL Schema' },
    { clo: 'CLO 4', achieved: 68, target: 65, title: 'Query Optimization' },
    { clo: 'CLO 5', achieved: 58, target: 60, title: 'Indexing & Sharding' },
    { clo: 'CLO 6', achieved: 50, target: 60, title: 'Distributed Storage' },
  ];

  // Cohort Distribution Pie Data
  const distributionPieData = [
    { name: 'Exceeding (>=80%)', value: 142, color: '#10B981' },
    { name: 'Proficient (65-79%)', value: 48, color: '#0284C7' },
    { name: 'Developing (50-64%)', value: 14, color: '#F59E0B' },
    { name: 'Needs Intervention (<50%)', value: 5, color: '#EF4444' },
  ];

  // Progression Line Data
  const trendLineData = [
    { exam: 'Quiz 1', remember: 75, apply: 60, create: 40 },
    { exam: 'Assignment 1', remember: 82, apply: 68, create: 45 },
    { exam: 'Midterm Exam', remember: 85, apply: 72, create: 50 },
    { exam: 'Quiz 2', remember: 88, apply: 74, create: 52 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Educational Learning Analytics & Bloom's Radar</h2>
              <p className="text-xs text-emerald-100">Evaluated against Course Learning Objectives with Recharts</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 bg-slate-50 space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('blooms')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'blooms'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            6-Axis Bloom's Radar
          </button>
          <button
            onClick={() => setActiveTab('clos')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'clos'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            CLO Achievement Matrix
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'distribution'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cohort Performance Distribution
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`pb-2.5 px-3 border-b-2 transition-all ${
              activeTab === 'trend'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Longitudinal Progress
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'blooms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-80 w-full flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={bloomsRadarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
                    <RechartsRadar name="Cohort Average" dataKey="classAverage" stroke="#0D9488" fill="#0D9488" fillOpacity={0.2} />
                    <RechartsRadar name="Target Mastery" dataKey="studentScore" stroke="#2563EB" fill="#2563EB" fillOpacity={0.4} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                  <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-1">Diagnostic Summary</h4>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    Students display superior mastery in lower-order cognitive dimensions (<strong>Remember 88%</strong>, <strong>Understand 82%</strong>). Higher-order evaluation and synthesis tiers (<strong>Evaluate 59%</strong>, <strong>Create 52%</strong>) reflect an achievement gap requiring targeted instructional activities.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">Bloom's Mastery Thresholds</h4>
                  {bloomsRadarData.map((b) => (
                    <div key={b.subject} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700">{b.subject}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-[11px] text-slate-500">Benchmark: {b.classAverage}%</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          b.studentScore >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.studentScore}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clos' && (
            <div className="space-y-6">
              <div className="h-80 w-full bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cloBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <XAxis dataKey="clo" tick={{ fontSize: 12, fontWeight: 700 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="achieved" name="Student Achievement %" fill="#0D9488" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Course Threshold %" fill="#94A3B8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cloBarData.map((c) => (
                  <div key={c.clo} className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{c.clo}: {c.title}</span>
                      <p className="text-[10px] text-slate-500">Threshold: {c.target}% • Actual: {c.achieved}%</p>
                    </div>
                    {c.achieved >= c.target ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Attained
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Gap
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-72 w-full flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={distributionPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {distributionPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cohort Breakdown (209 Total)</h4>
                {distributionPieData.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800">{item.value} Students</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trend' && (
            <div className="h-80 w-full bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendLineData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="exam" tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="remember" name="Level 1: Remember" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="apply" name="Level 3: Apply" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="create" name="Level 6: Create" stroke="#9333EA" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 transition-colors">
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
