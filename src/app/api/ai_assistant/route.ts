import {NextResponse, NextRequest} from 'next/server';
import {fetchOpenAIResponse} from './providers/openai';

export async function POST(request: NextRequest) {
  try {
    const {messages, context, mode, sourceLanguage, targetLanguage} = await request.json();

    let aiReply;
    if (mode === 'translate') {
      aiReply = await fetchOpenAIResponse([], context, mode, sourceLanguage, targetLanguage);
    } else {
      aiReply = await fetchOpenAIResponse(messages, context);
    }

    return NextResponse.json({text: aiReply});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({error: err.message}, {status: 500});
    }
  }
}
