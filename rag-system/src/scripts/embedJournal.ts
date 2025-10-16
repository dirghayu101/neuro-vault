import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JournalEntry, EmbeddedEntry } from "../types.js";
import { initializeEmbeddingModel, generateDocumentEmbedding } from "../services/embeddingService.js";
import { initializeChroma, getOrCreateCollection, addEntryToCollection, getCollectionCount } from "../services/chromaService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path correctly (from rag-system/dist/scripts to ../../../data/cleaned-data)
const JOURNAL_PATH = path.resolve(__dirname, "../../../data/cleaned-data/journal.json");

async function loadJournalEntries(): Promise<JournalEntry[]> {
  try {
    const data = fs.readFileSync(JOURNAL_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading journal entries:", error);
    throw error;
  }
}

async function embedAndStoreJournal(): Promise<void> {
  try {
    console.log("Starting journal embedding process...\n");

    // Initialize services
    await initializeEmbeddingModel();
    await initializeChroma();
    await getOrCreateCollection();

    // Load journal entries
    console.log("Loading journal entries...");
    const entries = await loadJournalEntries();
    console.log(`Loaded ${entries.length} journal entries\n`);

    // Get current collection count
    const existingCount = await getCollectionCount();
    console.log(`Existing entries in database: ${existingCount}\n`);

    // Embed and store each entry
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      try {
        console.log(`[${i + 1}/${entries.length}] Processing entry: ${entry.date}`);

        // Generate embedding for the entry
        const embedding = await generateDocumentEmbedding(entry.content);

        // Create embedded entry
        const embeddedEntry: EmbeddedEntry = {
          id: entry.id,
          content: entry.content,
          embedding,
          metadata: {
            date: entry.date,
            tags: entry.tags,
            source: entry.source,
          },
        };

        // Add to collection
        await addEntryToCollection(embeddedEntry);
        successCount++;
        console.log(`  ✓ Successfully embedded and stored\n`);
      } catch (error) {
        errorCount++;
        console.error(`  ✗ Error processing entry: ${error}\n`);
      }
    }

    // Summary
    console.log("\n=== Embedding Complete ===");
    console.log(`Successfully embedded: ${successCount} entries`);
    console.log(`Failed: ${errorCount} entries`);
    console.log(`Total in database: ${await getCollectionCount()} entries`);
  } catch (error) {
    console.error("Fatal error during embedding:", error);
    process.exit(1);
  }
}

// Run the script
embedAndStoreJournal();
