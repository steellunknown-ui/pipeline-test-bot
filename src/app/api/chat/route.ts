import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create an OpenAI client configured for OpenRouter
  // Vercel deployment will automatically inject OPENROUTER_API_KEY from the Deployment Engine!
  const openrouter = openai({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY, 
  });

  const result = streamText({
    model: openrouter('qwen/qwen3-next-80b-a3b-instruct:free'), // using the requested free model
    messages,
  });

  return result.toDataStreamResponse();
}
