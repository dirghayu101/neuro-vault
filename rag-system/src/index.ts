import { initializeEmbeddingModel } from "./services/embeddingService.js";
import { initializeChroma, getOrCreateCollection, getCollectionCount } from "./services/chromaService.js";

async function main(): Promise<void> {
  console.log("=== Neuro Vault RAG System ===\n");

  try {
    // Initialize services
    await initializeEmbeddingModel();
    await initializeChroma();
    await getOrCreateCollection();

    // Get stats
    const count = await getCollectionCount();

    console.log("\n=== System Status ===");
    console.log(`✓ Embedding model: Xenova/e5-base-v2`);
    console.log(`✓ Vector database: Chroma (in-memory)`);
    console.log(`✓ Journal entries in database: ${count}`);

    console.log("\n=== Available Commands ===");
    console.log("npm run embed   - Embed journal entries");
    console.log("npm run query   - Interactive RAG query mode");
    console.log('npm run query "your question here" - Query with text');

    console.log("\n=== Getting Started ===");
    console.log("1. Run: npm install");
    console.log("2. Run: npm run build");
    console.log("3. Run: npm run embed   (to embed your journal)");
    console.log("4. Run: npm run query   (to start querying)");
  } catch (error) {
    console.error("Error initializing RAG system:", error);
    process.exit(1);
  }
}

main();
