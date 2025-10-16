export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags?: string[];
  reflection?: string;
  source?: string;
}

export interface EmbeddedEntry {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    date: string;
    tags?: string[];
    source?: string;
  };
}

export interface QueryResult {
  id: string;
  content: string;
  date: string;
  similarity: number;
}
