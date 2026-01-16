import React, { useState, useEffect } from 'react';
import {
  Book, Brain, Activity, ChevronRight, Layout, FileText,
  Play, ArrowLeft, ArrowRight, Home, FileDigit, Sparkles, Zap
} from 'lucide-react';
import { Level, ModuleCategory, LessonModule, Lesson, Slide } from './types';
import { SlideRenderer } from './components/SlideRenderer';
import { TOPIC_APP_REGISTRY, TOPIC_IFRAME_URLS } from './components/topics/registry';

// --- MOCK CURRICULUM SKELETON (Navigation Structure) ---
const CURRICULUM_SKELETON = {
  GCSE: {
    GCSE_PAPER1: {
        title: "Paper 1: Cognition & Behaviour",
        modules: ["Memory", "Perception", "Development", "Research Methods"]
    },
    GCSE_PAPER2: {
        title: "Paper 2: Social Context",
        modules: ["Social Influence", "Language", "Brain & Neuropsychology", "Psychological Problems"]
    }
  },
  ALEVEL: {
    ALEVEL_PAPER1: {
        title: "Paper 1: Introductory Topics",
        modules: ["Social Influence", "Memory", "Attachment", "Psychopathology"]
    },
    ALEVEL_PAPER2: {
        title: "Paper 2: Psychology in Context",
        modules: ["Approaches", "Biopsychology", "Research Methods"]
    },
    ALEVEL_PAPER3: {
        title: "Paper 3: Issues and Options",
        modules: ["Issues & Debates", "Relationships", "Schizophrenia", "Aggression"]
    }
  }
};

// --- THEME HELPERS ---
const getCategoryTheme = (cat: ModuleCategory): string => {
  switch(cat) {
    case 'GCSE_PAPER1': return 'pink';
    case 'GCSE_PAPER2': return 'orange';
    case 'ALEVEL_PAPER1': return 'indigo';
    case 'ALEVEL_PAPER2': return 'purple';
    case 'ALEVEL_PAPER3': return 'teal';
    default: return 'blue';
  }
};

