import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';

export default function AICommandBar({ onQuickPrompt }) {
  const [prompt, setPrompt] = useState('');
  const [selectedBloom, setSelectedBloom] = useState('ANALYSE');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onQuickPrompt(prompt, selectedBloom);
    setPrompt('');
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <Wand2 className="w-4 h-4" />
          </div>
          <select
            value={selectedBloom}
            onChange={(e) => setSelectedBloom(e.target.value)}
            className="text-xs font-bold text-blue-900 bg-blue-50/80 border border-blue-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="REMEMBER">Remember (Recall)</option>
            <option value="UNDERSTAND">Understand (Explain)</option>
            <option value="APPLY">Apply (Solve)</option>
            <option value="ANALYSE">Analyse (Deconstruct)</option>
            <option value="EVALUATE">Evaluate (Critique)</option>
            <option value="CREATE">Create (Design)</option>
          </select>
        </div>

        {/* Input prompt matching search bar at bottom of screenshot */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Gemini: Generate 3 MCQ questions on BCNF Normalization with explanation..."
            className="w-full pl-3.5 pr-24 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </div>
      </form>
    </div>
  );
}
