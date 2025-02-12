import {CHAT_GPT_MODEL} from 'config';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || CHAT_GPT_MODEL;

export const fetchOpenAIResponse = async (messages: {sender: string; text: string}[], context: string) => {
  if (!OPENAI_API_KEY) {
    throw new Error('API key is missing. Please set OPENAI_API_KEY in your environment variables.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {role: 'system', content: `You are an AI assistant. Use the following context: ${context}`},
        ...messages.map(msg => ({role: msg.sender === 'User' ? 'user' : 'assistant', content: msg.text}))
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
