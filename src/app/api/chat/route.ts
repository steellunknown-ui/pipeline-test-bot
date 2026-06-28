import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY environment variable is missing.");
    }

    // Create an OpenAI client configured for OpenRouter
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY, 
    });

    const result = streamText({
      model: openrouter('openai/gpt-oss-120b:free'),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("API Chat Error:", error);
    return new Response(
      error.message || "An unknown error occurred in the chat API",
      { status: 500 }
    );
  }
}
