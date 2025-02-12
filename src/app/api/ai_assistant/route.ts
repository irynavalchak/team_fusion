import {NextResponse, NextRequest} from 'next/server';
import {fetchOpenAIResponse} from './providers/openai';

export async function POST(request: NextRequest) {
  try {
    const {messages, context} = await request.json();
    const aiReply = await fetchOpenAIResponse(messages, context);
    return NextResponse.json({text: aiReply});
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({error: err.message}, {status: 500});
    }
  }
}
