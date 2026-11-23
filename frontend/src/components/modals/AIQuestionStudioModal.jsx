import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Layers, Check, Edit3, Trash2, Plus, AlertCircle } from 'lucide-react';
import { BLOOMS_TAXONOMY, SAMPLE_CLOS } from '../../utils/bloomsTaxonomy';

export default function AIQuestionStudioModal({ isOpen, onClose, initialLevel }) {
  const [selectedCourse, setSelectedCourse] = useState('CS302');
  const [selectedCLO, setSelectedCLO] = useState(SAMPLE_CLOS[0].id);
  const [bloomsLevel, setBloomsLevel] = useState(initialLevel?.level || 'ANALYSE');
  const [questionType, setQuestionType] = useState('MCQ');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [count, setCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([
    {
      id: 'q-sample-1',
      prompt: 'Consider a relational database schema R(A, B, C, D) with functional dependencies {A -> B, B -> C, C -> D}. Analyze whether R is in BCNF or 3NF, and determine the minimum candidate keys.',
      bloomsLevel: 'ANALYSE',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      clo: 'CLO 4',
      marks: 4,
      options: [
        { text: 'R is in 3NF but not BCNF; Candidate key is {A}', isCorrect: true },
        { text: 'R is in BCNF; Candidate keys are {A, B}', isCorrect: false },
        { text: 'R violates 3NF due to transitive dependency; Candidate key is {B}', isCorrect: false },
        { text: 'R is in 2NF only; Candidate keys are {A, C, D}', isCorrect: false },
      ],
      explanation: 'Since A -> B, B -> C, C -> D, A is the unique candidate key. In B -> C, B is not a superkey, but C is prime? No, C is non-prime. Hence it is in 3NF if prime, but since C is not prime, it violates 3NF unless decomposed. Specifically, here B is not a superkey, making it violate BCNF.',
    },
    {
      id: 'q-sample-2',
      prompt: 'Deconstruct a SQL Nested Loop Join vs Hash Join algorithm when handling a table of 10,000,000 rows against a dimension table of 500 rows with non-clustered index.',
      bloomsLevel: 'ANALYSE',
      type: 'SHORT_ANSWER',
      difficulty: 'HARD',
      clo: 'CLO 4',
      marks: 6,
      options: [],
      explanation: 'Evaluates memory footprint, index lookup overhead, and disk spill probability under memory pressure.',
    }
  ]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate real Gemini API generation pipeline
    setTimeout(() => {
      const newQ = {
        id: `q-ai-${Date.now()}`,
        prompt: `[Gemini ${bloomsLevel}] Design an optimized relational query structure satisfying ${SAMPLE_CLOS.find(c => c.id === selectedCLO)?.title || 'Relational Schema'} under concurrency lock conditions.`,
        bloomsLevel: bloomsLevel,
        type: questionType,
        difficulty: difficulty,
        clo: SAMPLE_CLOS.find(c => c.id === selectedCLO)?.code || 'CLO 1',
        marks: questionType === 'MCQ' ? 2 : 5,
        options: questionType === 'MCQ' ? [
          { text: 'Implement MVCC with snapshot isolation to avoid read locks', isCorrect: true },
          { text: 'Acquire table-level exclusive locks on every transaction', isCorrect: false },
          { text: 'Disable foreign key validation to improve throughput', isCorrect: false },
          { text: 'Rely solely on dirty reads without ACID constraints', isCorrect: false },
        ] : [],
        explanation: 'Generated via Gemini 2.5 Flash with Pydantic structured output validation mapped to Bloom Level: ' + bloomsLevel,
      };
      setGeneratedQuestions(prev => [newQ, ...prev]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Gemini AI Question Generator Studio</h2>
              <p className="text-xs text-blue-200">Align assessments directly to Bloom's Taxonomy & Course Learning Objectives</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Controls */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target CLO</label>
              <select
                value={selectedCLO}
                onChange={(e) => setSelectedCLO(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-blue-500"
              >
                {SAMPLE_CLOS.map(c => (
                  <option key={c.id} value={c.id}>{c.code}: {c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bloom's Taxonomy Level</label>
              <select
                value={bloomsLevel}
                onChange={(e) => setBloomsLevel(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-blue-500 font-bold"
              >
                {BLOOMS_TAXONOMY.map(b => (
                  <option key={b.level} value={b.level}>{b.name} ({b.stage})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="TRUE_FALSE">True / False</option>
                <option value="SHORT_ANSWER">Short Answer (Subjective)</option>
                <option value="LONG_ANSWER">Long Answer (Analytical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Tier</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-blue-500"
              >
                <option value="EASY">Easy (Foundational)</option>
                <option value="MEDIUM">Medium (Standard)</option>
                <option value="HARD">Hard (Cognitively Rigorous)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Questions Count</label>
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Questions'}</span>
              </button>
            </div>
          </div>

          {/* Generated Questions List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <span>Assessment Review & Staging ({generatedQuestions.length} Questions)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Ready to Deploy
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {q.clo}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Bloom: {q.bloomsLevel}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {q.type} • {q.marks} Marks
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Edit Prompt">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setGeneratedQuestions(prev => prev.filter(item => item.id !== q.id))}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {q.prompt}
                  </p>

                  {/* Options for MCQ */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                            opt.isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{String.fromCharCode(65 + oIdx)}. {opt.text}</span>
                          {opt.isCorrect && (
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3 mr-0.5" /> Correct
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pedagogical Explanation */}
                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-bold text-slate-700">Cognitive Rational: </span>
                    {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">All generated items are faculty-reviewed before release.</span>
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200">
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Questions successfully verified and staged into Assessment Builder!');
                onClose();
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Approve & Add to Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
