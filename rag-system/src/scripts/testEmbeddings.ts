import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function queryRag() {
    try {
        // Load the vector store
        console.log('Loading vector store...');
        const vectorStorePath = path.join(__dirname, '../../vector_store.json');
        const entries = JSON.parse(fs.readFileSync(vectorStorePath, 'utf-8'));
        console.log(`Loaded ${entries.length} entries from vector store`);

        // Initialize the embedding model
        console.log('Loading embedding model...');
        const embedder = await pipeline('feature-extraction', 'Xenova/e5-base-v2');

        // Test query - feel free to modify this!
        const query = "Tell me about a time when I felt really happy";
        console.log(`\nQuerying: "${query}"`);

        // Generate embedding for the query
        const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });
        
        // Find most similar entries
        console.log('\nFinding most relevant entries...');
        const results = entries
            .map((entry: any) => ({
                ...entry,
                similarity: cosineSimilarity(Array.from(queryEmbedding.data), entry.embedding)
            }))
            .sort((a: any, b: any) => b.similarity - a.similarity)
            .slice(0, 3);

        console.log('\nTop 3 most relevant entries:');
        results.forEach((result: any, index: number) => {
            console.log(`\n${index + 1}. Similarity: ${result.similarity.toFixed(4)}`);
            console.log(`Date: ${result.metadata?.date ?? 'unknown'}`);
            console.log(`Content: ${result.content.substring(0, 200)}...`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Cosine similarity function
function cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (norm1 * norm2);
}

queryRag();