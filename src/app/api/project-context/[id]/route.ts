import {NextResponse, NextRequest} from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || '';

interface HasuraError {
  response?: {
    data: {
      errors?: Array<{message: string}>;
      error?: string;
      message?: string;
      code?: string;
      extensions?: any;
    };
    status?: number;
  };
}

export async function PUT(request: NextRequest, {params}: {params: {id: string}}) {
  try {
    const {id} = params;
    const body = await request.json();
    const {content} = body;

    // Validate required fields
    if (!content) {
      return NextResponse.json({error: 'content field is required'}, {status: 400});
    }

    if (!id) {
      return NextResponse.json({error: 'id parameter is required'}, {status: 400});
    }

    // Make PUT request to Hasura REST API
    const response = await axios.put(
      `${API_BASE_URL}/api/rest/project-context-blocks/${id}`,
      {
        content: content,
        updated_at: new Date().toISOString()
      },
      {
        headers: {
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
          'Content-Type': 'application/json'
        }
      }
    );

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
        extensions: hasuraError.extensions
      });
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: isHasuraError(err) ? err.response?.data : null
      },
      {status: statusCode}
    );
  }
}
