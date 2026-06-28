'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ parts: [{ type: 'text', text: input }], role: 'user' });
    setInput('');
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch h-screen">
      <div className="flex-1 overflow-y-auto pb-24">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap mb-4">
            <span className="font-bold">{m.role === 'user' ? 'User: ' : 'AI: '}</span>
            {m.parts ? m.parts.map((p, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null) : null}
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
