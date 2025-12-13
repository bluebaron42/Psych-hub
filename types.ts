export type Level = 'GCSE' | 'ALEVEL';
export type SlideType = 'title' | 'content' | 'experiment' | 'quiz';

export type ModuleCategory = 
  | 'GCSE_PAPER1'     // Year 10
  | 'GCSE_PAPER2'     // Year 11
  | 'ALEVEL_PAPER1'   // Introductory Topics
  | 'ALEVEL_PAPER2'   // Psychology in Context
  | 'ALEVEL_PAPER3';  // Issues and Options

export interface ExperimentConfig {
  type: 'digit-span' | 'stroop' | 'none';
  parameters?: Record<string, any>;
}

export interface Slide {
  id: string;
  type: SlideType;
  title: string;
  content: string[];
  experimentConfig?: ExperimentConfig;
  speakerNotes?: string; // For AI context
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  slides: Slide[];
}

export interface LessonModule {
  id: string;
  level: Level;
  category: ModuleCategory;
  moduleTitle: string;
  moduleDesc: string;
  // Pre-defined lessons or generated ones
  lessons: Lesson[];
}

export type ViewState = 'HOME' | 'PAPER_SELECT' | 'MODULE_LIST' | 'LESSON' | 'SUB_APP';