export type Language = "tr" | "en";

export type WordType = "verb" | "substantiv" | "adjektiv" | "connector" | "phrase";
export type GermanGender = "der" | "die" | "das" | "pl";

export interface Conjugation {
  prasens3rd?: string;
  prateritum?: string;
  perfekt?: string;
  hilfsverb?: "haben" | "sein";
}

export interface VocabularyItem {
  id: string;
  german: string;
  type: WordType;
  article?: GermanGender;
  plural?: string;
  preposition?: string;
  governedCase?: "Akk" | "Dat" | "Gen";
  meaningTr: string;
  meaningEn: string;
  example?: string;
  level?: "A1" | "A2" | "B1" | "B2" | "C1";
  conjugation?: Conjugation;
  // Spaced repetition fields
  repetitions?: number;
  intervalDays?: number;
  easeFactor?: number;
  nextReviewDate?: string;
  lastReviewedDate?: string;
}

export type ConnectorGroup = "position_0" | "nebensatz" | "position_1" | "zweiteilig";

export interface ConnectorItem {
  id: string;
  name: string;
  group: ConnectorGroup;
  groupTitleTr: string;
  groupTitleEn: string;
  formula: string;
  meaningTr: string;
  meaningEn: string;
  example: string;
  level: string;
  notesTr?: string;
  notesEn?: string;
}

export interface TextNote {
  id: string;
  title: string;
  level: string;
  category: string;
  updated: string;
  content: string;
  rawFile: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "verb" | "preposition" | "case" | "noun" | "connector";
  category?: string;
  level?: string;
  meaningTr?: string;
  meaningEn?: string;
  example?: string;
  article?: GermanGender;
  prep?: string;
  kasus?: string;
  formula?: string;
  color?: string;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: "takes_preposition" | "governs_case" | "root_derivation" | "governs_order" | "example";
  label?: string;
}

export interface ExerciseItem {
  id: string;
  type: "cloze" | "sentence_builder";
  category: string;
  level: string;
  promptTr: string;
  promptEn: string;
  sentenceParts?: string[];
  options?: string[];
  correctAnswer?: string;
  words?: string[];
  correctOrder?: string[];
  targetMeaningTr?: string;
  targetMeaningEn?: string;
  explanationTr: string;
  explanationEn: string;
}

export interface AppDatabase {
  metadata: {
    lastSynced: string;
    totalVocabulary: number;
    totalConnectors: number;
    totalNotes: number;
    totalGraphNodes: number;
    totalGraphEdges: number;
    totalExercises: number;
  };
  vocabulary: VocabularyItem[];
  connectors: ConnectorItem[];
  notes: TextNote[];
  exercises: ExerciseItem[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}
