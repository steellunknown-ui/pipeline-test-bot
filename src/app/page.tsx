'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch h-screen">
      <div className="flex-1 overflow-y-auto pb-24">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap mb-4">
            <span className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</span>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-2 mb-8 bg-white border border-gray-300 rounded shadow-xl">
        <input
          className="w-full p-2 outline-none text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
