export type Topic = 'Prehistoria' | 'Grecia' | 'Roma' | 'Egipto';

export interface KeyValue {
  label: string;
  value: string;
}

export interface PeriodDetails {
  description: string; // General description of lifestyle/work/etc
  attributes: KeyValue[]; // Flexible list: "Work", "Food", "Geography", "Gov Type"
  imagePrompt: string;
  videoKeywords?: string; // Keywords for searching related videos
}

export interface Stage {
  name: string;
  timeframe: string;
  details: PeriodDetails;
}

export interface OriginStage {
  name: string;
  description: string;
  attributes: KeyValue[]; // Flexible: "Locomotion", "Tools" OR "Myth", "Tribe"
  imagePrompt: string;
  videoKeywords?: string;
}

export interface OriginsSection {
  title: string;
  description: string;
  stages: OriginStage[];
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface HistoricalData {
  topic: Topic;
  introduction: string;
  origins: OriginsSection;
  periods: Stage[]; // Main historical periods
  timeline: TimelineEvent[];
}