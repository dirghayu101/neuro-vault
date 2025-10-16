import { EmbeddedEntry, QueryResult } from "../types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.resolve(__dirname, "../../vector_store.json");

interface StoredEntry {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    date: string;
    tags?: string[];
    source?: string;
  };
}

// In-memory vector database
let vectorStore: StoredEntry[] = [];
let initialized = false;

const COLLECTION_NAME = "journal_entries";

export async function initializeChroma(): Promise<void> {
  console.log("Initializing in-memory vector database...");
  
  // Try to load existing vector store from file
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      vectorStore = JSON.parse(data);
      console.log(`Loaded ${vectorStore.length} entries from persistent store`);
    } catch (error) {
      console.log("Could not load persistent store, starting fresh");
      vectorStore = [];
    }
  }
  
  initialized = true;
  console.log("Vector database initialized successfully!");
}

export async function getOrCreateCollection(): Promise<void> {
  if (!initialized) {
    throw new Error("Vector database not initialized. Call initializeChroma() first.");
  }
  console.log(`Using collection: ${COLLECTION_NAME}`);
}

export async function addEntryToCollection(entry: EmbeddedEntry): Promise<void> {
  if (!initialized) {
    throw new Error("Vector database not initialized. Call initializeChroma() first.");
  }

  // Check if entry already exists
  const existingIndex = vectorStore.findIndex((e) => e.id === entry.id);
  if (existingIndex !== -1) {
    vectorStore[existingIndex] = entry;
  } else {
    vectorStore.push(entry);
  }
  
  // Persist to file after each addition (optional: batch persist for better performance)
  persistVectorStore();
}

function persistVectorStore(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(vectorStore, null, 2));
  } catch (error) {
    console.error("Error persisting vector store:", error);
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function queryCollection(
  queryEmbedding: number[],
  topK: number = 5
): Promise<QueryResult[]> {
  if (!initialized) {
    throw new Error("Vector database not initialized. Call initializeChroma() first.");
  }

  if (vectorStore.length === 0) {
    return [];
  }

  // Calculate similarities with all entries
  const similarities = vectorStore.map((entry) => ({
    ...entry,
    similarity: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  // Sort by similarity (descending) and take top K
  const results = similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((result) => ({
      id: result.id,
      content: result.content,
      date: result.metadata.date,
      similarity: result.similarity, // 1 = most similar, -1 = least similar
    }));

  return results;
}

export async function getCollectionCount(): Promise<number> {
  if (!initialized) {
    throw new Error("Vector database not initialized. Call initializeChroma() first.");
  }
  return vectorStore.length;
}

export async function deleteCollection(): Promise<void> {
  vectorStore = [];
  try {
    fs.unlinkSync(DB_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
  console.log(`Cleared collection: ${COLLECTION_NAME}`);
}
