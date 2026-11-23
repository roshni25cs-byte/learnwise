import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

export default function ExamInterfaceModal({ isOpen, onClose, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreReport, setScoreReport] = useState(null);

  const questions = [
    {
      id: 1,
      clo: 'CLO 1',
      blooms: 'REMEMBER',
      prompt: 'Which of the following database constraints guarantees that a tuple cannot contain duplicate non-null entries for specified candidate columns?',
      marks: 2,
      options: [
        'FOREIGN KEY Constraint',
        'UNIQUE Constraint',
        'CHECK Constraint',
        'CASCADE Constraint',
      ],
      correctIndex: 1,
    },
    {
      id: 2,
      clo: 'CLO 2',
      blooms: 'UNDERSTAND',
      prompt: 'In Relational Algebra, what is the primary distinction between Cartesian Product (R × S) and Natural Join (R ⋈ S)?',
      marks: 3,
      options: [
        'Natural Join retains duplicate tuples without checking attributes.',
        'Natural Join pairs tuples only where common attribute names share identical values.',
        'Cartesian Product performs an automatic projection over common keys.',
        'Cartesian Product is commutative whereas Natural Join is not.',
      ],
      correctIndex: 1,
    },
    {
      id: 3,
      clo: 'CLO 4',
      blooms: 'ANALYSE',
      prompt: 'A query planner switches from Index Scan to Sequential Scan when a query filters on a non-clustered indexed column. What is the most plausible technical cause?',
      marks: 5,
      options: [
        'The query predicate returns a large fraction of table rows, causing random I/O cost to exceed sequential read cost.',
        'The database engine ran out of memory locks on the index root page.',
        'Non-clustered indexes cannot handle equality predicates.',
        'Sequential scans are always preferred by the cost-based optimizer regardless of row count.',
      ],
      correctIndex: 0,
    },
  ];

  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const handleSelect = (optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx,
    }));
  };

  const handleSubmit = () => {
    let earned = 0;
    let total = 0;
    const details = questions.map((q, idx) => {
      total += q.marks;
      const isCorrect = selectedAnswers[idx] === q.correctIndex;
      if (isCorrect) earned += q.marks;
      return {
        question: q.prompt,
        clo: q.clo,
        blooms: q.blooms,
        isCorrect,
        awarded: isCorrect ? q.marks : 0,
        max: q.marks,
      };
    });

    const report = {
      earned,
      total,
      percentage: Math.round((earned / total) * 100),
      details,
    };

    setScoreReport(report);
    setIsSubmitted(true);
    if (onComplete) onComplete(report);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Continuous Assessment</span>
            <h2 className="text-lg font-bold">CS302 Assessment: Relational Architecture & Optimization</h2>
          </div>

          <div className="flex items-center space-x-3">
            {!isSubmitted && (
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-cyan-200" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <div className="space-y-5">
              {/* Question Navigation Palette */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700">Question {currentIdx + 1} of {questions.length}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {currentQ.clo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    Bloom's: {currentQ.blooms}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentIdx === idx
                          ? 'bg-blue-600 text-white shadow-sm'
                          : selectedAnswers[idx] !== undefined
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {currentQ.prompt}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <span>
                        <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800">Assessment Completed & Evaluated!</h3>
                <p className="text-xs text-slate-500 mt-1">Objective questions auto-graded against verified answer keys</p>
              </div>

              {/* Score Card */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Marks Awarded</p>
                  <p className="text-lg font-black text-slate-800">{scoreReport.earned} / {scoreReport.total}</p>
                </div>
                <div className="border-x border-slate-200 px-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</p>
                  <p className="text-lg font-black text-blue-600">{scoreReport.percentage}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Competency</p>
                  <p className={`text-lg font-black ${scoreReport.percentage >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {scoreReport.percentage >= 70 ? 'Proficient' : 'Support Needed'}
                  </p>
                </div>
              </div>

              {/* Question Breakdown */}
              <div className="text-left space-y-2.5 max-w-xl mx-auto pt-2">
                <h4 className="text-xs font-bold text-slate-700">Question Itemization</h4>
                {scoreReport.details.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Q{idx + 1}: {item.clo} ({item.blooms})</span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{item.question}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.awarded} / {item.max} Marks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40"
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-900"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
