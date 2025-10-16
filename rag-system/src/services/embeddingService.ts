import { pipeline, env } from "@xenova/transformers";

// Disable local model files to use remote models
env.allowLocalModels = false;

let embeddingPipeline: any = null;

export async function initializeEmbeddingModel(): Promise<void> {
  console.log("Initializing embedding model (Xenova/e5-base-v2)...");
  embeddingPipeline = await pipeline(
    "feature-extraction",
    "Xenova/e5-base-v2"
  );
  console.log("Embedding model initialized successfully!");
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    throw new Error("Embedding model not initialized. Call initializeEmbeddingModel() first.");
  }

  // Add prefix as recommended by e5 model
  const prefixedText = `query: ${text}`;
  const embeddings = await embeddingPipeline(prefixedText, {
    pooling: "mean",
    normalize: true,
  });

  // Convert tensor to array
  return Array.from(embeddings.data as Float32Array);
}

export async function generateDocumentEmbedding(text: string): Promise<number[]> {
  if (!embeddingPipeline) {
    throw new Error("Embedding model not initialized. Call initializeEmbeddingModel() first.");
  }

  // Use "passage: " prefix for documents as recommended by e5 model
  const prefixedText = `passage: ${text}`;
  const embeddings = await embeddingPipeline(prefixedText, {
    pooling: "mean",
    normalize: true,
  });

  // Convert tensor to array
  return Array.from(embeddings.data as Float32Array);
}
