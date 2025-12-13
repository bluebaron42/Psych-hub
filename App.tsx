import React, { useState, Suspense } from 'react';
import { Brain, Book, ArrowLeft, Loader, Activity } from 'lucide-react';

// --- MODULE REGISTRY ---
// Lazy load your lessons here to prevent bundle bloat
const LessonMap = {
  // Issues & Debates Unit
  'issues_01': React.lazy(() => import('./src/lessons/Issues/Lesson1')),
};

export default function App() {
  const [activeModule, setActiveModule] = useState(null);

  // --- MODULE VIEWER ---
  if (activeModule) {
    const ActiveComponent = LessonMap[activeModule];
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Global Navigation Header */}
        <div className="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center z-50">
           <button
             onClick={() => setActiveModule(null)}
             className="flex items-center gap-2 text-slate-300 hover:text-white font-bold transition-colors uppercase text-xs tracking-widest"
           >
             <ArrowLeft size={16} /> Return to Hub
           </button>
           <span className="text-slate-500 text-xs font-mono">SECURE BROWSER ENVIRONMENT</span>
        </div>

        {/* Module Content */}
        <div className="flex-grow relative">
           <Suspense fallback={
             <div className="h-full w-full flex flex-col items-center justify-center text-white gap-4 bg-gray-950">
                <Loader className="animate-spin text-teal-500" size={48} />
                <span className="font-mono text-teal-500 animate-pulse">LOADING MODULE...</span>
             </div>
           }>
             <ActiveComponent />
           </Suspense>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8 selection:bg-teal-500 selection:text-white">
      <header className="max-w-6xl mx-auto mb-16 mt-8 flex items-center gap-6 border-b border-slate-800 pb-8">
        <div className="p-4 bg-teal-500/10 rounded-2xl border border-teal-500/20">
           <Brain size={48} className="text-teal-400" />
        </div>
        <div>
           <h1 className="text-5xl font-black tracking-tighter text-white mb-1">PSYCH<span className="text-teal-400">HUB</span></h1>
           <p className="text-slate-400 font-light tracking-wide">A-Level Revision Protocol</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
         {/* Issues & Debates Section */}
         <section className="mb-12">
           <div className="flex items-center gap-3 mb-6">
              <Book className="text-red-400" />
              <h2 className="text-2xl font-bold text-white">Paper 3: Issues & Debates</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveModule('issues_01')}
                className="group relative bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-800 rounded-xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">01: Gender Bias</h3>
                </div>
                <p className="text-slate-400 text-sm">Universality, Androcentrism & Alpha/Beta Bias.</p>
              </button>
           </div>
        </section>

         {/* Schizophrenia Section (Placeholder) */}
         <section>
           <div className="flex items-center gap-3 mb-6">
              <Activity className="text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Paper 3: Schizophrenia</h2>
           </div>
           <div className="p-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-center">
             Modules currently offline.
           </div>
        </section>
      </main>
    </div>
  );
}
