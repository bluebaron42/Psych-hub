import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Users, Clock, CheckCircle, X, Menu, 
  Layers, Dna, Eye, EyeOff, Search, 
  GitMerge, Activity,
  ChevronRight, ChevronLeft, Projector, Maximize2, Minimize2,
  Trophy, Zap, HeartCrack,
  Star, AlertTriangle, RefreshCcw,
  MessageCircle, Target, RefreshCw, MessageSquare, Smartphone, Wrench, Briefcase, Send,
  Coffee, Smile, Frown, Meh, Filter, ArrowDown, PenTool, Baby, Timer
} from 'lucide-react';

// ==========================================
// 1. DATA: LESSON CONTENT
// ==========================================

const lessons = [
  { id: 1, title: "01: Evolutionary Explanations", active: true, complete: true },
  { id: 2, title: "02: Physical Attractiveness", active: true, complete: true },
  { id: 3, title: "03: Self Disclosure", active: true, complete: true },
  { id: 4, title: "04: Filter Theory", active: true, complete: false },
  { id: 5, title: "05: Social Exchange Theory", active: false, complete: false },
  { id: 6, title: "06: Equity Theory", active: false, complete: false },
  { id: 7, title: "07: Rusbult's Investment Model", active: false, complete: false },
  { id: 8, title: "08: Duck's Phase Model", active: false, complete: false },
  { id: 9, title: "09: Virtual Relationships", active: false, complete: false },
  { id: 10, title: "10: Parasocial Relationships", active: false, complete: false },
];

const lesson1DoNow = [
  { id: 1, question: "Biological Approach: What is the main driver of behaviour according to evolution?", options: ["Happiness", "Survival and Reproduction", "Self-Actualisation"], correct: 1 },
  { id: 2, question: "Issues & Debates: Evolutionary explanations are an example of...", options: ["Biological Determinism", "Soft Determinism", "Cultural Relativism"], correct: 0 },
  { id: 3, question: "Genetics: How many chromosomes are in a human gamete (sex cell)?", options: ["46", "23", "2"], correct: 1 },
  { id: 4, question: "Methods: Which method allows researchers to study behaviour across 37 different cultures?", options: ["Lab Experiment", "Case Study", "Cross-Cultural Survey"], correct: 2 },
  { id: 5, question: "Year 1 Recap: Which attachment type is associated with 'cold' parenting?", options: ["Secure", "Insecure-Resistant", "Insecure-Avoidant"], correct: 2 }
];

const lesson2DoNow = [
  { id: 1, question: "Lesson 1 Recap: What is 'Anisogamy'?", options: ["The difference between male and female gametes", "The similarity between sexes", "A type of courtship ritual"], correct: 0 },
  { id: 2, question: "Lesson 1 Recap: Inter-sexual selection is the preferred strategy of...", options: ["Males (Quantity)", "Females (Quality)", "Both equally"], correct: 1 },
  { id: 3, question: "Lesson 1 Recap: What did Clark & Hatfield (1989) find?", options: ["75% of women agreed to casual sex", "0% of women agreed to casual sex", "Men were choosier than women"], correct: 1 },
  { id: 4, question: "Lesson 1 Recap: According to Buss (1989), men universally value...", options: ["Financial prospects", "Ambition", "Youth and physical attractiveness"], correct: 2 },
  { id: 5, question: "Lesson 1 Recap: Intra-sexual selection leads to...", options: ["Sexual Dimorphism (e.g. men being larger)", "Peaceful co-existence", "Runaway selection"], correct: 0 }
];

const lesson3DoNow = [
  { id: 1, question: "Lesson 2 Recap: What is the 'Halo Effect'?", options: ["The belief that attractive people possess other positive traits", "The belief that opposites attract", "The idea that we like people who are similar to us"], correct: 0 },
  { id: 2, question: "Lesson 2 Recap: The Matching Hypothesis states we choose partners who are...", options: ["More attractive than us", "Of similar attractiveness to us", "Less attractive than us"], correct: 1 },
  { id: 3, question: "Lesson 2 Recap: Why might we compromise on attractiveness according to Walster?", options: ["To save money", "To avoid rejection", "Because we are biologically programmed to"], correct: 1 },
  { id: 4, question: "Lesson 2 Recap: Which feature is an evolutionary signal of genetic fitness?", options: ["Facial Symmetry", "Eye Colour", "Hair Length"], correct: 0 },
  { id: 5, question: "Lesson 2 Recap: Neoteny refers to...", options: ["Old-age features", "Baby-face features", "Aggressive features"], correct: 1 }
];

const lesson4DoNow = [
  { id: 1, question: "Lesson 3 Recap: Which theory uses the 'Onion Metaphor'?", options: ["Social Exchange Theory", "Social Penetration Theory", "Filter Theory"], correct: 1 },
  { id: 2, question: "Lesson 3 Recap: At the start of a relationship, disclosure usually has...", options: ["High Depth, Low Breadth", "High Breadth, Low Depth", "High Breadth, High Depth"], correct: 1 },
  { id: 3, question: "Lesson 3 Recap: Reis & Shaver (1988) argued that for intimacy to develop, disclosure must be...", options: ["Reciprocal", "One-sided", "Constant"], correct: 0 },
  { id: 4, question: "Lesson 3 Recap: What happens if you reveal 'High Depth' information too early?", options: ["It builds trust immediately", "It violates social norms (TMI)", "It increases attraction"], correct: 1 },
  { id: 5, question: "Lesson 3 Recap: Which layer contains your deepest fears and secrets?", options: ["The Outer Shell", "The Middle Layer", "The Inner Core"], correct: 2 }
];

// ==========================================
// 2. SHARED UI COMPONENTS
// ==========================================

interface PhaseHeaderProps {
  phase: string;
  title: string;
  icon: React.ElementType;
  time?: string;
  isPresentation: boolean;
}

const PhaseHeader: React.FC<PhaseHeaderProps> = ({ phase, title, icon: Icon, time, isPresentation }) => (
  <div className={`flex items-center justify-between border-b border-gray-700 transition-all ${isPresentation ? 'mb-4 pb-2' : 'mb-6 pb-4'}`}>
    <div className="flex items-center gap-3">
      <div className={`rounded-xl border border-pink-500/30 transition-all ${isPresentation ? 'p-2 bg-pink-900/50' : 'p-3 bg-pink-900/30'}`}>
        <Icon size={isPresentation ? 48 : 28} className="text-pink-400" />
      </div>
      <div>
        <h4 className={`font-bold text-pink-400 uppercase tracking-widest transition-all ${isPresentation ? 'text-lg mb-1' : 'text-[10px] mb-0.5'}`}>{phase}</h4>
        <h2 className={`font-bold text-gray-100 transition-all ${isPresentation ? 'text-5xl' : 'text-3xl'}`}>{title}</h2>
      </div>
    </div>
    {time && (
      <div className={`flex items-center gap-2 text-gray-500 font-mono bg-gray-900 rounded-full border border-gray-800 transition-all ${isPresentation ? 'text-xl px-5 py-2' : 'text-xs px-2 py-1'}`}>
        <Clock size={isPresentation ? 24 : 12} /> {time}
      </div>
    )}
  </div>
);

interface SlideProps {
  children: React.ReactNode;
  isPresentation: boolean;
}

