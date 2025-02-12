import axios from 'axios';

import {CHAT_GPT_MODEL} from 'config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || CHAT_GPT_MODEL;

export const fetchOpenAIResponse = async (messages: {sender: string; text: string}[], context: string) => {
  if (!OPENAI_API_KEY) {
    throw new Error('API key is missing. Please set OPENAI_API_KEY in your environment variables.');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {role: 'system', content: `You are an AI assistant. Use the following context: ${context}`},
          ...messages.map(msg => ({role: msg.sender === 'User' ? 'user' : 'assistant', content: msg.text}))
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(`OpenAI API error: ${error.response?.status || 'Unknown error'}`);
    } else {
      throw new Error(`Unexpected error: ${String(error)}`);
    }
  }
};
