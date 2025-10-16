import readline from "readline";
import { initializeEmbeddingModel, generateEmbedding } from "../services/embeddingService.js";
import { initializeChroma, getOrCreateCollection, queryCollection } from "../services/chromaService.js";

async function initializeRAG(): Promise<void> {
  console.log("Initializing RAG system...\n");
  await initializeEmbeddingModel();
  await initializeChroma();
  await getOrCreateCollection();
  console.log("RAG system ready!\n");
}

async function queryRAG(query: string): Promise<void> {
  try {
    console.log(`\nQuerying: "${query}"\n`);

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search the collection
    const results = await queryCollection(queryEmbedding, 5);

    if (results.length === 0) {
      console.log("No similar entries found.");
      return;
    }

    console.log("=== Top Results ===\n");
    results.forEach((result, index) => {
      console.log(`${index + 1}. Date: ${result.date}`);
      console.log(`   Similarity: ${(1 - result.similarity).toFixed(3)}`);
      console.log(`   Content: ${result.content.substring(0, 150)}...`);
      console.log();
    });
  } catch (error) {
    console.error("Error querying RAG:", error);
  }
}

async function interactiveMode(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Type your query or "exit" to quit.\n');

  const askQuestion = (): void => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") {
        console.log("Goodbye!");
        rl.close();
        process.exit(0);
      }

      await queryRAG(input);
      askQuestion();
    });
  };

  askQuestion();
}

async function main(): Promise<void> {
  await initializeRAG();

  // Check for command line arguments
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Single query mode
    const query = args.join(" ");
    await queryRAG(query);
  } else {
    // Interactive mode
    await interactiveMode();
  }
}

main().catch(console.error);
