
export enum StageId {
  BRAIN = 'brain',
  SKELETON = 'skeleton',
  PRACTICE = 'practice',
  ENGINEERING = 'engineering',
  EVOLUTION = 'evolution'
}

export type Language = 'en' | 'zh';

export interface LearningStep {
  title: string;
  description: string;
  code: string;
}

export interface StageContent {
  title: string;
  subtitle: string;
  description: string;
  topics: string[];
  steps: LearningStep[];
}

export interface Stage {
  id: StageId;
  color: string;
  en: StageContent;
  zh: StageContent;
}

export interface AgentLog {
  id: string;
  timestamp: Date;
  type: 'thought' | 'action' | 'observation' | 'system';
  content: string;
}
