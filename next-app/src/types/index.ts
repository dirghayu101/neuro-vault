export interface JournalEntry {
  id: string;
  content: string;
  date: string;
  metadata?: {
    source?: string;
    tags?: string[];
  };
}

export interface QueryResult {
  id: string;
  content: string;
  date: string;
  similarity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}