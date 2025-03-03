import axios from 'axios';

import {CHAT_GPT_MODEL} from 'config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || CHAT_GPT_MODEL;

export const fetchOpenAIResponse = async (
  messages: {sender: string; text: string}[],
  context: string,
  mode?: 'translate',
  sourceLanguage?: string,
  targetLanguage?: string
) => {
  if (!OPENAI_API_KEY) {
    throw new Error('API key is missing. Please set OPENAI_API_KEY in your environment variables.');
  }

  try {
    let prompt;
    if (mode === 'translate') {
      prompt = `You are a professional translator with expertise in ${sourceLanguage} and ${targetLanguage}. 
        Maintain all formatting, paragraph structure, and special characters from the original text.
        Translate the following text from ${sourceLanguage} to ${targetLanguage} accurately, preserving the original meaning, tone, and style.
        Provide **ONLY** the translated text.
        Do NOT add any comments, disclaimers, or explanations.
        Do NOT translate abbreviations and acronyms
        Do NOT mention Open AI, training data or any other information. 
        Here is the text to translate: ${context}`;
    } else {
      prompt = `You are an AI assistant. Use the following context: ${context}`;
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          {role: 'system', content: prompt},
          ...messages.map(msg => ({role: msg.sender === 'User' ? 'user' : 'assistant', content: msg.text}))
        ],
        temperature: 0.3
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
