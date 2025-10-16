# Neuro Vault 🧠

A personal journal analysis and reflection system that transforms your raw thoughts into structured insights and wisdom. Neuro Vault helps you create a "second brain" from your journal entries, enabling deeper self-understanding and personal growth through AI-powered analysis.

## 🎯 Vision

Transform personal journaling into an intelligent system that:

- Provides contextual emotional support through RAG (Retrieval-Augmented Generation)
- Extracts patterns and themes from your thoughts over time
- Delivers personalized wisdom nuggets from your past entries
- Creates a structured knowledge base of your personal growth journey

## 🚀 Features (Planned)

### Core Features

- **RAG-powered Chat**: Get contextual responses based on your journal history when you're feeling down
- **Daily Wisdom**: Receive nuggets of insight from your past entries
- **Theme Analysis**: Automatically detect and organize entries by emotional themes (loneliness, insecurity, growth, etc.)
- **Pattern Recognition**: Identify recurring thoughts, emotions, and behavioral patterns
- **Life Principles Extraction**: Automatically extract and organize life lessons from your journals

### Future Possibilities

- **MCP Server Integration**: Automated data cleaning and organization
- **Reflection Prompts**: AI-generated questions based on your past entries
- **Emotional Tone Analysis**: Track your emotional journey over time
- **Personal Philosophy Builder**: Create your evolving life manual from insights

## 📁 Project Structure

```text
neuro-vault/
├── data/
│   ├── cleaned-data/        # Structured journal entries
│   │   ├── journal.example.ts  # Example entry format
│   │   ├── journal.ts          # Your actual entries (gitignored)
│   │   └── types.ts           # TypeScript type definitions
│   └── raw-data/           # Unprocessed journal data
├── idea/                   # Project planning and documentation
│   ├── 1-possibilities.md  # Feature brainstorming
│   ├── 2-mvp.md           # MVP definition and wishlist
│   └── 3-breakdown.md     # Development tasks
└── README.md
```

## 🏗️ Current Status

### Phase: Data Structure & Planning

✅ **Completed:**

- TypeScript type system for journal entries
- Example data structure
- Project vision and feature planning

🚧 **In Progress:**

- Data cleaning and organization
- RAG system foundation

📋 **Next Steps:**

1. Build RAG system (bedrock for all other features)
2. Implement basic chat interface
3. Add theme detection and analysis

## 📝 Data Model

### JournalEntry Type

```typescript
export type JournalEntry = {
  id: `${string}-${string}-${string}-${string}-${string}`; // UUID format
  date: Date;
  source?: "whatsapp" | "pages";
  tags?: string[];
  content: string;
  reflection?: string;
}
```

### Example Entry

```typescript
{
  id: crypto.randomUUID(),
  date: new Date("2023-02-26"),
  source: "pages",
  content: "your content comes here..",
  tags: ["angry", "if you have any"],
  reflection: "if you have any"
}
```

## 🛠️ Technology Stack

- **Language**: TypeScript
- **Version Control**: Git
- ..not sure

## 📖 Usage Philosophy

The idea of Neuro Vault is that your journal entries contain valuable patterns and wisdom that can guide your personal growth. By organizing and analyzing your thoughts over time it might be possible to:

1. **Create a Second Brain**: Organize entries into meaningful themes and knowledge maps
2. **Extract Personal Principles**: Build your own evolving life philosophy from recurring insights
3. **Identify Growth Patterns**: See how your beliefs and emotional responses evolve

## 🔐 Privacy

I am not sure yet.

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd neuro-vault
   ```

2. **Set up your journal**
   - Copy `data/cleaned-data/journal.example.ts` to `data/cleaned-data/journal.ts`
   - Start adding your entries following the provided structure

3. **Begin your journey**
   - Add your raw journal entries to the structured format
   - Use the planning documents in `/idea` to understand the vision
   - Contribute to building the RAG system and analysis features

## 🤝 Contributing

This is a personal project, but the structure and ideas might be useful for others building similar journaling and self-reflection tools. Feel free to adapt the concepts for your own personal growth system.

## 📄 License

All yours!

---

> “Should I kill myself, or have a cup of coffee?” ― Albert Camus

Transform your journal from a simple record into an intelligent companion for personal growth.
