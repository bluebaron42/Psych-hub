import React from 'react';
import { Slide } from '../types';
import { Brain, HelpCircle } from 'lucide-react';

interface SlideRendererProps {
  slide: Slide;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  if (slide.type === 'title') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in p-12">
        <div className="p-6 bg-pink-50 rounded-full mb-4">
          <Brain size={64} className="text-pink-600" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
          {slide.title}
        </h1>
        <div className="w-32 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
        <div className="space-y-2">
          {slide.content?.map((line, i) => (
            <p key={i} className="text-xl text-slate-500 font-light">{line}</p>
          ))}
        </div>
      </div>
    );
  }

  if (slide.type === 'quiz') {
    return (
       <div className="h-full flex flex-col p-12 animate-slide-up bg-slate-50/50">
         <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-200">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
               <HelpCircle size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Knowledge Check</h2>
         </div>
         
         <div className="flex-grow flex flex-col justify-center items-center space-y-8">
            <h3 className="text-4xl font-bold text-center text-slate-900">{slide.title}</h3>
            
            <div className="w-full max-w-2xl">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-all">
                  <span className="text-lg text-slate-500">Reveal Answer</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-slate-700 mt-4 bg-purple-50 p-6 rounded-xl border border-purple-100 animate-fade-in">
                  <ul className="list-disc pl-5 space-y-2">
                    {slide.content.map((c, i) => <li key={i} className="text-lg">{c}</li>)}
                  </ul>
                </div>
              </details>
            </div>
         </div>
       </div>
    )
  }

  // Default Content Slide
  return (
    <div className="h-full flex flex-col p-8 md:p-12 animate-slide-up relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full -mr-32 -mt-32 z-0 opacity-50"></div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 border-b-2 border-slate-100 pb-6 relative z-10">
        {slide.title}
      </h2>
      
      <div className="space-y-6 relative z-10 overflow-y-auto pr-4 custom-scrollbar">
        {slide.content?.map((point, i) => (
          <div key={i} className="flex gap-4 text-lg md:text-xl text-slate-700 group">
            <div className="min-w-3 h-3 mt-3 rounded-full bg-pink-400 group-hover:bg-pink-600 transition-colors shadow-sm" />
            <p className="leading-relaxed">{point}</p>
          </div>
        ))}
      </div>

      {slide.speakerNotes && (
        <div className="mt-auto pt-6 border-t border-dashed border-slate-200">
           <p className="text-xs text-slate-400 font-mono">TEACHER NOTE: {slide.speakerNotes}</p>
        </div>
      )}
    </div>
  );
};
