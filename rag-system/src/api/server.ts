import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';
import OpenAI from 'openai';
import { queryCollection, initializeChroma } from '../services/chromaService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
});

// Initialize the embedding model
let embedder: any = null;

async function initializeEmbedder() {
    console.log('Loading embedding model...');
    embedder = await pipeline('feature-extraction', 'Xenova/e5-base-v2');
}

// Initialize everything
async function initialize() {
    await Promise.all([
        initializeEmbedder(),
        initializeChroma()
    ]);
    console.log('Initialization complete!');
}

initialize().catch(console.error);

// API Endpoints
app.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!embedder) {
            return res.status(503).json({ error: 'Embedding model not initialized' });
        }

        // Generate embedding for the query
        const queryEmbedding = await embedder(query, { pooling: 'mean', normalize: true });
        
        // Get relevant entries from vector store
        const results = await queryCollection(Array.from(queryEmbedding.data), 3);
        
        // Send back results in the expected format
        res.json({ 
            results: results.map(entry => ({
                content: entry.content,
                date: entry.date,
                similarity: entry.similarity
            }))
        });

    } catch (error) {
        console.error('Error in query endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', initialized: embedder !== null });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});