export default function App() {
  // Navigation State
  const [view, setView] = useState<'HOME' | 'PAPER_SELECT' | 'MODULE_LIST' | 'LESSON' | 'SUB_APP'>('HOME');
  const [level, setLevel] = useState<Level | null>(null);
  const [activeCategory, setActiveCategory] = useState<ModuleCategory | null>(null);

  // Lesson / App State
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const [slideIndex, setSlideIndex] = useState(0);

  // UI State
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Load dynamic modules registry and saved state on mount
  useEffect(() => {
    // Load modules from static JSON file
    fetch('./modules.json')
      .then(res => res.json())
      .then(data => {
        Object.assign(TOPIC_IFRAME_URLS, data);

        // Now load saved navigation state
        const savedState = localStorage.getItem('psychdeck-nav-state');
        if (savedState) {
          try {
            const state = JSON.parse(savedState);
            // Don't restore SUB_APP view to prevent getting stuck
            if (state.view === 'SUB_APP') {
              setView('HOME');
              setLevel(null);
              setActiveCategory(null);
              setCurrentTopic('');
              setSlideIndex(0);
            } else {
              setView(state.view || 'HOME');
              setLevel(state.level || null);
              setActiveCategory(state.activeCategory || null);
              setCurrentTopic(state.currentTopic || '');
              setSlideIndex(state.slideIndex || 0);
              if (state.view === 'SUB_APP') {
                setIframeLoading(true);
              }
            }
          } catch (err) {
            console.error('Failed to load saved state:', err);
          }
        }

        // Mark app as loaded
        setAppLoading(false);
      })
      .catch(err => {
        console.error('Failed to load modules:', err);
        setAppLoading(false);
      });
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      view,
      level,
      activeCategory,
      currentTopic,
      slideIndex
    };
    localStorage.setItem('psychdeck-nav-state', JSON.stringify(stateToSave));
  }, [view, level, activeCategory, currentTopic, slideIndex]);

  // --- ACTIONS ---
  const selectLevel = (l: Level) => {
    setLevel(l);
    setView('PAPER_SELECT');
  };

  const selectCategory = (c: ModuleCategory) => {
    setActiveCategory(c);
    setView('MODULE_LIST');
  };

  const startLesson = (topic: string) => {
    setCurrentTopic(topic);
    setIframeLoading(true);

    // 1. Check if an iframe URL exists for this topic
    if (TOPIC_IFRAME_URLS[topic]) {
        setView('SUB_APP');
        return;
    }

    // 2. Check if a custom React App exists for this topic in the registry
    if (TOPIC_APP_REGISTRY[topic]) {
        setView('SUB_APP');
        return;
    }

    // 3. If not, load the standard placeholder lesson generator
    const placeholderLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: topic,
      description: `Comprehensive revision module for ${topic}.`,
      slides: [
        {
          id: 's1',
          type: 'title',
          title: topic,
          content: ["AQA Psychology Revision", "Interactive Module"]
        },
        {
          id: 's2',
          type: 'content',
          title: "Topic Overview",
          content: [
            `This module covers key concepts in ${topic}.`,
            "AO1: Knowledge and Understanding of theories and studies.",
            "AO3: Critical analysis and evaluation."
          ]
        },
         {
          id: 's3',
          type: 'content',
          title: "Key Theory",
          content: [
            "Detailed explanation of the central theory.",
            "Supporting evidence and research studies.",
            "Methodological issues and implications."
          ]
        },
        {
          id: 's4',
          type: 'quiz',
          title: "Knowledge Check",
          content: ["Sample answer to a retrieval practice question."]
        }
      ]
    };

    setActiveLesson(placeholderLesson);
    setSlideIndex(0);
    setView('LESSON');
  };

  const goBack = () => {
    if (view === 'LESSON' || view === 'SUB_APP') setView('MODULE_LIST');
    else if (view === 'MODULE_LIST') setView('PAPER_SELECT');
    else if (view === 'PAPER_SELECT') setView('HOME');
  };

  // Show loading screen while app initializes
  if (appLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-6">
          <div className="inline-flex p-5 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl">
            <Brain size={56} className="text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-white">
            Psych<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Deck</span>
          </h1>
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: SUB APP (Custom React Modules or Iframes) ---
  if (view === 'SUB_APP' && currentTopic) {
      if (TOPIC_IFRAME_URLS[currentTopic]) {
          return (
              <div className="h-screen w-full bg-slate-900 flex flex-col font-sans">
                  <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-20">
                      <div className="flex items-center gap-4">
                          <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                              <ArrowLeft size={20} className="text-slate-600"/>
                          </button>
                          <div>
                              <h1 className="font-bold text-slate-800 text-lg leading-tight">{currentTopic}</h1>
                              <p className="text-xs text-slate-400">Interactive Module</p>
                          </div>
                      </div>
                  </div>
                  <div className="flex-grow relative">
                      <iframe
                          src={`${TOPIC_IFRAME_URLS[currentTopic]}?t=${Date.now()}`}
                          className={`w-full h-full border-0 transition-opacity duration-500 ${iframeLoading ? 'opacity-0' : 'opacity-100'}`}
                          style={{ backgroundColor: '#0f172a' }}
                          title={`${currentTopic} Module`}
                          onLoad={() => setIframeLoading(false)}
                      />
                      {iframeLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-300"></div>
                          </div>
                      )}
                  </div>
              </div>
          );
      } else if (TOPIC_APP_REGISTRY[currentTopic]) {
          const ActiveApp = TOPIC_APP_REGISTRY[currentTopic];
          return <ActiveApp onBack={goBack} />;
      }
  }

  // --- VIEW: LESSON PLAYER (Standard Slides) ---
  if (view === 'LESSON' && activeLesson) {
    return (
      <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={goBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-600"/>
            </button>
            <div>
                <h1 className="font-bold text-slate-800 text-lg leading-tight">{activeLesson.title}</h1>
                <p className="text-xs text-slate-400">{activeLesson.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-mono text-slate-500">
                 {level} MODE
             </div>
             <div className="text-sm font-mono text-slate-400">
                 {slideIndex + 1} / {activeLesson.slides.length}
             </div>
          </div>
        </div>

        <div className="flex-grow p-4 md:p-8 flex justify-center items-center overflow-hidden bg-slate-100">
          <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-2xl shadow-2xl overflow-hidden relative ring-1 ring-slate-900/5">
            <SlideRenderer slide={activeLesson.slides[slideIndex]} />
          </div>
        </div>

        <div className="h-24 bg-white border-t flex items-center justify-center gap-8 px-8">
          <button
            onClick={() => setSlideIndex(i => Math.max(0, i-1))}
            disabled={slideIndex === 0}
            className="p-4 hover:bg-slate-50 rounded-full disabled:opacity-30 border border-transparent hover:border-slate-200 transition-all text-slate-600"
          >
            <ArrowLeft />
          </button>

          <div className="flex-grow max-w-md h-2 bg-slate-100 rounded-full overflow-hidden">
             <div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 ease-out"
                style={{width: `${((slideIndex + 1) / activeLesson.slides.length) * 100}%`}}
             ></div>
          </div>

          <button
            onClick={() => setSlideIndex(i => Math.min(activeLesson.slides.length-1, i+1))}
            disabled={slideIndex === activeLesson.slides.length - 1}
            className="p-4 hover:bg-slate-50 rounded-full disabled:opacity-30 border border-transparent hover:border-slate-200 transition-all text-slate-600"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW: MODULE LIST (The Topics) ---
  if (view === 'MODULE_LIST' && level && activeCategory) {
    // @ts-ignore - Safe access based on skeleton
    const paperData = CURRICULUM_SKELETON[level][activeCategory];
    const themeColor = getCategoryTheme(activeCategory);

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200">
        <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center px-8 justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
             <button onClick={() => setView('HOME')} className="hover:bg-slate-800 p-2 rounded-lg"><Home className="text-slate-500 hover:text-slate-200" /></button>
             <div className="h-6 w-px bg-slate-800"></div>
             <button onClick={() => setView('PAPER_SELECT')} className="font-bold text-slate-400 hover:text-white transition-colors">
                {level === 'GCSE' ? 'GCSE (8182)' : 'A-Level (7182)'}
             </button>
             <ChevronRight size={16} className="text-slate-600"/>
             <span className={`font-bold px-3 py-1 rounded-full text-sm bg-${themeColor}-900/30 text-${themeColor}-400 border border-${themeColor}-500/20`}>
               {paperData.title}
             </span>
          </div>
        </header>

        <main className="flex-grow flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">
          {/* LEFT: Topic Selection */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="space-y-2">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Core Topics</h2>
                <p className="text-xs text-slate-600">Select a topic to launch the lesson module.</p>
            </div>

            <div className="grid gap-3">
                {paperData.modules.map((m: string) => {
                  const isInteractive = !!TOPIC_APP_REGISTRY[m] || !!TOPIC_IFRAME_URLS[m];
                  return (
                    <button
                        key={m}
                        onClick={() => startLesson(m)}
                        onMouseEnter={() => setHoveredTopic(m)}
                        onMouseLeave={() => setHoveredTopic(null)}
                        className={`flex items-center justify-between p-4 rounded-xl border bg-slate-900 border-slate-800 border-l-4 border-l-${themeColor}-500 hover:bg-slate-800 hover:shadow-md hover:shadow-${themeColor}-900/20 transition-all group text-left`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-semibold text-slate-300 group-hover:text-white`}>{m}</span>
                            {isInteractive && <Sparkles size={14} className={`text-${themeColor}-400 animate-pulse`} />}
                        </div>
                        <Play size={16} className={`text-slate-600 group-hover:text-${themeColor}-400 transition-colors`} />
                    </button>
                  );
                })}
            </div>
          </div>

          {/* RIGHT: Context/Preview Area */}
          <div className={`w-full md:w-2/3 hidden md:flex flex-col items-center justify-center bg-slate-900 rounded-2xl border border-slate-800 border-dashed p-12 text-center transition-all duration-300 ${hoveredTopic ? 'opacity-100 scale-100' : 'opacity-80 scale-95'}`}>
             {hoveredTopic ? (
               <>
                 {TOPIC_APP_REGISTRY[hoveredTopic] ? (
                    // Interactive Preview
                    <div className="animate-fadeIn flex flex-col items-center">
                        <div className={`w-32 h-32 bg-${themeColor}-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-${themeColor}-900/20 border border-${themeColor}-500/20`}>
                            <Zap size={64} className={`text-${themeColor}-400 drop-shadow-sm`} />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Interactive Simulation</h3>
                        <p className={`text-${themeColor}-400 font-bold mb-4 text-lg`}>{hoveredTopic}</p>
                        <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                            This module features immersive case studies, real-time synaptic simulations, and diagnostic tools.
                        </p>
                        <div className={`mt-8 px-6 py-2 bg-${themeColor}-900/30 text-${themeColor}-300 rounded-full text-xs font-bold uppercase tracking-widest border border-${themeColor}-500/30`}>
                            Simulated Clinical Environment
                        </div>
                    </div>
                 ) : TOPIC_IFRAME_URLS[hoveredTopic] ? (
                    // Loaded Module Preview
                    <div className="animate-fadeIn flex flex-col items-center">
                        <div className={`w-32 h-32 bg-${themeColor}-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-${themeColor}-900/20 border border-${themeColor}-500/20`}>
                            <FileText size={64} className={`text-${themeColor}-400 drop-shadow-sm`} />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-2 tracking-tight">Loaded Interactive Module</h3>
                        <p className={`text-${themeColor}-400 font-bold mb-4 text-lg`}>{hoveredTopic}</p>
                        <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
                            This module has been uploaded and includes custom interactive content, simulations, and comprehensive revision materials.
                        </p>
                        <div className={`mt-8 px-6 py-2 bg-${themeColor}-900/30 text-${themeColor}-300 rounded-full text-xs font-bold uppercase tracking-widest border border-${themeColor}-500/30`}>
                            Custom Module Content
                        </div>
                    </div>
                 ) : (
                    // Standard Preview
                    <div className="animate-fadeIn flex flex-col items-center">
                        <div className={`w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700`}>
                            <Book size={40} className={`text-slate-500`} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{hoveredTopic}</h3>
                        <p className="text-slate-400 max-w-md mx-auto text-lg">
                            Standard revision slides covering <strong className="text-slate-200">AO1</strong> (Description) and <strong className="text-slate-200">AO3</strong> (Evaluation).
                        </p>
                        <div className="mt-8 flex gap-2">
                            <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs font-mono border border-slate-700">SLIDES</span>
                            <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs font-mono border border-slate-700">QUIZ</span>
                        </div>
                    </div>
                 )}
               </>
             ) : (
               // Default State
               <div className="flex flex-col items-center opacity-30">
                 <div className={`w-24 h-24 bg-${themeColor}-500/10 rounded-full flex items-center justify-center mb-4`}>
                    <Layout size={48} className={`text-${themeColor}-500`} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white">Curriculum Explorer</h3>
                    <p className="text-slate-400 max-w-md mx-auto mt-2">
                        Hover over a topic on the left to preview its contents.
                    </p>
                 </div>
               </div>
             )}
          </div>
        </main>
      </div>
    );
  }

  // --- VIEW: PAPER SELECTION (Intermediate Screen) ---
  if (view === 'PAPER_SELECT' && level) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
         <button onClick={() => setView('HOME')} className="absolute top-8 left-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors z-20"><ArrowLeft/> Back to Home</button>

         <div className="text-center mb-16 z-10">
           <div className="inline-block p-2 px-4 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-mono mb-4">
              AQA SPECIFICATION {level === 'GCSE' ? '8182' : '7182'}
           </div>
           <h1 className="text-5xl font-black text-white mb-4 tracking-tight">{level === 'GCSE' ? 'GCSE Psychology' : 'A-Level Psychology'}</h1>
           <p className="text-slate-400 text-xl">Select a paper to access learning modules</p>
         </div>

         <div className="flex flex-wrap justify-center gap-6 z-10 max-w-6xl">
           {level === 'GCSE' ? (
             <>
               <PaperCard
                 title="Paper 1"
                 subtitle="Cognition & Behaviour"
                 icon={<Brain size={32}/>}
                 color="pink"
                 onClick={() => selectCategory('GCSE_PAPER1')}
               />
               <PaperCard
                 title="Paper 2"
                 subtitle="Social Context"
                 icon={<Activity size={32}/>}
                 color="orange"
                 onClick={() => selectCategory('GCSE_PAPER2')}
               />
             </>
           ) : (
             <>
               <PaperCard
                 title="Paper 1"
                 subtitle="Introductory Topics"
                 icon={<Book size={32}/>}
                 color="indigo"
                 onClick={() => selectCategory('ALEVEL_PAPER1')}
               />
               <PaperCard
                 title="Paper 2"
                 subtitle="Psychology in Context"
                 icon={<Layout size={32}/>}
                 color="purple"
                 onClick={() => selectCategory('ALEVEL_PAPER2')}
               />
               <PaperCard
                 title="Paper 3"
                 subtitle="Issues and Options"
                 icon={<FileDigit size={32}/>}
                 color="teal"
                 onClick={() => selectCategory('ALEVEL_PAPER3')}
               />
             </>
           )}
         </div>
      </div>
    );
  }

  // --- VIEW: HOME SCREEN ---
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[128px]"></div>
      </div>

      <div className="text-center space-y-6 mb-16 z-10">
        <div className="inline-flex p-5 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 mb-4 shadow-2xl">
          <Brain size={56} className="text-pink-500" />
        </div>
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter">Psych<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Deck</span></h1>
        <p className="text-slate-400 text-xl font-light max-w-lg mx-auto">
            The revision platform for AQA Psychology students.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 z-10">
        <LevelSelectButton
            title="GCSE"
            subtitle="Years 10 & 11"
            spec="8182"
            color="pink"
            icon={<FileText size={48} />}
            onClick={() => selectLevel('GCSE')}
        />
        <LevelSelectButton
            title="A-Level"
            subtitle="Years 12 & 13"
            spec="7182"
            color="indigo"
            icon={<Activity size={48} />}
            onClick={() => selectLevel('ALEVEL')}
        />
      </div>

      <div className="absolute bottom-8 text-slate-600 text-xs flex items-center gap-2 font-mono">
         <div className="w-2 h-2 bg-blue-500 rounded-full"></div> Standard Mode Active
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

const PaperCard = ({ title, subtitle, icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-72 group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-${color}-500 p-8 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-${color}-500/10`}
  >
    <div className={`bg-${color}-500/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-${color}-500 group-hover:text-white transition-colors text-${color}-500`}>
        {icon}
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-400">{subtitle}</p>
  </button>
);

const LevelSelectButton = ({ title, subtitle, spec, color, icon, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-72 group relative bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-${color}-500/50 p-8 rounded-3xl transition-all duration-300 text-left overflow-hidden hover:shadow-2xl hover:shadow-${color}-900/20`}
  >
    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        {icon}
    </div>
    <span className={`text-xs font-bold text-${color}-500 tracking-widest uppercase mb-2 block`}>{subtitle}</span>
    <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
    <p className="text-slate-500 text-sm font-mono">Specification {spec}</p>
  </button>
);
