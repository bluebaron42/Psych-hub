import React from 'react';
import { Brain } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 rounded-xl">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-pink-100">
            <Brain size={48} className="text-pink-500 animate-bounce" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Consulting the Archives</h3>
      <p className="text-slate-500 animate-pulse">Gemini is structuring your lesson plan...</p>
    </div>
  );
};
