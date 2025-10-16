'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto max-w-4xl h-screen">
        <ChatInterface />
      </div>
    </main>
  );
}