const Slide: React.FC<SlideProps> = ({ children, isPresentation }) => (
  <div className={`flex flex-col h-full animate-fadeIn text-gray-100 mx-auto w-full transition-all duration-300 ${isPresentation ? 'p-6 max-w-[98vw] text-2xl' : 'p-8 max-w-7xl text-base'}`}>
    <div className={`flex-grow overflow-y-auto pr-2 custom-scrollbar flex flex-col ${isPresentation ? 'gap-6' : 'gap-6'}`}>
      {children}
    </div>
  </div>
);

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const DoNowQuiz: React.FC<{ questions: Question[]; isPresentation: boolean }> = ({ questions, isPresentation }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  
  const handleSelect = (qId: number, optionIdx: number) => setAnswers(prev => ({...prev, [qId]: optionIdx}));
  const score = Object.keys(answers).reduce((acc, qId) => acc + (answers[Number(qId)] === questions[Number(qId)-1].correct ? 1 : 0), 0);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 h-full content-start transition-all ${isPresentation ? 'gap-12' : 'gap-6'}`}>
      <div className="space-y-4">
        <div className={`bg-pink-900/20 rounded-xl border border-pink-500/30 ${isPresentation ? 'p-10' : 'p-5'}`}>
          <h3 className={`font-bold text-white mb-2 ${isPresentation ? 'text-4xl' : 'text-lg'}`}>Task: Activation & Retrieval</h3>
          <p className={`text-gray-300 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Activate your psychological knowledge.</p>
        </div>
        <div className={`flex flex-col ${isPresentation ? 'gap-6' : 'gap-3'}`}>
           {!showResults ? (
             <>
              <button onClick={() => setShowResults(true)} disabled={Object.keys(answers).length < 5} className={`bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white rounded-lg font-bold w-full transition-all shadow-lg ${isPresentation ? 'px-12 py-8 text-3xl' : 'px-8 py-3'}`}>Submit Answers</button>
              <button onClick={() => setShowResults(true)} className={`bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg font-semibold w-full transition-all ${isPresentation ? 'px-12 py-6 text-2xl' : 'px-8 py-2 text-sm'}`}>Reveal All Answers</button>
             </>
           ) : (
            <div className={`bg-green-900/20 border border-green-500/50 rounded-lg w-full text-center animate-fadeIn ${isPresentation ? 'p-10' : 'p-4'}`}>
              <span className={`font-bold text-green-400 block mb-1 ${isPresentation ? 'text-6xl mb-4' : 'text-2xl'}`}>Score: {score} / 5</span>
              <span className={`text-gray-400 ${isPresentation ? 'text-2xl' : 'text-xs'}`}>Check corrections on the right.</span>
            </div>
           )}
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-full">
        {questions.map((q) => (
          <div key={q.id} className={`bg-gray-800 rounded-lg border border-gray-700 ${isPresentation ? 'p-6 mb-4' : 'p-3'}`}>
            <h4 className={`font-semibold text-gray-200 mb-1.5 ${isPresentation ? 'text-2xl mb-4' : 'text-xs'}`}>{q.id}. {q.question}</h4>
            {isPresentation ? (
              <div className="min-h-[40px]">
                {showResults && (
                   <div className="text-green-400 font-bold text-3xl animate-fadeIn mt-2 flex items-center gap-2">
                     <CheckCircle size={32}/> {q.options[q.correct]}
                   </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {q.options.map((opt, idx) => (
                  <button key={idx} onClick={() => !showResults && handleSelect(q.id, idx)} className={`rounded text-left transition-all px-3 py-1.5 text-xs ${showResults ? idx === q.correct ? "bg-green-900/40 border border-green-500 text-green-100" : answers[q.id] === idx ? "bg-red-900/40 border border-red-500 text-red-100" : "bg-gray-900/50 text-gray-600 opacity-50" : answers[q.id] === idx ? "bg-pink-600 text-white" : "bg-gray-900 hover:bg-gray-700 text-gray-400"}`}>{opt}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. SUB-COMPONENTS (LESSON SPECIFIC)
// ==========================================

const AFLCheckL1: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={`flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto ${isPresentation ? 'gap-12' : 'gap-8'}`}>
        <div className={`bg-gray-900 p-8 rounded-full border-4 border-pink-500/50`}>
            <Dna size={isPresentation ? 100 : 64} className="text-pink-400" />
        </div>
        <h3 className={`font-bold text-white ${isPresentation ? 'text-5xl' : 'text-3xl'}`}>Quick Check: Anisogamy</h3>
        <p className={`text-gray-300 ${isPresentation ? 'text-3xl' : 'text-lg'}`}>"Anisogamy refers to the differences between male and female sex cells. Because female eggs are rare and resource-heavy, females tend to be..."</p>
        
        <div className="grid grid-cols-3 gap-6 w-full">
            <button onClick={() => setSelected('choosy')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'choosy' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Choosier (Quality)</strong>
            </button>
            <button onClick={() => setSelected('promiscuous')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'promiscuous' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Promiscuous (Quantity)</strong>
            </button>
            <button onClick={() => setSelected('equal')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'equal' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Equal to Males</strong>
            </button>
        </div>
        
        {selected === 'choosy' && (
            <div className="animate-fadeIn bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-green-300 font-bold text-xl">
                Correct. This is the basis of Intersexual Selection.
            </div>
        )}
        {(selected === 'promiscuous' || selected === 'equal') && (
            <div className="animate-fadeIn bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-300 font-bold text-xl">
                Incorrect. High investment leads to choosiness.
            </div>
        )}
    </div>
  );
};

const AFLCheckL2: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={`flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto ${isPresentation ? 'gap-12' : 'gap-8'}`}>
        <div className={`bg-gray-900 p-8 rounded-full border-4 border-pink-500/50`}>
            <Star size={isPresentation ? 100 : 64} className="text-pink-400" />
        </div>
        <h3 className={`font-bold text-white ${isPresentation ? 'text-5xl' : 'text-3xl'}`}>Quick Check: The Halo Effect</h3>
        <p className={`text-gray-300 ${isPresentation ? 'text-3xl' : 'text-lg'}`}>"The cognitive bias where we assume that because a person is physically attractive, they must also possess other positive traits (like kindness or intelligence) is known as..."</p>
        
        <div className="grid grid-cols-3 gap-6 w-full">
            <button onClick={() => setSelected('matching')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'matching' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Matching Hypothesis</strong>
            </button>
            <button onClick={() => setSelected('halo')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'halo' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>The Halo Effect</strong>
            </button>
            <button onClick={() => setSelected('filter')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'filter' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Filter Theory</strong>
            </button>
        </div>
        
        {selected === 'halo' && (
            <div className="animate-fadeIn bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-green-300 font-bold text-xl">
                Correct. "What is beautiful is good" (Dion et al.).
            </div>
        )}
        {(selected === 'matching' || selected === 'filter') && (
            <div className="animate-fadeIn bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-300 font-bold text-xl">
                Incorrect. Try again.
            </div>
        )}
    </div>
  );
};

// --- EVOLUTIONARY STRATEGY SIM (LESSON 1) ---

const EvolutionaryStrategySim: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [strategy, setStrategy] = useState<'male' | 'female' | null>(null);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [score, setScore] = useState(0);
  const [offspringCount, setOffspringCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [targets, setTargets] = useState<{id: number, x: number, y: number, quality: number}[]>([]);
  const [gestating, setGestating] = useState(false);
  const [gestationTimer, setGestationTimer] = useState(0);

  // Game Loop
  useEffect(() => {
    let interval: number;
    if (gameState === 'playing') {
      interval = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished');
            return 0;
          }
          return prev - 1;
        });

        // Spawn targets
        setTargets(prev => {
          const keep = prev.filter(() => Math.random() > 0.05); 
          if (keep.length < (strategy === 'male' ? 10 : 5)) {
             keep.push({
               id: Math.random(),
               x: Math.random() * 80 + 10,
               y: Math.random() * 80 + 10,
               quality: Math.floor(Math.random() * 100)
             });
          }
          return keep;
        });

      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, strategy]);

  // Gestation Timer
  useEffect(() => {
    let interval: number;
    if (gestating && gestationTimer > 0) {
      interval = window.setInterval(() => {
        setGestationTimer(prev => prev - 1);
      }, 100); 
    } else if (gestating && gestationTimer <= 0) {
        setGestating(false);
    }
    return () => clearInterval(interval);
  }, [gestating, gestationTimer]);

  const handleClick = (id: number, quality: number) => {
    if (gestating) return;

    if (strategy === 'male') {
        // Quantity Strategy
        setScore(prev => prev + quality); 
        setOffspringCount(prev => prev + 1);
        setTargets(prev => prev.filter(t => t.id !== id));
    } else {
        // Quality Strategy
        setScore(prev => prev + quality);
        setOffspringCount(prev => prev + 1);
        setTargets(prev => prev.filter(t => t.id !== id));
        // Trigger Gestation
        setGestating(true);
        setGestationTimer(30); 
    }
  };

  const reset = () => {
      setStrategy(null);
      setGameState('intro');
      setScore(0);
      setOffspringCount(0);
      setTimeLeft(15);
      setGestating(false);
  };

  return (
    <div className={`relative h-full bg-black rounded-xl border-4 ${strategy === 'male' ? 'border-blue-500' : strategy === 'female' ? 'border-pink-500' : 'border-gray-700'} overflow-hidden font-retro flex flex-col`}>
        {gameState === 'intro' && (
            <div className="absolute inset-0 z-20 bg-gray-900/90 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-3xl text-white mb-8 retro-text-shadow">SELECT REPRODUCTIVE STRATEGY</h3>
                <div className="flex gap-8">
                    <button onClick={() => { setStrategy('male'); setGameState('playing'); }} className="p-8 border-4 border-blue-500 hover:bg-blue-900/50 transition-all rounded-xl group">
                        <div className="text-6xl mb-4">♂️</div>
                        <div className="text-blue-400 font-bold text-xl mb-2">MALE</div>
                        <div className="text-gray-400 text-xs text-left list-disc">
                            <div>• Gametes: Infinite</div>
                            <div>• Investment: Low</div>
                            <div>• Strategy: Quantity</div>
                        </div>
                    </button>
                    <button onClick={() => { setStrategy('female'); setGameState('playing'); }} className="p-8 border-4 border-pink-500 hover:bg-pink-900/50 transition-all rounded-xl group">
                        <div className="text-6xl mb-4">♀️</div>
                        <div className="text-pink-400 font-bold text-xl mb-2">FEMALE</div>
                        <div className="text-gray-400 text-xs text-left list-disc">
                            <div>• Gametes: Rare</div>
                            <div>• Investment: High</div>
                            <div>• Strategy: Quality</div>
                        </div>
                    </button>
                </div>
            </div>
        )}

        {gameState === 'finished' && (
             <div className="absolute inset-0 z-20 bg-gray-900/95 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                 <h3 className="text-4xl text-white mb-2">GENERATION COMPLETE</h3>
                 <div className={`text-6xl font-bold mb-8 ${strategy === 'male' ? 'text-blue-500' : 'text-pink-500'}`}>
                     {strategy === 'male' ? 'QUANTITY' : 'QUALITY'} VICTORY?
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 mb-8 text-left max-w-lg w-full">
                     <div className="bg-gray-800 p-4 rounded border border-gray-600">
                         <div className="text-gray-500 text-xs">OFFSPRING COUNT</div>
                         <div className="text-3xl text-white">{offspringCount}</div>
                         <div className="text-xs text-gray-400 mt-1">{strategy === 'male' ? "High (Success)" : "Low (Expected)"}</div>
                     </div>
                     <div className="bg-gray-800 p-4 rounded border border-gray-600">
                         <div className="text-gray-500 text-xs">GENETIC QUALITY SUM</div>
                         <div className="text-3xl text-yellow-400">{score}</div>
                         <div className="text-xs text-gray-400 mt-1">{strategy === 'female' ? "High (Success)" : "Variable"}</div>
                     </div>
                 </div>
                 
                 <p className="text-gray-300 max-w-xl mb-8 text-lg">
                     {strategy === 'male' 
                        ? "As a male, your strategy was Intra-sexual selection: compete to reproduce as much as possible because sperm is cheap." 
                        : "As a female, your strategy was Inter-sexual selection: you had to be choosy because gestation is expensive and time-consuming."}
                 </p>
                 <button onClick={reset} className="bg-white text-black px-8 py-3 font-bold rounded hover:scale-105 transition-transform">TRY OTHER STRATEGY</button>
             </div>
        )}

        {/* HUD */}
        <div className="bg-gray-800 border-b-2 border-gray-600 p-4 flex justify-between items-center z-10">
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400">TIME</span>
                    <span className="text-xl text-white font-mono">{timeLeft}s</span>
                </div>
                <div className="flex flex-col">
                     <span className="text-[10px] text-gray-400">OFFSPRING</span>
                     <span className="text-xl text-white font-mono">{offspringCount}</span>
                </div>
            </div>
            <div className="font-bold text-gray-500 uppercase tracking-widest">
                {strategy === 'male' ? "CLICK EVERYTHING" : "CHOOSE WISELY"}
            </div>
             <div className="flex flex-col text-right">
                 <span className="text-[10px] text-gray-400">GENETIC SCORE</span>
                 <span className="text-xl text-yellow-400 font-mono">{score}</span>
            </div>
        </div>

        {/* GAME AREA */}
        <div className="relative flex-grow bg-gray-900 cursor-crosshair overflow-hidden">
            {/* Gestation Overlay for Females */}
            {gestating && (
                <div className="absolute inset-0 z-10 bg-pink-900/60 flex flex-col items-center justify-center backdrop-blur-sm animate-fadeIn">
                    <Baby size={64} className="text-pink-300 animate-bounce mb-4" />
                    <h2 className="text-3xl text-white font-bold mb-2">GESTATING...</h2>
                    <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-500">
                        <div className="h-full bg-pink-500 transition-all duration-100 ease-linear" style={{width: `${(gestationTimer/30)*100}%`}}></div>
                    </div>
                    <p className="text-pink-200 mt-2 text-sm">Cannot conceive while pregnant</p>
                </div>
            )}

            {targets.map(t => (
                <button
                    key={t.id}
                    onClick={() => handleClick(t.id, t.quality)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all active:scale-95 animate-pop hover:scale-110"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                >
                    <div className={`rounded-full flex items-center justify-center shadow-lg border-2 ${
                        t.quality > 80 ? 'w-20 h-20 bg-yellow-900/80 border-yellow-400 z-10' : 
                        t.quality > 50 ? 'w-16 h-16 bg-green-900/80 border-green-400' : 
                        'w-12 h-12 bg-gray-800 border-gray-600 opacity-80'
                    }`}>
                        <div className="text-center">
                            <span className="block text-xs font-bold text-white">{t.quality}</span>
                            <span className="block text-[8px] text-gray-300">GENES</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

// --- MATE CHOICE SIM (LESSON 2) ---

interface Partner {
  id: number;
  rating: number;
  label: string;
}

interface LogEntry {
  round: number;
  action: string;
  result: 'match' | 'reject' | 'settle';
}

const MatchingHypothesisSim: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    // Game State
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'round_over' | 'game_over' | 'victory'>('intro');
    const [ego, setEgo] = useState(100);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(1);
    const [userRating, setUserRating] = useState<number>(0); // Hidden from user
    const [partners, setPartners] = useState<Partner[]>([]);
    const [feedback, setFeedback] = useState<{title: string, msg: string, type: 'match'|'reject'|'settle'}|null>(null);
    const [history, setHistory] = useState<LogEntry[]>([]);
    const [matchDetails, setMatchDetails] = useState<{partnerRating: number} | null>(null);

    const MAX_ROUNDS = 5;

    // Start New Round
    const startRound = (nextRound: number) => {
        const hidden = Math.floor(Math.random() * 6) + 3; 
        setUserRating(hidden);
        setRound(nextRound);
        setFeedback(null);
        setMatchDetails(null);
        
        const partnerCount = 4 + (nextRound - 1) * 2; // 4, 6, 8, 10, 12
        
        const roomPartners: Partner[] = [];
        for (let i = 0; i < partnerCount; i++) {
            let r;
            if (i === 0) r = hidden; // Perfect Match
            else if (i === 1) r = Math.min(10, hidden + Math.floor(Math.random() * 2) + 2); // Higher
            else if (i === 2) r = Math.max(1, hidden - Math.floor(Math.random() * 2) - 2); // Lower
            else r = Math.floor(Math.random() * 10) + 1; // Random

            roomPartners.push({
                id: i,
                rating: r,
                label: r >= 9 ? "Supermodel" : r >= 7 ? "Very Attractive" : r >= 5 ? "Average" : "Unconventional"
            });
        }
        setPartners(roomPartners.sort(() => Math.random() - 0.5));
        setGameState('playing');
    };

    const startGame = () => {
        setEgo(100);
        setScore(0);
        setHistory([]);
        startRound(1);
    };

    const handleApproach = (p: Partner) => {
        const cost = p.rating * 2;
        let newEgo = ego - cost;
        
        if (newEgo <= 0) {
            setEgo(0);
            setGameState('game_over');
            return;
        }

        let resultType: 'match' | 'reject' | 'settle' = 'reject';
        let resultTitle = "";
        let resultMsg = "";
        let points = 0;

        if (p.rating > userRating + 1) {
            resultType = 'reject';
            resultTitle = "REJECTED";
            resultMsg = `They are a ${p.rating}/10. They are looking for someone with higher value than you. You aimed too high!`;
            newEgo -= 10; 
        } else if (p.rating < userRating - 1) {
            resultType = 'settle';
            resultTitle = "ACCEPTED (SETTLED)";
            resultMsg = `They are a ${p.rating}/10. They accepted, but you feel unsatisfied. You could have aimed higher.`;
            points = p.rating * 50;
        } else {
            resultType = 'match';
            resultTitle = "PERFECT MATCH";
            resultMsg = `They are a ${p.rating}/10. You feel a strong connection! Genetic potential maximized.`;
            points = p.rating * 100;
            newEgo = Math.min(100, newEgo + 30); // Restore Ego
        }

        setEgo(newEgo);
        setScore(prev => prev + points);
        setFeedback({ title: resultTitle, msg: resultMsg, type: resultType });
        setHistory(prev => [{ round, action: `Approached ${p.rating}`, result: resultType }, ...prev]);

        if (newEgo <= 0) {
            setGameState('game_over');
        } else if (resultType === 'match') {
            setMatchDetails({ partnerRating: p.rating });
            setTimeout(() => {
                setGameState('round_over');
            }, 2000);
        }
    };

    return (
        <div className={`h-full flex flex-col ${isPresentation ? 'gap-8' : 'gap-4'} font-retro relative overflow-hidden bg-black p-4 rounded-xl border-4 border-gray-800`}>
             <div className="absolute inset-0 pointer-events-none retro-scanlines z-10 opacity-20"></div>

             {gameState === 'intro' && (
                 <div className="flex flex-col items-center justify-center h-full text-center z-20 p-8">
                     <Heart size={80} className="text-pink-500 mb-4 animate-pulse" />
                     <h2 className="text-4xl text-white mb-6 retro-text-shadow">EGO vs EVOLUTION</h2>
                     <div className="bg-gray-900 border-2 border-pink-500 p-6 max-w-2xl text-left space-y-4 mb-8">
                        <p className="text-pink-300">OBJECTIVE:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-300 text-sm">
                            <li>You have a <strong>HIDDEN RATING</strong> (1-10) that changes every round.</li>
                            <li>You have <strong>EGO POINTS</strong> (Health). Approaching high-value partners costs more Ego.</li>
                            <li><strong>THE GOAL:</strong> Find a partner with a similar rating to yours (Walster's Matching Hypothesis).</li>
                            <li><strong>RISK:</strong> If you aim too high, you get rejected (Ego penalty). If you aim too low, you settle (Low score).</li>
                        </ul>
                     </div>
                     <button onClick={startGame} className="bg-pink-600 text-white px-8 py-4 text-xl border-b-4 border-pink-800 active:border-b-0 active:translate-y-1 hover:bg-pink-500 transition-all">START DATING</button>
                 </div>
             )}

             {gameState === 'round_over' && matchDetails && (
                 <div className="flex flex-col items-center justify-center h-full text-center z-20 animate-fadeIn p-8">
                     <div className="text-green-500 mb-2 font-bold text-xl">ROUND {round} COMPLETE</div>
                     <h2 className="text-4xl text-white mb-8 retro-text-shadow">MATCH SUCCESSFUL!</h2>
                     <div className="grid grid-cols-2 gap-8 mb-8 w-full max-w-lg">
                         <div className="bg-gray-900 border-2 border-pink-500 p-6 rounded-xl flex flex-col items-center">
                             <span className="text-gray-400 text-xs mb-2">YOUR HIDDEN RATING</span>
                             <span className="text-6xl text-pink-500 font-bold">{userRating}</span>
                         </div>
                         <div className="bg-gray-900 border-2 border-green-500 p-6 rounded-xl flex flex-col items-center">
                             <span className="text-gray-400 text-xs mb-2">PARTNER RATING</span>
                             <span className="text-6xl text-green-500 font-bold">{matchDetails.partnerRating}</span>
                         </div>
                     </div>
                     <p className="text-gray-300 mb-8 max-w-md">
                         {Math.abs(userRating - matchDetails.partnerRating) === 0 
                            ? "Perfect alignment! You correctly identified your own value in the mating market." 
                            : "Close enough! Walster argues we compromise to avoid rejection."}
                     </p>
                     {round >= MAX_ROUNDS ? (
                         <button onClick={() => setGameState('victory')} className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 text-xl font-bold border-b-4 border-yellow-700 active:translate-y-1 active:border-b-0 transition-all">VIEW FINAL SCORE</button>
                     ) : (
                         <button onClick={() => startRound(round + 1)} className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 text-xl border-b-4 border-pink-800 active:translate-y-1 active:border-b-0 transition-all">NEXT ROUND ({round + 1}/{MAX_ROUNDS})</button>
                     )}
                 </div>
             )}

             {(gameState === 'game_over' || gameState === 'victory') && (
                 <div className="flex flex-col items-center justify-center h-full text-center z-20 animate-fadeIn">
                     {gameState === 'victory' ? <Trophy size={100} className="text-yellow-400 mb-4" /> : <HeartCrack size={100} className="text-red-500 mb-4" />}
                     <h2 className={`text-5xl mb-4 ${gameState === 'victory' ? 'text-yellow-400' : 'text-red-500'} retro-text-shadow`}>{gameState === 'victory' ? "RELATIONSHIP MASTER" : "EGO DEPLETED"}</h2>
                     <p className="text-white text-2xl mb-8">FINAL SCORE: {score}</p>
                     <p className="text-gray-400 mb-8 max-w-xl">{gameState === 'victory' ? "You successfully balanced desire with feasibility. Walster would be proud." : "Rejection destroyed your confidence. Next time, assess your own value more accurately before aiming for the stars."}</p>
                     <button onClick={startGame} className="bg-white text-black px-8 py-4 text-xl border-b-4 border-gray-400 hover:bg-gray-200">TRY AGAIN</button>
                 </div>
             )}

             {gameState === 'playing' && (
                 <>
                    <div className="flex items-center justify-between bg-gray-900 p-4 border-b-2 border-gray-700 z-20 relative">
                        <div className="flex flex-col w-1/3">
                            <span className="text-xs text-pink-400 mb-1">EGO HEALTH</span>
                            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                                <div className={`h-full transition-all duration-500 ${ego > 50 ? 'bg-green-500' : ego > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${ego}%` }}></div>
                            </div>
                            <span className="text-xs text-white mt-1">{ego}/100</span>
                        </div>
                        <div className="flex flex-col items-center">
                             <span className="text-gray-500 text-xs">ROUND</span>
                             <span className="text-2xl text-white">{round}/{MAX_ROUNDS}</span>
                        </div>
                        <div className="flex flex-col items-end w-1/3">
                             <span className="text-gray-500 text-xs">SCORE</span>
                             <span className="text-2xl text-yellow-400">{score}</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center relative w-full overflow-y-auto custom-scrollbar p-4 z-10">
                        {feedback && (
                            <div className={`absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn`}>
                                <div className={`p-8 border-4 text-center max-w-md ${feedback.type === 'match' ? 'border-green-500 bg-green-900/20' : feedback.type === 'reject' ? 'border-red-500 bg-red-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
                                    <h3 className={`text-3xl mb-4 ${feedback.type === 'match' ? 'text-green-400' : feedback.type === 'reject' ? 'text-red-400' : 'text-yellow-400'}`}>{feedback.title}</h3>
                                    <p className="text-white text-sm mb-6 leading-relaxed">{feedback.msg}</p>
                                    {feedback.type === 'reject' || feedback.type === 'settle' ? (
                                        <button onClick={() => setFeedback(null)} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded">TRY ANOTHER</button>
                                    ) : (
                                        <div className="text-green-400 animate-pulse">Calculating Match Quality...</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <h3 className="text-gray-400 text-sm mb-6 uppercase tracking-widest shrink-0">Select a partner to approach</h3>
                        
                        <div className="flex flex-wrap justify-center gap-4 w-full">
                            {partners.map((p) => (
                                <button 
                                    key={p.id} 
                                    onClick={() => !feedback && handleApproach(p)}
                                    disabled={!!feedback}
                                    className="group relative bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-pink-500 transition-all p-4 flex flex-col items-center rounded-xl w-32 sm:w-40"
                                >
                                    <div className="absolute -top-3 -right-3 bg-gray-900 text-xs border border-gray-600 px-2 py-1 rounded text-red-400 font-mono">
                                        COST: -{p.rating * 2}
                                    </div>
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                                    <div className="text-2xl text-white font-bold mb-1">{p.rating}/10</div>
                                    <div className="text-[10px] text-gray-500 uppercase">{p.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-32 bg-gray-900 border-t-2 border-gray-700 p-4 overflow-y-auto custom-scrollbar font-mono text-xs shrink-0 z-20 relative">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 uppercase font-bold sticky top-0 bg-gray-900 pb-2 border-b border-gray-800">
                            <Activity size={12} /> Social Feedback Log (Deduce your value)
                        </div>
                        {history.length === 0 ? (
                            <div className="text-gray-600 italic">No interactions yet. Approach someone to gauge your social standing.</div>
                        ) : (
                            <div className="flex flex-col-reverse gap-1">
                                {history.map((entry, idx) => (
                                    <div key={idx} className={`flex gap-2 ${entry.result === 'match' ? 'text-green-400' : entry.result === 'reject' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        <span className="text-gray-600">[R{entry.round}]</span>
                                        <span>{entry.action} -> {entry.result.toUpperCase()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </>
             )}
        </div>
    );
};

// --- LESSON 3 SUB-COMPONENTS ---

const OnionModel: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    const [layer, setLayer] = useState<'superficial'|'middle'|'inner'>('superficial');

    const data = {
        superficial: {
            title: "1. The Superficial Layer",
            content: "Low Risk. Information is biographical and low stakes. E.g., 'What do you do for work?', 'Nice weather today'.",
            color: "border-yellow-200 bg-yellow-100/10 text-yellow-100"
        },
        middle: {
            title: "2. The Middle Layer",
            content: "Moderate Risk. Opinions, attitudes, and preferences. E.g., 'I hate Donald Trump', 'I love Jazz music'.",
            color: "border-orange-400 bg-orange-900/20 text-orange-200"
        },
        inner: {
            title: "3. The Inner Core",
            content: "High Risk. Deep secrets, fears, hopes, and traumas. E.g., 'I'm terrified of failure', 'I was bullied as a child'.",
            color: "border-red-500 bg-red-900/30 text-red-200"
        }
    };

    return (
        <div className={`h-full grid grid-cols-1 lg:grid-cols-2 ${isPresentation ? 'gap-12' : 'gap-8'}`}>
            <div className="flex items-center justify-center">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* Superficial Ring */}
                    <button onClick={() => setLayer('superficial')} className={`absolute inset-0 rounded-full border-4 border-yellow-200 bg-yellow-100/5 hover:bg-yellow-100/20 transition-all ${layer === 'superficial' ? 'scale-105 shadow-[0_0_30px_rgba(253,224,71,0.3)] z-10' : 'scale-100 z-0'}`}></button>
                    
                    {/* Middle Ring */}
                    <button onClick={() => setLayer('middle')} className={`absolute w-56 h-56 rounded-full border-4 border-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-all ${layer === 'middle' ? 'scale-110 shadow-[0_0_30px_rgba(251,146,60,0.4)] z-20' : 'scale-100 z-10'}`}></button>
                    
                    {/* Inner Core */}
                    <button onClick={() => setLayer('inner')} className={`absolute w-28 h-28 rounded-full border-4 border-red-500 bg-red-600/20 hover:bg-red-600/40 transition-all ${layer === 'inner' ? 'scale-125 shadow-[0_0_30px_rgba(239,68,68,0.6)] z-30' : 'scale-100 z-20'}`}>
                        <span className="text-xs font-bold text-red-300">CORE</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Social Penetration Theory</h3>
                <div className={`p-8 rounded-xl border-l-4 animate-fadeIn transition-all ${data[layer].color}`}>
                    <strong className={`block mb-4 text-white uppercase tracking-widest ${isPresentation ? 'text-3xl' : 'text-xl'}`}>{data[layer].title}</strong>
                    <p className={`leading-relaxed ${isPresentation ? 'text-2xl' : 'text-lg'}`}>{data[layer].content}</p>
                </div>
                <div className="mt-6 flex gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-200"></div> Breadth (Quantity)</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Depth (Quality)</div>
                </div>
            </div>
        </div>
    );
};

// --- FIRST DATE SIMULATION (BRANCHING DIALOGUE) ---

type DialogueNodeId = 'start' | 'hobby' | 'work' | 'vulnerability' | 'trauma' | 'future' | 'end_success' | 'end_failure' | 'end_awkward';

interface DialogueNode {
    id: DialogueNodeId;
    text: string; // The partner's line
    partnerMood: 'happy' | 'neutral' | 'annoyed' | 'shocked';
    options: {
        text: string;
        nextId: DialogueNodeId;
        risk: 'LOW' | 'MED' | 'HIGH';
        intimacyChange: number;
        feedback: string;
    }[];
}

const dialogueTree: Record<string, DialogueNode> = {
    start: {
        id: 'start',
        text: "Hey! Thanks for meeting me. The coffee here is supposed to be really good. I'm a bit nervous, to be honest!",
        partnerMood: 'neutral',
        options: [
            { text: "Yeah, me too. I like your jacket, by the way.", nextId: 'hobby', risk: 'LOW', intimacyChange: 5, feedback: "Good opener. Superficial but warm (Breadth)." },
            { text: "My last ex cheated on me at a coffee shop like this.", nextId: 'trauma', risk: 'HIGH', intimacyChange: -20, feedback: "Too much! Negative disclosure in the first 10 seconds." },
            { text: "I don't get nervous. I am superior.", nextId: 'end_awkward', risk: 'MED', intimacyChange: -10, feedback: "Arrogance blocks connection." }
        ]
    },
    hobby: {
        id: 'hobby',
        text: "Oh, thank you! I found it at a vintage store. I love hunting for unique clothes. What about you? What do you do for fun?",
        partnerMood: 'happy',
        options: [
            { text: "I mostly just work. I don't have time for fun.", nextId: 'work', risk: 'LOW', intimacyChange: -5, feedback: "Low breadth. Stops the conversation flow." },
            { text: "I love hiking! Being in nature really helps me clear my head.", nextId: 'vulnerability', risk: 'MED', intimacyChange: 10, feedback: "Good! You shared a fact (hiking) and a feeling (clears head)." },
            { text: "I collect human teeth.", nextId: 'end_awkward', risk: 'HIGH', intimacyChange: -30, feedback: "Social norm violation." }
        ]
    },
    work: {
        id: 'work',
        text: "Oh... okay. Work is important I guess. *Sips coffee awkwardly* So... do you have any siblings?",
        partnerMood: 'neutral',
        options: [
            { text: "No. Just me.", nextId: 'end_awkward', risk: 'LOW', intimacyChange: 0, feedback: "Dead end. You aren't offering any information to build on." },
            { text: "Yeah, a sister. We used to fight, but we're close now.", nextId: 'vulnerability', risk: 'MED', intimacyChange: 10, feedback: "Nice recovery. Sharing personal history builds the middle layer." }
        ]
    },
    vulnerability: {
        id: 'vulnerability',
        text: "That makes sense. I feel that way about painting. It's the only time I feel like I'm not... pretending to be someone else. Does that make sense?",
        partnerMood: 'neutral',
        options: [
            { text: "Totally. It's hard to be authentic in a world that wants you to fit in.", nextId: 'future', risk: 'MED', intimacyChange: 15, feedback: "Excellent Reciprocity. You validated their feeling and shared a shared view." },
            { text: "Painting is cool. My aunt paints.", nextId: 'hobby', risk: 'LOW', intimacyChange: -5, feedback: "You missed the cue! They offered depth (feeling fake), you stayed superficial." },
            { text: "You feel like a fake? You should see a therapist.", nextId: 'end_failure', risk: 'HIGH', intimacyChange: -20, feedback: "Judgmental. Immediate shutdown of intimacy." }
        ]
    },
    trauma: {
        id: 'trauma',
        text: "Uh... wow. That's heavy. I'm sorry that happened to you, but... I barely know your name.",
        partnerMood: 'shocked',
        options: [
            { text: "Sorry, I overshared. Let's start over. I'm [Name].", nextId: 'start', risk: 'LOW', intimacyChange: 5, feedback: "Good repair attempt. Acknowledging the breach of norms." },
            { text: "It's fine. Life is pain.", nextId: 'end_failure', risk: 'HIGH', intimacyChange: -10, feedback: "Doubling down on negativity drives people away." }
        ]
    },
    future: {
        id: 'future',
        text: "Exactly! I'm glad you get it. Honestly, sometimes I dream of just quitting my job and moving to the coast. Do you ever feel like that?",
        partnerMood: 'happy',
        options: [
            { text: "All the time. I want to build a cabin and write a book.", nextId: 'end_success', risk: 'HIGH', intimacyChange: 20, feedback: "Core Layer reached! Shared hopes and dreams solidify the bond." },
            { text: "No, I like my job. Stability is important.", nextId: 'end_awkward', risk: 'MED', intimacyChange: -5, feedback: "Honest, but creates distance in this specific moment." }
        ]
    },
    end_success: { id: 'end_success', text: "Wow, me too! I've never told anyone that on a first date. I feel like we really clicked.", partnerMood: 'happy', options: [] },
    end_failure: { id: 'end_failure', text: "Look, this is getting a bit uncomfortable. I think I'm going to go.", partnerMood: 'annoyed', options: [] },
    end_awkward: { id: 'end_awkward', text: "Right... well, nice meeting you. I should probably get going.", partnerMood: 'neutral', options: [] }
};

const FirstDateSim: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    const [currentNodeId, setCurrentNodeId] = useState<string>('start');
    const [intimacy, setIntimacy] = useState(20);
    const [history, setHistory] = useState<string[]>([]);
    const [typingText, setTypingText] = useState("");
    
    const currentNode = dialogueTree[currentNodeId];
    
    // Typewriter effect
    useEffect(() => {
        if (!currentNode) return;
        setTypingText(""); // Reset text state

        const fullText = currentNode.text;
        let charIndex = 0;

        // Immediate first character render to prevent "missing first word" visual glitch
        if (fullText.length > 0) {
            setTypingText(fullText[0]);
            charIndex = 1;
        }

        const intervalId = setInterval(() => {
            if (charIndex >= fullText.length) {
                clearInterval(intervalId);
                return;
            }
            setTypingText(fullText.slice(0, charIndex + 1));
            charIndex++;
        }, 30);
        
        return () => clearInterval(intervalId);
    }, [currentNodeId]);

    const handleChoice = (option: any) => {
        setIntimacy(prev => Math.min(100, Math.max(0, prev + option.intimacyChange)));
        setHistory(prev => [option.feedback, ...prev]);
        setTypingText(""); // Clear instantly on choice to avoid lingering text
        setCurrentNodeId(option.nextId);
    };

    const reset = () => {
        setCurrentNodeId('start');
        setIntimacy(20);
        setHistory([]);
    };

    const getPartnerIcon = () => {
        switch(currentNode.partnerMood) {
            case 'happy': return <Smile size={80} className="text-green-400 animate-bounce" />;
            case 'annoyed': return <Frown size={80} className="text-red-500 animate-pulse" />;
            case 'shocked': return <AlertTriangle size={80} className="text-yellow-400 animate-shake" />;
            default: return <Meh size={80} className="text-blue-400" />;
        }
    };

    return (
        <div className={`h-full flex flex-col font-retro relative overflow-hidden bg-gray-950 p-1 rounded-xl border-4 border-gray-700`}>
            {/* CRT Overlay */}
            <div className="absolute inset-0 pointer-events-none retro-scanlines z-20 opacity-10"></div>
            
            {/* TOP HUD */}
            <div className="flex justify-between items-center p-4 bg-black border-b-4 border-gray-800 z-10">
                <div className="flex flex-col w-1/2">
                    <span className="text-xs text-pink-500 mb-1 tracking-widest">INTIMACY LEVEL</span>
                    <div className="w-full h-4 bg-gray-900 border-2 border-gray-700 relative">
                        <div 
                            className={`h-full transition-all duration-500 ${intimacy > 60 ? 'bg-pink-500' : intimacy > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${intimacy}%` }}
                        ></div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">TURN</span>
                    <span className="text-xl text-cyan-400">{history.length + 1}</span>
                </div>
            </div>

            {/* MAIN SCENE */}
            <div className="flex-grow flex flex-col items-center justify-center p-4 relative z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black">
                {/* Partner Sprite */}
                <div className="mb-6 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {getPartnerIcon()}
                </div>

                {/* Dialogue Box */}
                <div className="w-full max-w-3xl bg-blue-900/20 border-2 border-blue-500/50 p-6 rounded-lg min-h-[100px] relative">
                    <div className="absolute -top-3 left-4 bg-black px-2 text-xs text-blue-400 border border-blue-500">ALEX</div>
                    <p className="text-white text-sm md:text-lg leading-relaxed font-mono whitespace-pre-wrap break-words">{typingText}<span className="animate-pulse">_</span></p>
                </div>
            </div>

            {/* CONTROL PANEL */}
            <div className="bg-black border-t-4 border-gray-800 p-4 z-10 min-h-[180px]">
                {currentNode.options.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-w-4xl mx-auto">
                        <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">Select Response Protocol:</div>
                        {currentNode.options.map((opt, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleChoice(opt)}
                                className="group flex items-center justify-between p-3 border-2 border-gray-700 hover:border-pink-500 hover:bg-pink-900/20 transition-all text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-pink-500" />
                                    <span className="text-gray-300 group-hover:text-white text-xs md:text-sm font-mono">"{opt.text}"</span>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded border ${
                                    opt.risk === 'HIGH' ? 'border-red-500 text-red-500' : 
                                    opt.risk === 'MED' ? 'border-yellow-500 text-yellow-500' : 
                                    'border-green-500 text-green-500'
                                }`}>
                                    RISK: {opt.risk}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className={`text-2xl ${currentNode.id === 'end_success' ? 'text-green-400' : 'text-red-500'}`}>
                            {currentNode.id === 'end_success' ? 'RELATIONSHIP ESTABLISHED' : 'CONNECTION FAILED'}
                        </div>
                        <button onClick={reset} className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-500">PLAY AGAIN</button>
                    </div>
                )}
            </div>

            {/* HISTORY LOG (Hidden on mobile presentation, visible on larger screens) */}
            {!isPresentation && history.length > 0 && (
                <div className="absolute top-20 right-4 w-64 bg-black/90 border border-gray-700 p-2 text-[10px] text-gray-400 font-mono hidden lg:block pointer-events-none">
                    <div className="text-pink-500 mb-1 border-b border-gray-800 pb-1">ANALYSIS LOG</div>
                    {history.slice(0, 3).map((h, i) => (
                        <div key={i} className="mb-1 text-green-400">>> {h}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TheDMDoctor: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    const [caseId, setCaseId] = useState(0);
    const [feedback, setFeedback] = useState<any>(null);

    const cases = [
        {
            id: 1,
            context: "Talking for 2 days on Tinder.",
            msg_them: "Hey! How was your day?",
            msg_you: "Ideally, I want to respond with...",
            options: [
                { text: "Good thanks. Yours?", type: "breadth", result: "Correct. Matches their level. Safe Breadth." },
                { text: "Honestly terrible. My dad is an alcoholic and he yelled at me.", type: "tmi", result: "Too much! High risk of rejection. You skipped layers." },
                { text: "I love you.", type: "weird", result: "Way too fast." }
            ]
        },
        {
            id: 2,
            context: "3rd Date. Dinner went well.",
            msg_them: "I've never told anyone this, but I actually want to be a writer, not a banker.",
            msg_you: "Response strategy?",
            options: [
                { text: "Cool. Pass the salt?", type: "cold", result: "Failed Reciprocity. They offered depth, you offered nothing." },
                { text: "That's amazing. I actually secretly paint on weekends.", type: "reciprocal", result: "Perfect. You matched their disclosure with one of your own." },
                { text: "Bankers make more money though.", type: "judge", result: "Judgmental. Reduces trust." }
            ]
        },
        {
            id: 3,
            context: "Married for 10 years. Relationship Stagnant.",
            msg_them: "We never talk anymore.",
            msg_you: "The fix?",
            options: [
                { text: "We're talking right now.", type: "defensive", result: "Defensive. Avoids intimacy." },
                { text: "I feel lonely too. I miss us.", type: "vulnerable", result: "Excellent. Re-establishing the Inner Core connection." },
                { text: "What do you want for dinner?", type: "superficial", result: "Returning to superficial layer. Relationship will fail." }
            ]
        }
    ];

    const handleOption = (opt: any) => {
        setFeedback(opt);
    };

    const nextCase = () => {
        if (caseId < 2) {
            setCaseId(prev => prev + 1);
            setFeedback(null);
        } else {
            setFeedback({ result: "All cases resolved. You are a master of Reciprocity." });
        }
    };

    return (
        <div className={`h-full grid grid-cols-1 lg:grid-cols-2 ${isPresentation ? 'gap-12' : 'gap-8'}`}>
            <div className="bg-white rounded-3xl border-8 border-gray-800 shadow-2xl p-6 relative overflow-hidden flex flex-col max-w-sm mx-auto w-full">
                <div className="absolute top-0 left-0 w-full h-8 bg-gray-200 flex items-center justify-center">
                    <div className="w-16 h-4 bg-black rounded-full opacity-20"></div>
                </div>
                
                <div className="mt-8 flex-grow space-y-4">
                    <div className="bg-gray-200 p-3 rounded-xl rounded-tl-none self-start max-w-[80%] text-black text-sm">
                        <strong className="block text-xs text-gray-500 mb-1">{cases[caseId].context}</strong>
                        {cases[caseId].msg_them}
                    </div>
                    <div className="bg-blue-500 p-3 rounded-xl rounded-tr-none self-end max-w-[80%] text-white text-sm ml-auto">
                        {feedback ? "Reply sent." : "..."}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-gray-400">
                        <MessageSquare size={20} />
                        <span className="text-xs">Type a message...</span>
                        <Send size={20} className="text-blue-500" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
                <h3 className={`font-bold text-white mb-2 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>The DM Doctor</h3>
                <p className="text-gray-400 mb-4">Select the response that best applies Social Penetration Theory.</p>

                {!feedback ? (
                    <div className="space-y-3">
                        {cases[caseId].options.map((opt, i) => (
                            <button key={i} onClick={() => handleOption(opt)} className={`w-full p-4 rounded-xl border border-gray-600 bg-gray-800 hover:bg-gray-700 text-left transition-all ${isPresentation ? 'text-xl' : 'text-sm'} text-gray-200`}>
                                {opt.text}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={`p-6 rounded-xl border-l-4 animate-fadeIn ${feedback.type === 'breadth' || feedback.type === 'reciprocal' || feedback.type === 'vulnerable' ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                        <strong className={`block text-xl mb-2 ${feedback.type === 'breadth' || feedback.type === 'reciprocal' || feedback.type === 'vulnerable' ? 'text-green-400' : 'text-red-400'}`}>Analysis</strong>
                        <p className="text-gray-300 mb-4">{feedback.result}</p>
                        {caseId < 2 && (
                            <button onClick={nextCase} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold">Next Case</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EssayPlanRevealL1: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl flex flex-col justify-center h-full ${isPresentation ? 'p-12' : 'p-8'}`}>
      <h3 className={`text-gray-400 font-bold uppercase tracking-widest mb-6 text-center ${isPresentation ? 'text-3xl' : 'text-base'}`}>Structure Planning</h3>
      {!revealed ? (
        <div className="flex flex-col items-center justify-center flex-grow space-y-4">
          <p className={`text-gray-400 text-center ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Review the question on the left, then click to reveal the suggested structure.</p>
          <button onClick={() => setRevealed(true)} className={`group flex items-center gap-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-pink-500/25 ${isPresentation ? 'px-14 py-8 text-3xl' : 'px-8 py-4'}`}><Eye size={isPresentation ? 40 : 20} /> Reveal Paragraph Plan</button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn overflow-y-auto custom-scrollbar pr-2">
          <div className="flex justify-end"><button onClick={() => setRevealed(false)} className={`text-gray-500 hover:text-white flex items-center gap-1 uppercase font-bold ${isPresentation ? 'text-xl' : 'text-xs'}`}><EyeOff size={isPresentation ? 24 : 14}/> Hide</button></div>
          
          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-300 shrink-0 border border-blue-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P1</div>
              <div><strong className={`text-blue-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO1: Evolutionary Theory</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}>Define Anisogamy. Explain how the difference in sex cells leads to different reproductive strategies: Inter-sexual selection (Quality/Female) vs Intra-sexual selection (Quantity/Male).</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-green-900 flex items-center justify-center font-bold text-green-300 shrink-0 border border-green-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P2</div>
              <div><strong className={`text-green-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Research Support (Buss)</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Buss (1989):</strong> Surveyed 10,000 adults across 33 countries. Found universal patterns: Men valued youth/looks (fertility), Women valued resources/ambition. Supports evolutionary predictions.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-green-900 flex items-center justify-center font-bold text-green-300 shrink-0 border border-green-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P3</div>
              <div><strong className={`text-green-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Research Support (Clark & Hatfield)</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Clark & Hatfield (1989):</strong> Campus study. 75% of men agreed to casual sex request, 0% of women did. Strongly supports the prediction that females are the 'choosier' sex.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-red-900 flex items-center justify-center font-bold text-red-300 shrink-0 border border-red-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P4</div>
              <div><strong className={`text-red-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Evaluation / Debate</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Biological Determinism vs Social Change.</strong> The theory argues behaviour is hard-wired. However, Bereczkei et al. argue that social changes (women in workplace, contraception) have altered mate preferences, which the theory struggles to explain.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

const EssayPlanRevealL2: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl flex flex-col justify-center h-full ${isPresentation ? 'p-12' : 'p-8'}`}>
      <h3 className={`text-gray-400 font-bold uppercase tracking-widest mb-6 text-center ${isPresentation ? 'text-3xl' : 'text-base'}`}>Structure Planning</h3>
      {!revealed ? (
        <div className="flex flex-col items-center justify-center flex-grow space-y-4">
          <p className={`text-gray-400 text-center ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Review the question on the left, then click to reveal the suggested structure.</p>
          <button onClick={() => setRevealed(true)} className={`group flex items-center gap-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-pink-500/25 ${isPresentation ? 'px-14 py-8 text-3xl' : 'px-8 py-4'}`}><Eye size={isPresentation ? 40 : 20} /> Reveal Paragraph Plan</button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn overflow-y-auto custom-scrollbar pr-2">
          <div className="flex justify-end"><button onClick={() => setRevealed(false)} className={`text-gray-500 hover:text-white flex items-center gap-1 uppercase font-bold ${isPresentation ? 'text-xl' : 'text-xs'}`}><EyeOff size={isPresentation ? 24 : 14}/> Hide</button></div>
          
          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-300 shrink-0 border border-blue-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P1</div>
              <div><strong className={`text-blue-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO1: The Halo Effect</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}>Definition: "What is beautiful is good". Dion et al. (1972) found attractive people are consistently rated as kinder, stronger, and more sociable. This is a cognitive bias.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-300 shrink-0 border border-blue-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P2</div>
              <div><strong className={`text-blue-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO1: The Matching Hypothesis</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}>Walster et al. (1966). We assess our own value and choose partners of similar attractiveness to maximise chances of success while minimising the risk of rejection. It is a compromise.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-green-900 flex items-center justify-center font-bold text-green-300 shrink-0 border border-green-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P3</div>
              <div><strong className={`text-green-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Research Support</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Palmer & Peterson (2012):</strong> Found attractive people were rated as more politically knowledgeable. This has implications for the democratic process (Halo Effect in action).</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-red-900 flex items-center justify-center font-bold text-red-300 shrink-0 border border-red-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P4</div>
              <div><strong className={`text-red-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Contradictory Evidence</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Taylor et al. (2011):</strong> Studied online dating logs. Found people did <em>not</em> consider their own level; they consistently aimed for the most attractive partners. Contradicts Matching Hypothesis.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

const EssayPlanRevealL4: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl flex flex-col justify-center h-full ${isPresentation ? 'p-12' : 'p-8'}`}>
      <h3 className={`text-gray-400 font-bold uppercase tracking-widest mb-6 text-center ${isPresentation ? 'text-3xl' : 'text-base'}`}>Structure Planning</h3>
      {!revealed ? (
        <div className="flex flex-col items-center justify-center flex-grow space-y-4">
          <p className={`text-gray-400 text-center ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Review the question on the left, then click to reveal the suggested structure.</p>
          <button onClick={() => setRevealed(true)} className={`group flex items-center gap-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-pink-500/25 ${isPresentation ? 'px-14 py-8 text-3xl' : 'px-8 py-4'}`}><Eye size={isPresentation ? 40 : 20} /> Reveal Paragraph Plan</button>
        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn overflow-y-auto custom-scrollbar pr-2">
          <div className="flex justify-end"><button onClick={() => setRevealed(false)} className={`text-gray-500 hover:text-white flex items-center gap-1 uppercase font-bold ${isPresentation ? 'text-xl' : 'text-xs'}`}><EyeOff size={isPresentation ? 24 : 14}/> Hide</button></div>
          
          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-blue-900 flex items-center justify-center font-bold text-blue-300 shrink-0 border border-blue-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P1</div>
              <div><strong className={`text-blue-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO1: The Filter Model</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}>Kerckhoff & Davis (1962). Field of Availables -> Field of Desirables. Outline the 3 filters: Social Demography (Accessibility), Similarity in Attitudes (&lt;18mo), Complementarity (&gt;18mo).</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-green-900 flex items-center justify-center font-bold text-green-300 shrink-0 border border-green-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P2</div>
              <div><strong className={`text-green-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Research Support</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Winch (1958):</strong> Found that similarity was typical of the earliest stages of a relationship, but complementarity of needs was more important for married couples. Supports the temporal validity of the model.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-red-900 flex items-center justify-center font-bold text-red-300 shrink-0 border border-red-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P3</div>
              <div><strong className={`text-red-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Direction of Cause</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}><strong>Anderson et al (2003):</strong> Found that cohabiting partners become more similar over time (Emotional Convergence). Similarity is an <em>effect</em> of the relationship, not necessarily the cause/filter. Contradicts the static nature of the filters.</p></div>
          </div>

          <div className={`flex gap-4 items-start bg-gray-900/80 rounded border border-gray-700 ${isPresentation ? 'p-6' : 'p-4'}`}>
              <div className={`rounded-full bg-red-900 flex items-center justify-center font-bold text-red-300 shrink-0 border border-red-500 ${isPresentation ? 'w-16 h-16 text-2xl' : 'w-8 h-8 text-xs'}`}>P4</div>
              <div><strong className={`text-red-300 block mb-1 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>AO3: Temporal Validity (Online Dating)</strong><p className={`text-gray-400 leading-relaxed ${isPresentation ? 'text-xl' : 'text-xs'}`}>The 1st Filter (Social Demography) implies we only meet people near us. Dating apps (Tinder/Hinge) have expanded the Field of Availables dramatically, making proximity less of a filter than in 1962.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LESSON 4 SUB-COMPONENTS ---

const FilterFunnelSim: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    const [candidates, setCandidates] = useState([
        { id: 1, name: "Alex", loc: "Local", class: "Similar", values: "Similar", needs: "Comp", status: "Available" },
        { id: 2, name: "Sam", loc: "Distant", class: "Diff", values: "Similar", needs: "Comp", status: "Available" },
        { id: 3, name: "Jo", loc: "Local", class: "Similar", values: "Diff", needs: "Comp", status: "Available" },
        { id: 4, name: "Pat", loc: "Local", class: "Similar", values: "Similar", needs: "Diff", status: "Available" },
        { id: 5, name: "Chris", loc: "Distant", class: "Similar", values: "Diff", needs: "Diff", status: "Available" },
        { id: 6, name: "Taylor", loc: "Local", class: "Diff", values: "Similar", needs: "Comp", status: "Available" },
        { id: 7, name: "Jordan", loc: "Local", class: "Similar", values: "Similar", needs: "Comp", status: "Available" },
        { id: 8, name: "Casey", loc: "Local", class: "Similar", values: "Similar", needs: "Diff", status: "Available" }
    ]);
    const [level, setLevel] = useState(0); // 0=All, 1=Demo, 2=Attitudes, 3=Needs

    const applyFilter = () => {
        if (level === 0) {
            // Filter 1: Social Demography (Location & Class)
            setCandidates(prev => prev.map(c => 
                (c.loc === "Distant" || c.class === "Diff") ? { ...c, status: "Filtered Out" } : c
            ));
            setLevel(1);
        } else if (level === 1) {
            // Filter 2: Similarity in Attitudes
            setCandidates(prev => prev.map(c => 
                (c.status !== "Filtered Out" && c.values === "Diff") ? { ...c, status: "Filtered Out" } : c
            ));
            setLevel(2);
        } else if (level === 2) {
            // Filter 3: Complementarity of Needs
            setCandidates(prev => prev.map(c => 
                (c.status !== "Filtered Out" && c.needs === "Diff") ? { ...c, status: "Filtered Out" } : c
            ));
            setLevel(3);
        } else {
            // Reset
            setCandidates(prev => prev.map(c => ({...c, status: "Available"})));
            setLevel(0);
        }
    };

    const activeCount = candidates.filter(c => c.status === "Available").length;

    return (
        <div className={`h-full grid grid-cols-1 lg:grid-cols-2 ${isPresentation ? 'gap-12' : 'gap-8'}`}>
            <div className="flex flex-col justify-center gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-600">
                    <h3 className={`text-white font-bold mb-2 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>
                        {level === 0 ? "The Field of Availables" : level === 1 ? "1st Filter: Social Demography" : level === 2 ? "2nd Filter: Similarity" : "3rd Filter: Complementarity"}
                    </h3>
                    <p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-xl' : 'text-sm'}`}>
                        {level === 0 ? "Everyone we could theoretically meet." : 
                         level === 1 ? "Narrowed down by Proximity, Social Class, and Education level. Most accessible." :
                         level === 2 ? "Narrowed down by shared beliefs and values. Crucial for first 18 months." :
                         "Narrowed down by ability to meet each other's needs. Crucial for long term (>18 months)."}
                    </p>
                </div>
                
                <button 
                    onClick={applyFilter}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-lg transition-all ${
                        level === 3 ? 'bg-gray-600 hover:bg-gray-500' : 'bg-pink-600 hover:bg-pink-500'
                    } ${isPresentation ? 'text-2xl' : 'text-lg'}`}
                >
                    {level === 3 ? "Reset Pool" : "Apply Next Filter"}
                </button>
            </div>

            <div className="bg-gray-900 rounded-xl border-4 border-gray-700 p-8 relative overflow-hidden flex flex-col items-center">
                {/* Visual Representation of Candidates */}
                <div className="flex flex-wrap gap-4 justify-center content-start h-full">
                    {candidates.map(c => (
                        <div 
                            key={c.id} 
                            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-700 ${
                                c.status === "Filtered Out" 
                                ? 'bg-red-900/20 border-red-900 text-red-900 scale-75 opacity-30 grayscale' 
                                : 'bg-green-600 border-white text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]'
                            }`}
                        >
                            {c.name.substring(0,2)}
                        </div>
                    ))}
                </div>
                
                {/* Filter Visualization Overlay */}
                <div className={`absolute inset-x-0 bottom-0 bg-pink-900/80 backdrop-blur-sm transition-all duration-500 flex items-center justify-center ${level > 0 ? 'h-24' : 'h-0'}`}>
                    <span className="text-pink-200 font-mono uppercase text-sm tracking-widest">
                        {level === 1 ? "Filtering: Location/Class" : level === 2 ? "Filtering: Values" : level === 3 ? "Filtering: Needs" : ""}
                    </span>
                </div>

                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-white font-mono text-xs">
                    Remaining: {activeCount}
                </div>
            </div>
        </div>
    );
};

const AFLCheckL4: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className={`flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto ${isPresentation ? 'gap-12' : 'gap-8'}`}>
        <div className={`bg-gray-900 p-8 rounded-full border-4 border-pink-500/50`}>
            <Filter size={isPresentation ? 100 : 64} className="text-pink-400" />
        </div>
        <h3 className={`font-bold text-white ${isPresentation ? 'text-5xl' : 'text-3xl'}`}>Quick Check: Filter Levels</h3>
        <p className={`text-gray-300 ${isPresentation ? 'text-3xl' : 'text-lg'}`}>"Which filter is considered most important for the stability of long-term relationships (usually defined as longer than 18 months)?"</p>
        
        <div className="grid grid-cols-3 gap-6 w-full">
            <button onClick={() => setSelected('demo')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'demo' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Social Demography</strong>
            </button>
            <button onClick={() => setSelected('sim')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'sim' ? 'bg-red-900/50 border-red-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Similarity</strong>
            </button>
            <button onClick={() => setSelected('comp')} className={`p-6 rounded-xl border-2 transition-all ${selected === 'comp' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                <strong className={`block text-white ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Complementarity</strong>
            </button>
        </div>
        
        {selected === 'comp' && (
            <div className="animate-fadeIn bg-green-900/20 border-l-4 border-green-500 p-4 rounded text-green-300 font-bold text-xl">
                Correct. "Opposites attract" applies here (e.g. nurturing + need for care).
            </div>
        )}
        {(selected === 'demo' || selected === 'sim') && (
            <div className="animate-fadeIn bg-red-900/20 border-l-4 border-red-500 p-4 rounded text-red-300 font-bold text-xl">
                Incorrect. These are more important for formation and short-term maintenance.
            </div>
        )}
    </div>
  );
};

const FailureAnalysisTask: React.FC<{ isPresentation: boolean }> = ({ isPresentation }) => {
    const [caseId, setCaseId] = useState(0);
    const [feedback, setFeedback] = useState<any>(null);

    const cases = [
        {
            id: 1,
            title: "Case 1: The Long Distance",
            desc: "Sarah and Mike met online. They have exactly the same political views and love the same music. However, Mike lives in London and Sarah in New York. They never met.",
            reason: "Demography",
            explanation: "Failed at the 1st Filter (Social Demography). Despite similarity, Proximity (a demographic factor) prevented the relationship from starting."
        },
        {
            id: 2,
            title: "Case 2: The 6-Month Itch",
            desc: "Tom and Jerry met at work (same class/location). They started dating but broke up after 6 months because Tom is very religious and Jerry is an atheist.",
            reason: "Similarity",
            explanation: "Failed at the 2nd Filter (Similarity in Attitudes). Value consensus is crucial for the first 18 months. The clash in core beliefs caused the breakdown."
        },
        {
            id: 3,
            title: "Case 3: The 5-Year Stagnation",
            desc: "Posh and Becks have been together 5 years. They are both from similar backgrounds and share values. But lately, Posh feels she does all the emotional support and Becks gives nothing back.",
            reason: "Complementarity",
            explanation: "Failed at the 3rd Filter (Complementarity of Needs). Long-term success requires meeting each other's needs (e.g. emotional support). It has become unbalanced."
        }
    ];

    const checkAnswer = (answer: string) => {
        if (answer === cases[caseId].reason) {
            setFeedback({ correct: true, text: "Correct! " + cases[caseId].explanation });
        } else {
            setFeedback({ correct: false, text: "Incorrect. Look closely at the duration/nature of the problem." });
        }
    };

    const nextCase = () => {
        if (caseId < 2) {
            setCaseId(prev => prev + 1);
            setFeedback(null);
        }
    };

    return (
        <div className={`h-full grid grid-cols-1 lg:grid-cols-2 ${isPresentation ? 'gap-12' : 'gap-8'}`}>
            <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl relative rotate-1 border-4 border-gray-200 flex flex-col font-serif">
                <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1 font-bold text-xs uppercase">CASE FILE #{caseId + 1}</div>
                <h3 className={`font-bold mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>{cases[caseId].title}</h3>
                <p className={`leading-relaxed mb-6 ${isPresentation ? 'text-2xl' : 'text-lg'}`}>
                    {cases[caseId].desc}
                </p>
                <div className="mt-auto p-4 bg-gray-100 text-gray-600 text-sm font-sans rounded border border-gray-300">
                    <strong>Task:</strong> Identify which Filter Level caused the failure.
                </div>
            </div>

            <div className="flex flex-col justify-center gap-4">
                {!feedback ? (
                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => checkAnswer('Demography')} className={`p-6 rounded-lg text-left border bg-gray-800 border-gray-600 hover:bg-pink-900/50 hover:border-pink-500 transition-all text-white ${isPresentation ? 'text-xl' : 'text-sm'}`}>1. Social Demography</button>
                        <button onClick={() => checkAnswer('Similarity')} className={`p-6 rounded-lg text-left border bg-gray-800 border-gray-600 hover:bg-pink-900/50 hover:border-pink-500 transition-all text-white ${isPresentation ? 'text-xl' : 'text-sm'}`}>2. Similarity in Attitudes</button>
                        <button onClick={() => checkAnswer('Complementarity')} className={`p-6 rounded-lg text-left border bg-gray-800 border-gray-600 hover:bg-pink-900/50 hover:border-pink-500 transition-all text-white ${isPresentation ? 'text-xl' : 'text-sm'}`}>3. Complementarity of Needs</button>
                    </div>
                ) : (
                    <div className={`p-6 rounded-xl border-l-4 animate-slideDown ${feedback.correct ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
                        <strong className={`block text-xl mb-2 ${feedback.correct ? 'text-green-400' : 'text-red-400'}`}>{feedback.correct ? "Diagnosis Confirmed" : "Diagnosis Incorrect"}</strong>
                        <p className="text-gray-300 mb-4">{feedback.text}</p>
                        {caseId < 2 && feedback.correct && (
                            <button onClick={nextCase} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold">Next Case</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ==========================================
// 5. MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(1); 
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPresentation, setIsPresentation] = useState(false);
  const slideCount = 11; 

  const nextSlide = () => { if (currentSlide < slideCount - 1) setCurrentSlide(prev => prev + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(prev => prev - 1); };

  const togglePresentation = () => { 
    if (!isPresentation) {
        if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch((e) => console.log(e));
        setSidebarOpen(false);
        setIsPresentation(true);
    } else {
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch((e) => console.log(e));
        setIsPresentation(false);
    }
  };

  const renderLesson1 = () => {
    switch (currentSlide) {
      case 0: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className="relative mb-8"><div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 rounded-full"></div><Heart size={isPresentation ? 180 : 120} className="text-pink-400 relative z-10" /></div><h1 className={`font-extrabold text-white mb-2 tracking-tight ${isPresentation ? 'text-9xl' : 'text-6xl'}`}>Relationships</h1><div className="h-1 w-32 bg-pink-600 my-6"></div><h2 className={`text-gray-400 font-light tracking-widest uppercase mb-12 ${isPresentation ? 'text-5xl' : 'text-2xl'}`}>Lesson 01: Evolutionary Explanations</h2><button onClick={nextSlide} className={`group relative bg-gray-800 text-white font-bold rounded-full overflow-hidden border border-pink-500/50 hover:border-pink-400 transition-all ${isPresentation ? 'px-16 py-8 text-4xl' : 'px-8 py-4'}`}><span className="relative z-10 flex items-center gap-2">Lesson Start <ChevronRight className="group-hover:translate-x-1 transition-transform"/></span><div className="absolute inset-0 bg-pink-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div></button></div></Slide>);
      case 1: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 1: Activation" title="Do Now Task" icon={Clock} time="10 MINS" isPresentation={isPresentation} /><DoNowQuiz questions={lesson1DoNow} isPresentation={isPresentation} /></Slide>);
      case 2: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Sexual Selection" icon={Dna} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Anisogamy</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>The differences between male and female sex cells (gametes). <br/><br/><strong>Male Sperm:</strong> Highly mobile, created continuously in vast numbers, little energy required. <br/><strong>Female Eggs:</strong> Large, static, produced at intervals for limited years, huge energy investment.</p></div><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Reproductive Strategy</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Males:</strong> Quantity over Quality. Mating with as many females as possible increases reproductive success. <br/><br/><strong>Females:</strong> Quality over Quantity. Because eggs are rare (and pregnancy is costly), females must be choosier about their partner's genetic quality and resources.</p></div></div></Slide>);
      case 3: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Selection Strategies" icon={GitMerge} time="15 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-blue-900/10 rounded-xl border-t-8 border-blue-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-blue-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Intra-sexual Selection</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Male Strategy (Competition).</strong> Males compete with other males for access to females. The 'winner' passes on the genes that contributed to his victory (e.g. size, strength, aggression). This explains sexual dimorphism (why men are larger).</p></div><div className={`bg-pink-900/10 rounded-xl border-t-8 border-pink-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-pink-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Inter-sexual Selection</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Female Strategy (Choice).</strong> Females choose the best available mate. They look for indicators of good genes ('Sexy Sons Hypothesis') and resources (provision). This drives males to display these traits.</p></div></div></Slide>);
      case 4: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Check" title="Mid-Lesson Check" icon={Activity} time="" isPresentation={isPresentation} /><AFLCheckL1 isPresentation={isPresentation} /></Slide>);
      case 5: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Research Evidence (AO3)" icon={Search} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Buss (1989)</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Procedure:</strong> Surveyed over 10,000 adults in 33 countries asking about partner preferences.<br/><br/><strong>Findings:</strong> Universal agreement. Females placed greater value on resource-related characteristics (good financial prospects, ambition). Males valued reproductive capacity (youth, physical attractiveness).</p></div><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Clark & Hatfield (1989)</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Procedure:</strong> Confederates approached students on a campus: "I find you very attractive. Would you go to bed with me?"<br/><br/><strong>Findings:</strong> 75% of men agreed immediately. 0% of women agreed. Supports the evolutionary prediction that females are choosier than males.</p></div></div></Slide>);
      case 6: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice" title="Simulation Briefing" icon={Users} time="" isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 animate-pulse bg-pink-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><Heart size={isPresentation ? 150 : 80} className="text-pink-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>The Mating Game</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Select a reproductive strategy (Male/Female) and choose the candidates that maximize your evolutionary success.</p><button onClick={nextSlide} className={`bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Find a Mate</button></div></Slide>);
      // LESSON 1 SIMULATION RESTORED HERE
      case 7: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice (We Do)" title="Simulation: Partner Choice" icon={Heart} time="" isPresentation={isPresentation} /><EvolutionaryStrategySim isPresentation={isPresentation} /></Slide>);
      case 8: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Essay Planning" icon={Layers} time="20 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-1 lg:grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col ${isPresentation ? 'p-12' : 'p-8'}`}><div className={`flex items-center gap-3 mb-6 border-b border-gray-600 pb-4`}><span className={`bg-pink-600 text-white font-bold rounded ${isPresentation ? 'px-4 py-2 text-xl' : 'px-3 py-1 text-sm'}`}>16 MARKS</span><h3 className={`font-bold text-gray-200 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Exam Question</h3></div><p className={`text-white font-semibold leading-snug mb-6 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>"Discuss evolutionary explanations for partner preferences."</p><div className={`bg-black/30 rounded border-l-4 border-pink-500 mb-6 flex-grow ${isPresentation ? 'p-10' : 'p-4'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest ${isPresentation ? 'text-lg' : 'text-xs'}`}>Key Content</h4><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Anisogamy, Inter/Intra-sexual selection, Buss, Clark & Hatfield.</p></div></div><EssayPlanRevealL1 isPresentation={isPresentation} /></div></Slide>);
      case 9: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className={`bg-green-500/20 rounded-full mb-8 ${isPresentation ? 'p-12' : 'p-6'}`}><CheckCircle size={isPresentation ? 150 : 80} className="text-green-500" /></div><h2 className={`font-bold text-white mb-4 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>Lesson 01 Complete</h2><p className={`text-gray-400 mb-8 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>You have mastered Evolutionary Theory.</p><div className={`bg-gray-800 rounded-xl border border-gray-700 ${isPresentation ? 'p-12' : 'p-6'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest mb-2 ${isPresentation ? 'text-2xl' : 'text-xs'}`}>Next Lesson</h4><div className="flex items-center justify-between"><button onClick={() => { setCurrentLesson(2); setCurrentSlide(0); }} className={`font-bold text-white hover:text-pink-400 transition-colors ${isPresentation ? 'text-4xl' : 'text-xl'}`}>02: Physical Attractiveness</button><ChevronRight className="text-gray-500" /></div></div></div></Slide>);
      default: return null;
    }
  };

  const renderLesson2 = () => {
    switch (currentSlide) {
      case 0: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className="relative mb-8"><div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 rounded-full"></div><Star size={isPresentation ? 180 : 120} className="text-pink-400 relative z-10" /></div><h1 className={`font-extrabold text-white mb-2 tracking-tight ${isPresentation ? 'text-9xl' : 'text-6xl'}`}>Relationships</h1><div className="h-1 w-32 bg-pink-600 my-6"></div><h2 className={`text-gray-400 font-light tracking-widest uppercase mb-12 ${isPresentation ? 'text-5xl' : 'text-2xl'}`}>Lesson 02: Physical Attractiveness</h2><button onClick={nextSlide} className={`group relative bg-gray-800 text-white font-bold rounded-full overflow-hidden border border-pink-500/50 hover:border-pink-400 transition-all ${isPresentation ? 'px-16 py-8 text-4xl' : 'px-8 py-4'}`}><span className="relative z-10 flex items-center gap-2">Lesson Start <ChevronRight className="group-hover:translate-x-1 transition-transform"/></span><div className="absolute inset-0 bg-pink-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div></button></div></Slide>);
      case 1: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 1: Activation" title="Do Now Task" icon={Clock} time="10 MINS" isPresentation={isPresentation} /><DoNowQuiz questions={lesson2DoNow} isPresentation={isPresentation} /></Slide>);
      case 2: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="The Halo Effect" icon={Star} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>What is beautiful is good</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Dion et al. (1972)</strong> found that physically attractive people are consistently rated as kind, strong, sociable, and successful compared to unattractive people. This is a <strong>Cognitive Bias</strong>. We assume they have positive personality traits based solely on their appearance.</p></div><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Evolutionary Roots</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Symmetry:</strong> A signal of genetic fitness (hard to fake). <br/><strong>Neoteny (Baby Face):</strong> Large eyes, small nose. Triggers protective/caring instincts. Essential for females (suggests youth/fertility).</p></div></div></Slide>);
      case 3: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="The Matching Hypothesis" icon={GitMerge} time="15 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-blue-900/10 rounded-xl border-t-8 border-blue-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-blue-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Walster et al. (1966)</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Proposed that while we all <em>desire</em> the most attractive partner, in reality, we go for partners who are of a <strong>similar level of attractiveness</strong> to ourselves.</p></div><div className={`bg-pink-900/10 rounded-xl border-t-8 border-pink-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-pink-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>The Mechanism</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>This is a compromise. We balance the desire for the 'best' genes against the <strong>fear of rejection</strong>. We make a realistic judgement of our own value to avoid being rejected by someone 'out of our league'.</p></div></div></Slide>);
      case 4: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Check" title="Mid-Lesson Check" icon={Activity} time="" isPresentation={isPresentation} /><AFLCheckL2 isPresentation={isPresentation} /></Slide>);
      case 5: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Evaluation (AO3)" icon={Search} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Political Implications</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Palmer & Peterson (2012)</strong> found physically attractive people were rated as more politically knowledgeable and competent. This suggests the Halo Effect has serious real-world implications for democracy (voters may choose the 'face' rather than the policy).</p></div><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Individual Differences</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Towhey (1979)</strong> found that not everyone is influenced by physical attractiveness. Participants who scored high on the MACH scale (sexist attitudes) were influenced by looks, whereas low scorers were not. It is not a universal law.</p></div></div></Slide>);
      case 6: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice" title="Simulation Briefing" icon={Users} time="" isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 animate-pulse bg-pink-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><Heart size={isPresentation ? 150 : 80} className="text-pink-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>Ego vs. Evolution</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Manage your Ego. Guess your rating. Find your match.<br/>The ultimate test of Walster's Matching Hypothesis.</p><button onClick={nextSlide} className={`bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Enter Dating Pool</button></div></Slide>);
      // LESSON 2 SIMULATION CORRECTLY PLACED HERE
      case 7: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice (We Do)" title="Simulation: Walster's Theory" icon={Heart} time="" isPresentation={isPresentation} /><MatchingHypothesisSim isPresentation={isPresentation} /></Slide>);
      case 8: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Essay Planning" icon={Layers} time="20 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-1 lg:grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col ${isPresentation ? 'p-12' : 'p-8'}`}><div className={`flex items-center gap-3 mb-6 border-b border-gray-600 pb-4`}><span className={`bg-pink-600 text-white font-bold rounded ${isPresentation ? 'px-4 py-2 text-xl' : 'px-3 py-1 text-sm'}`}>16 MARKS</span><h3 className={`font-bold text-gray-200 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Exam Question</h3></div><p className={`text-white font-semibold leading-snug mb-6 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>"Discuss physical attractiveness as a factor affecting attraction."</p><div className={`bg-black/30 rounded border-l-4 border-pink-500 mb-6 flex-grow ${isPresentation ? 'p-10' : 'p-4'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest ${isPresentation ? 'text-lg' : 'text-xs'}`}>Key Content</h4><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Halo Effect, Matching Hypothesis, Evolutionary roots (Symmetry/Neoteny).</p></div></div><EssayPlanRevealL2 isPresentation={isPresentation} /></div></Slide>);
      case 9: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className={`bg-green-500/20 rounded-full mb-8 ${isPresentation ? 'p-12' : 'p-6'}`}><CheckCircle size={isPresentation ? 150 : 80} className="text-green-500" /></div><h2 className={`font-bold text-white mb-4 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>Lesson 02 Complete</h2><p className={`text-gray-400 mb-8 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>You have analyzed Physical Attractiveness.</p><div className={`bg-gray-800 rounded-xl border border-gray-700 ${isPresentation ? 'p-12' : 'p-6'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest mb-2 ${isPresentation ? 'text-2xl' : 'text-xs'}`}>Next Lesson</h4><div className="flex items-center justify-between"><button onClick={() => { setCurrentLesson(3); setCurrentSlide(0); }} className={`font-bold text-white hover:text-pink-400 transition-colors ${isPresentation ? 'text-4xl' : 'text-xl'}`}>03: Self Disclosure</button><ChevronRight className="text-gray-500" /></div></div></div></Slide>);
      default: return null;
    }
  };

  const renderLesson3 = () => {
    switch (currentSlide) {
      case 0: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className="relative mb-8"><div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 rounded-full"></div><MessageCircle size={isPresentation ? 180 : 120} className="text-pink-400 relative z-10" /></div><h1 className={`font-extrabold text-white mb-2 tracking-tight ${isPresentation ? 'text-9xl' : 'text-6xl'}`}>Relationships</h1><div className="h-1 w-32 bg-pink-600 my-6"></div><h2 className={`text-gray-400 font-light tracking-widest uppercase mb-12 ${isPresentation ? 'text-5xl' : 'text-2xl'}`}>Lesson 03: Self-Disclosure</h2><button onClick={nextSlide} className={`group relative bg-gray-800 text-white font-bold rounded-full overflow-hidden border border-pink-500/50 hover:border-pink-400 transition-all ${isPresentation ? 'px-16 py-8 text-4xl' : 'px-8 py-4'}`}><span className="relative z-10 flex items-center gap-2">Lesson Start <ChevronRight className="group-hover:translate-x-1 transition-transform"/></span><div className="absolute inset-0 bg-pink-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div></button></div></Slide>);
      case 1: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 1: Activation" title="Do Now Task" icon={Clock} time="10 MINS" isPresentation={isPresentation} /><DoNowQuiz questions={lesson3DoNow} isPresentation={isPresentation} /></Slide>);
      case 2: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Social Penetration Theory" icon={Layers} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Altman & Taylor (1973)</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Relationships develop through the gradual revealing of the inner self. It is a reciprocal exchange of information that leads to deep understanding and trust. <br/><br/><strong>Metaphor:</strong> The Onion. We peel back layers over time.</p></div><div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Breadth vs Depth</h3><p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}><strong>Start:</strong> High Breadth, Low Depth. We talk about many superficial topics (weather, work). <br/><strong>Later:</strong> High Depth. We talk about few, intense topics (secrets, fears). <br/><br/><em>"Too much too soon"</em> (High depth early on) violates social norms and can threaten the relationship.</p></div></div></Slide>);
      case 3: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="The Onion Model" icon={Target} isPresentation={isPresentation} /><OnionModel isPresentation={isPresentation} /></Slide>);
      case 4: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="Reciprocity" icon={RefreshCw} time="15 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-blue-900/10 rounded-xl border-t-8 border-blue-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-blue-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Reis & Shaver (1988)</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>For a relationship to develop, disclosure must be <strong>reciprocal</strong>. Once you have disclosed something, your partner should respond with understanding, empathy, and their own disclosure.</p></div><div className={`bg-pink-900/10 rounded-xl border-t-8 border-pink-500 shadow-xl flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}><h3 className={`font-bold text-pink-400 mb-4 ${isPresentation ? 'text-3xl' : 'text-xl'}`}>Balance</h3><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>If one person discloses everything (High Depth) and the other stays silent, the relationship becomes unbalanced and is less likely to succeed. It creates a power imbalance or a feeling of vulnerability.</p></div></div></Slide>);
      case 5: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice" title="Simulation Briefing" icon={Heart} isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 animate-pulse bg-pink-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><MessageSquare size={isPresentation ? 150 : 80} className="text-pink-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>The First Date</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Navigate a first date by choosing what to disclose. Balance Breadth and Depth to maximize Intimacy without scaring them off.</p><button onClick={nextSlide} className={`bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Start Date</button></div></Slide>);
      case 6: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice (We Do)" title="Simulation: Managing Disclosure" icon={MessageSquare} isPresentation={isPresentation} /><FirstDateSim isPresentation={isPresentation} /></Slide>);
      case 7: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Practical Application" icon={Smartphone} isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 bg-blue-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><Wrench size={isPresentation ? 150 : 80} className="text-blue-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>The DM Doctor</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>You are a Relationship Coach. Clients send you screenshots of failing text conversations. Use Social Penetration Theory to fix them.</p><button onClick={nextSlide} className={`bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Open Clinic</button></div></Slide>);
      case 8: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Application Task" icon={Briefcase} time="20 MINS" isPresentation={isPresentation} /><TheDMDoctor isPresentation={isPresentation} /></Slide>);
      default: return null;
    }
  };

  const renderLesson4 = () => {
    switch (currentSlide) {
      case 0: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className="relative mb-8"><div className="absolute inset-0 bg-pink-500 blur-3xl opacity-20 rounded-full"></div><Filter size={isPresentation ? 180 : 120} className="text-pink-400 relative z-10" /></div><h1 className={`font-extrabold text-white mb-2 tracking-tight ${isPresentation ? 'text-9xl' : 'text-6xl'}`}>Relationships</h1><div className="h-1 w-32 bg-pink-600 my-6"></div><h2 className={`text-gray-400 font-light tracking-widest uppercase mb-12 ${isPresentation ? 'text-5xl' : 'text-2xl'}`}>Lesson 04: Filter Theory</h2><button onClick={nextSlide} className={`group relative bg-gray-800 text-white font-bold rounded-full overflow-hidden border border-pink-500/50 hover:border-pink-400 transition-all ${isPresentation ? 'px-16 py-8 text-4xl' : 'px-8 py-4'}`}><span className="relative z-10 flex items-center gap-2">Lesson Start <ChevronRight className="group-hover:translate-x-1 transition-transform"/></span><div className="absolute inset-0 bg-pink-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div></button></div></Slide>);
      case 1: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 1: Activation" title="Do Now Task" icon={Clock} time="10 MINS" isPresentation={isPresentation} /><DoNowQuiz questions={lesson4DoNow} isPresentation={isPresentation} /></Slide>);
      
      // Kerckhoff & Davis Theory
      case 2: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="The Filter Model" icon={Layers} time="10 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}>
          <div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col ${isPresentation ? 'p-10' : 'p-8'}`}>
              <h3 className={`font-bold text-white mb-4 ${isPresentation ? 'text-4xl' : 'text-2xl'}`}>Kerckhoff & Davis (1962)</h3>
              <p className={`text-gray-300 leading-relaxed mb-4 ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Compared the attitudes and personalities of student couples in short-term (&lt;18 months) vs long-term relationships. <br/><br/>They concluded that we have a 'Field of Availables' (everyone we <em>could</em> date) which we narrow down to a 'Field of Desirables' using 3 levels of filters.</p>
          </div>
          <div className={`bg-gray-800 rounded-xl border border-gray-700 flex flex-col justify-center items-center ${isPresentation ? 'p-10' : 'p-8'}`}>
              <div className="w-full space-y-4">
                  <div className="bg-pink-900/50 p-4 rounded text-center border border-pink-500 w-full">1. Social Demography</div>
                  <div className="flex justify-center"><ArrowDown className="text-gray-500" /></div>
                  <div className="bg-pink-900/50 p-4 rounded text-center border border-pink-500 w-3/4 mx-auto">2. Similarity in Attitudes</div>
                  <div className="flex justify-center"><ArrowDown className="text-gray-500" /></div>
                  <div className="bg-pink-900/50 p-4 rounded text-center border border-pink-500 w-1/2 mx-auto">3. Complementarity</div>
              </div>
          </div>
      </div></Slide>);

      // The 3 Levels Detail
      case 3: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 2: Teacher Input" title="The 3 Levels" icon={Filter} time="15 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-3 h-full ${isPresentation ? 'gap-8' : 'gap-4'}`}>
           <div className={`bg-blue-900/10 rounded-xl border-t-8 border-blue-500 shadow-xl flex flex-col ${isPresentation ? 'p-8' : 'p-6'}`}>
              <h3 className={`font-bold text-blue-400 mb-4 ${isPresentation ? 'text-2xl' : 'text-xl'}`}>1. Social Demography</h3>
              <p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-xl' : 'text-sm'}`}><strong>Variables:</strong> Proximity, Social Class, Education Level, Ethnicity.<br/><br/><strong>Impact:</strong> You are more likely to meet people who live near you (Proximity) and share your background (Homogamy). Anyone too different is 'filtered out' early.</p>
           </div>
           <div className={`bg-purple-900/10 rounded-xl border-t-8 border-purple-500 shadow-xl flex flex-col ${isPresentation ? 'p-8' : 'p-6'}`}>
              <h3 className={`font-bold text-purple-400 mb-4 ${isPresentation ? 'text-2xl' : 'text-xl'}`}>2. Similarity</h3>
              <p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-xl' : 'text-sm'}`}><strong>Focus:</strong> Values, Beliefs, Attitudes.<br/><br/><strong>Impact:</strong> Crucial for the first 18 months. We need to agree on basic things (e.g. politics, family values) to encourage deeper communication. Disagreement here leads to the relationship ending ("fizzling out").</p>
           </div>
           <div className={`bg-green-900/10 rounded-xl border-t-8 border-green-500 shadow-xl flex flex-col ${isPresentation ? 'p-8' : 'p-6'}`}>
              <h3 className={`font-bold text-green-400 mb-4 ${isPresentation ? 'text-2xl' : 'text-xl'}`}>3. Complementarity</h3>
              <p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-xl' : 'text-sm'}`}><strong>Focus:</strong> Meeting needs.<br/><br/><strong>Impact:</strong> Crucial for long-term (>18 months). Opposites attract here. One partner may have a need to be nurturing, the other to be cared for. It creates a feeling that the two form a 'whole'.</p>
           </div>
      </div></Slide>);
      
      // Simulation Briefing
      case 4: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice" title="Simulation Briefing" icon={Users} isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 animate-pulse bg-pink-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><Filter size={isPresentation ? 150 : 80} className="text-pink-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>The Filter Funnel</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Start with a pool of potential partners. Apply Kerckhoff & Davis's 3 filters to see who survives the selection process.</p><button onClick={nextSlide} className={`bg-pink-600 text-white rounded-full font-bold hover:bg-pink-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Start Filtering</button></div></Slide>);
      
      // Simulation
      case 5: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Guided Practice (We Do)" title="Simulation: Selection Process" icon={Filter} isPresentation={isPresentation} /><FilterFunnelSim isPresentation={isPresentation} /></Slide>);
      
      // AFL Check
      case 6: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 3: Check" title="Mid-Lesson Check" icon={Activity} isPresentation={isPresentation} /><AFLCheckL4 isPresentation={isPresentation} /></Slide>);

      // Independent Practice Briefing
      case 7: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Practical Application" icon={Wrench} isPresentation={isPresentation} /><div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"><div className={`rounded-full mb-8 bg-blue-900/20 ${isPresentation ? 'p-12' : 'p-6'}`}><Search size={isPresentation ? 150 : 80} className="text-blue-400" /></div><h3 className={`font-bold text-white mb-6 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>Relationship Autopsy</h3><p className={`text-gray-300 mb-8 leading-relaxed ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Analyze failed relationships. Determine which Filter Level was the cause of the breakup.</p><button onClick={nextSlide} className={`bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg ${isPresentation ? 'px-16 py-8 text-3xl' : 'px-10 py-4 text-lg'}`}>Begin Analysis</button></div></Slide>);

      // Independent Practice Task
      case 8: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 4: Independent Practice" title="Application Task" icon={Briefcase} time="20 MINS" isPresentation={isPresentation} /><FailureAnalysisTask isPresentation={isPresentation} /></Slide>);
      
      // NEW: Written Assessment
      case 9: return (<Slide isPresentation={isPresentation}><PhaseHeader phase="Phase 5: Assessment" title="Written Task" icon={PenTool} time="30 MINS" isPresentation={isPresentation} /><div className={`grid grid-cols-1 lg:grid-cols-2 h-full ${isPresentation ? 'gap-12' : 'gap-8'}`}><div className={`bg-gray-800 rounded-xl border border-gray-700 shadow-xl flex flex-col ${isPresentation ? 'p-12' : 'p-8'}`}><div className={`flex items-center gap-3 mb-6 border-b border-gray-600 pb-4`}><span className={`bg-pink-600 text-white font-bold rounded ${isPresentation ? 'px-4 py-2 text-xl' : 'px-3 py-1 text-sm'}`}>16 MARKS</span><h3 className={`font-bold text-gray-200 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>Exam Question</h3></div><p className={`text-white font-semibold leading-snug mb-6 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>"Discuss Filter Theory as an explanation for partner preferences. Refer to the likely stages of a relationship in your answer."</p><div className={`bg-black/30 rounded border-l-4 border-pink-500 mb-6 flex-grow ${isPresentation ? 'p-10' : 'p-4'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest ${isPresentation ? 'text-lg' : 'text-xs'}`}>Key Content</h4><p className={`text-gray-300 leading-relaxed ${isPresentation ? 'text-2xl' : 'text-sm'}`}>Kerckhoff & Davis, Social Demography, Similarity, Complementarity, Winch, Levinger.</p></div></div><EssayPlanRevealL4 isPresentation={isPresentation} /></div></Slide>);

      // Lesson Complete
      case 10: return (<Slide isPresentation={isPresentation}><div className="flex flex-col items-center justify-center h-full text-center"><div className={`bg-green-500/20 rounded-full mb-8 ${isPresentation ? 'p-12' : 'p-6'}`}><CheckCircle size={isPresentation ? 150 : 80} className="text-green-500" /></div><h2 className={`font-bold text-white mb-4 ${isPresentation ? 'text-7xl' : 'text-4xl'}`}>Lesson 04 Complete</h2><p className={`text-gray-400 mb-8 ${isPresentation ? 'text-4xl' : 'text-xl'}`}>You have analyzed Filter Theory.</p><div className={`bg-gray-800 rounded-xl border border-gray-700 ${isPresentation ? 'p-12' : 'p-6'}`}><h4 className={`text-pink-400 font-bold uppercase tracking-widest mb-2 ${isPresentation ? 'text-2xl' : 'text-xs'}`}>Next Lesson</h4><div className="flex items-center justify-between"><button className={`font-bold text-gray-500 cursor-not-allowed transition-colors ${isPresentation ? 'text-4xl' : 'text-xl'}`}>05: Social Exchange Theory (Locked)</button><ChevronRight className="text-gray-700" /></div></div></div></Slide>);

      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} bg-gray-950 border-r border-gray-800 transition-all duration-300 flex flex-col z-20 shadow-2xl relative overflow-hidden`}><div className="p-6 border-b border-gray-800 flex justify-between items-center"><span className="font-black text-xl text-pink-500 tracking-tighter">RELATIONSHIPS</span><button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button></div><div className="flex-grow overflow-y-auto py-4">{lessons.map((lesson) => (<button key={lesson.id} onClick={() => { if (lesson.active) { setCurrentLesson(lesson.id); setCurrentSlide(0); }}} className={`w-full text-left px-6 py-4 border-l-4 transition-all ${currentLesson === lesson.id ? 'border-pink-500 bg-pink-900/10 text-white shadow-[inset_10px_0_20px_-10px_rgba(236,72,153,0.2)]' : 'border-transparent text-gray-500 hover:bg-gray-900 hover:text-gray-300'} ${!lesson.active ? 'opacity-50 cursor-not-allowed' : ''}`}><div className="flex items-center justify-between"><span className="font-bold text-sm tracking-tight">{lesson.title}</span>{currentLesson === lesson.id && <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,1)]"></div>}</div></button>))}</div></div>
      <div className="flex-grow flex flex-col h-full relative bg-[#0a0a0a]">
        
        {/* TOP BAR */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">{!isSidebarOpen && <button onClick={() => setSidebarOpen(true)} className="bg-gray-800 p-2 rounded text-white hover:bg-gray-700 shadow-lg border border-gray-700"><Menu size={20} /></button>}</div>
        <div className="absolute top-4 right-4 z-50 flex gap-2"><button onClick={togglePresentation} className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700/50 backdrop-blur-sm transition-all ${isPresentation ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-gray-800/80'}`} title="Presentation Mode"><Projector size={20} /></button><button onClick={() => setSidebarOpen(!isSidebarOpen)} className="bg-gray-800/80 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700/50 backdrop-blur-sm transition-all" title={isSidebarOpen ? "Maximize Content" : "Show Sidebar"}>{isSidebarOpen ? <Maximize2 size={20} /> : <Minimize2 size={20} />}</button></div>
        
        {/* PROGRESS BAR */}
        <div className="h-1 bg-gray-900 w-full"><div className="h-full bg-gradient-to-r from-pink-800 to-pink-500 transition-all duration-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]" style={{ width: `${((currentSlide + 1) / slideCount) * 100}%` }} /></div>
        
        {/* MAIN CONTENT AREA WITH ZOOM */}
        <main 
          className="flex-grow relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black"
          style={{ zoom: isPresentation ? "1.25" : "1" }}
        >
            {currentLesson === 1 && renderLesson1()}
            {currentLesson === 2 && renderLesson2()}
            {currentLesson === 3 && renderLesson3()}
            {currentLesson === 4 && renderLesson4()}
        </main>
        
        {/* BOTTOM NAV */}
        <div className="h-20 border-t border-gray-800 bg-black/50 backdrop-blur-sm flex items-center justify-between px-8 z-10"><button onClick={() => currentSlide > 0 && setCurrentSlide(prev => prev - 1)} disabled={currentSlide === 0} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${currentSlide === 0 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}><ChevronLeft size={16} /> PREV</button><span className="text-gray-600 font-mono text-xs tracking-widest">{currentSlide + 1} / {slideCount}</span><button onClick={() => currentSlide < (slideCount - 1) && setCurrentSlide(prev => prev + 1)} disabled={currentSlide === (slideCount - 1)} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all ${currentSlide === (slideCount - 1) ? 'text-gray-700 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-500 shadow-lg hover:shadow-pink-500/20'}`}>NEXT <ChevronRight size={16} /></button></div>
      </div>
    </div>
  );
}