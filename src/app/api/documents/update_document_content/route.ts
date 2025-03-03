import {NextRequest, NextResponse} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

export const revalidate = 0;

export async function PUT(request: NextRequest) {
  try {
    const body: {document_id: number; language_code: string; content: string} = await request.json();

    const {document_id, language_code, content} = body;

    if (!document_id) {
      return NextResponse.json({error: 'Missing document_id field'}, {status: 400});
    }

    if (!language_code) {
      return NextResponse.json({error: 'Missing language_code field'}, {status: 400});
    }

    if (!content) {
      return NextResponse.json({error: 'Missing content field'}, {status: 400});
    }

    const response = await axios.put(`${API_BASE_URL}/api/rest/document_content`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
      }
    });

    return NextResponse.json(response.data, {status: 200});
  } catch (err) {
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    // Type guard for HasuraError
    const isHasuraError = (error: unknown): error is HasuraError => {
      return typeof error === 'object' && error !== null && 'response' in error;
    };

    if (isHasuraError(err) && err.response?.data) {
      const hasuraError = err.response.data;
      errorMessage = hasuraError.errors?.[0]?.message || hasuraError.error || hasuraError.message || errorMessage;

      statusCode = err.response.status || statusCode;

      console.error('Hasura error details:', {
        message: errorMessage,
        code: hasuraError.code,
        path: hasuraError.path,
        extensions: hasuraError.extensions
      });
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: isHasuraError(err) ? err.response?.data : null,
        path: isHasuraError(err) ? err.response?.data?.path : null
      },
      {status: statusCode}
    );
  }
}
