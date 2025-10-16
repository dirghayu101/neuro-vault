import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function queryRAGSystem(query: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RAG_API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('RAG system query failed');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error querying RAG system:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Query the RAG system for relevant context
    const relevantEntries = await queryRAGSystem(message);
    
    // Prepare context from relevant entries
    const context = relevantEntries
      .map((entry: any) => `Entry (${entry.date}): ${entry.content}`)
      .join('\n\n');

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant with access to the user's personal journal entries.
          When responding, use the context from their journal to provide personalized and empathetic responses.
          Remember past experiences and patterns from the journal entries to make your responses more relevant.
          
          Context from journal:
          ${context}`
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}