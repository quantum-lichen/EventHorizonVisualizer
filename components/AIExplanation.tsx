import React, { useState } from 'react';
import { explainPhysics } from '../services/geminiService';
import { LoadingState } from '../types';
import { SAMPLE_QUESTIONS } from '../constants';

interface AIExplanationProps {
  radius: number;
}

const AIExplanation: React.FC<AIExplanationProps> = ({ radius }) => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [explanation, setExplanation] = useState<string>("");
  const [customQuestion, setCustomQuestion] = useState("");

  const handleAsk = async (question?: string) => {
    setLoadingState(LoadingState.LOADING);
    const result = await explainPhysics(radius, question);
    setExplanation(result);
    setLoadingState(LoadingState.SUCCESS);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
           <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           AI Physicist
        </h3>
        <p className="text-xs text-zinc-500 mt-1">Powered by Gemini 2.5 Flash</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto min-h-[200px] max-h-[400px]">
        {loadingState === LoadingState.IDLE && (
          <div className="text-zinc-500 text-sm italic text-center mt-10">
            Select a question below or ask your own to analyze the current simulation state.
          </div>
        )}
        
        {loadingState === LoadingState.LOADING && (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && (
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-zinc-300 whitespace-pre-line leading-relaxed">
              {explanation}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="flex flex-wrap gap-2 mb-4">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAsk(q)}
              className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors border border-zinc-700"
            >
              {q}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Ask a custom question..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-zinc-600"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(customQuestion)}
          />
          <button 
            onClick={() => handleAsk(customQuestion)}
            disabled={loadingState === LoadingState.LOADING}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIExplanation;