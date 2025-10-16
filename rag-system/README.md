# Neuro Vault RAG System

A TypeScript-based RAG (Retrieval-Augmented Generation) system for your personal journal using:
- **Embedding Model:** Xenova/e5-base-v2 (via transformers.js)
- **Vector Database:** Chroma
- **Language:** TypeScript

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build TypeScript

```bash
npm run build
```

### 3. Embed Your Journal Entries

```bash
npm run embed
```

This will:
- Load entries from `../data/cleaned-data/journal.json`
- Generate embeddings using e5-base-v2
- Store embeddings in Chroma database

### 4. Query Your Journal

**Interactive mode (chat-like):**
```bash
npm run query
```

**Single query:**
```bash
npm run query "How did I feel about loneliness?"
```

## Project Structure

```
rag-system/
├── src/
│   ├── types.ts              # TypeScript interfaces
│   ├── index.ts              # Main entry point
│   ├── services/
│   │   ├── embeddingService.ts    # Embedding model logic
│   │   └── chromaService.ts       # Chroma DB operations
│   └── scripts/
│       ├── embedJournal.ts        # Embed & store entries
│       └── queryRag.ts            # Query interface
├── dist/                     # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Embedding:** Each journal entry is converted into a semantic vector using e5-base-v2
2. **Storage:** Vectors are stored in Chroma with metadata (date, tags, source)
3. **Retrieval:** Your query is embedded and Chroma finds the most similar entries
4. **Results:** Top 5 similar entries are returned with similarity scores

## Environment Variables

Copy `.env.example` to `.env` if you want to customize paths:

```bash
cp .env.example .env
```

## Notes

- First embedding run will download the model (~2GB) - this is a one-time operation
- Chroma stores data in memory by default; modify chromaService.ts if you want persistence
- e5 model is optimized for semantic search and performs well on journal-like text

## Next Steps

After embedding and querying work:
- Integrate with an LLM (e.g., OpenAI) for contextual responses
- Add theme extraction and analysis
- Build a web interface with Streamlit or React
